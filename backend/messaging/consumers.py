import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from .models import Chats, Message
from django.utils import timezone

User = get_user_model()

logger = logging.getLogger(__name__)

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.chat_id = self.scope['url_route']['kwargs']['chat_id']

        try:
            chat = await database_sync_to_async(Chats.objects.get)(chat_id=self.chat_id)
        except Chats.DoesNotExist:
            await self.close()  # Invalid chat
            return

        # Join room group
        await self.channel_layer.group_add(
            self.chat_id,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        if self.chat_id:
            logger.info(f"Disconnecting from room: {self.room_name}")
            # Leave room group
            await self.channel_layer.group_discard(
                self.chat_id,
                self.channel_name
            )

    async def receive(self, text_data):
        print(text_data)
        logger.info(f"Received message: {text_data}")
        try:
            text_data_json = json.loads(text_data)
            message = text_data_json['message']
            username = text_data_json['user']
            user = await database_sync_to_async(User.objects.filter(username=username).first)()


            if user is None:
                logger.error(f"User with username {username} does not exist")
            print(user.username)
            chat = await database_sync_to_async(Chats.objects.filter(chat_id = self.chat_id, users = user).first)()
            # Check if the user is allowed to send messages (either admin or non-admin in this room)
            saved_message = await database_sync_to_async(Message.objects.create)(chat=chat, message=message, user=user)

            
            local_timestamp = timezone.localtime(saved_message.timestamp)

            # Format the local time
            formatted_timestamp = local_timestamp.strftime('%Y-%m-%d %H:%M:%S')
            # Send message to room group
            await self.channel_layer.group_send(
                self.chat_id,
                {
                    'type': 'chat_message',
                    'message': message,
                    'user': user.username,
                    'timestamp': formatted_timestamp
                }
            )
        except Exception as e:
            logger.error(f"Error in receive: {e}")

    async def chat_message(self, event):
        try:
            logger.info(f"Sending message to WebSocket: {event['message']}")
            message = event['message']
            user = event['user']
            timestamp = event['timestamp']

            # Send message to WebSocket
            await self.send(text_data=json.dumps({
                'message': message,
                'user': user,
                'timestamp': timestamp
            }))
        except Exception as e:
            logger.error(f"Error in chat_message: {e}")
