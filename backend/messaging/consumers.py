import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from .models import Chats, Message

User = get_user_model()

logger = logging.getLogger(__name__)

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        print(self.room_name)
        
        # Extract usernames from the room name (expected format: admin_user)
        room_parts = self.room_name.split('_')
        print(room_parts)
        if len(room_parts) != 2:
            await self.close()  # Invalid room format
            return

        # Determine if it's a valid room between an admin and a user
        admin_username, user_username = room_parts
        try:
            admin_user = await database_sync_to_async(User.objects.get)(username=admin_username, is_staff=True)
            other_user = await database_sync_to_async(User.objects.get)(username=user_username, is_staff=False)
        except User.DoesNotExist:
            await self.close()  # Invalid users
            return
        
        if not other_user.is_authenticated:
            await self.close()  # Close the connection if not authenticated
            return

        # Set the room group name
        self.room_group_name = f'chat_{self.room_name}'
        logger.info(f"Connecting to room: {self.room_name}")
        logger.info(f"Group name: {self.room_group_name}")

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        if self.room_group_name:
            logger.info(f"Disconnecting from room: {self.room_name}")
            # Leave room group
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        print(text_data)
        print(self.room_name)
        logger.info(f"Received message: {text_data}")
        try:
            text_data_json = json.loads(text_data)
            message = text_data_json['message']
            username = text_data_json['user']
            user = await database_sync_to_async(User.objects.filter(username=username).first)()


            if user is None:
                logger.error(f"User with username {username} does not exist")
            print(user.username)
            chat = await database_sync_to_async(Chats.objects.filter(room = self.room_name).first)()
            # Check if the user is allowed to send messages (either admin or non-admin in this room)
            room = await database_sync_to_async(Chats.objects.get)(room=self.room_name)
            await database_sync_to_async(Message.objects.create)(chat=chat, message=message, user=user)

            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message,
                    'user': user.id,
                }
            )
        except Exception as e:
            logger.error(f"Error in receive: {e}")

    async def chat_message(self, event):
        try:
            logger.info(f"Sending message to WebSocket: {event['message']}")
            message = event['message']
            user = event['user']

            # Send message to WebSocket
            await self.send(text_data=json.dumps({
                'message': message,
                'user': user
            }))
        except Exception as e:
            logger.error(f"Error in chat_message: {e}")
