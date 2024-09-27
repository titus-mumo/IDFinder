from rest_framework import serializers
from .models import Chats, Message

class ChatRoomSerializer(serializers.ModelSerializer):
    latest_message = serializers.CharField(read_only=True)  # This will hold the latest message content
    user = serializers.StringRelatedField()  # To display the username instead of user ID
    room_name = serializers.SerializerMethodField()  # Custom method for returning the second part of the room name

    class Meta:
        model = Chats
        fields = ['chat_id', 'room', 'user', 'latest_message', 'room_name']

    def get_room_name(self, obj):
        # Split the room name by underscore and return the second part, if available
        parts = obj.room.split('_')
        return parts[1] if len(parts) > 1 else obj.room  # Return the second part or the whole name if no underscore # Include any other fields you need

class MessageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Message
        fields = ['message', 'user', 'timestamp']

