from rest_framework import serializers
from .models import Chats, Message

class ChatRoomSerializer(serializers.ModelSerializer):
    latest_message = serializers.CharField(read_only=True)  # This will hold the latest message content
    user = serializers.StringRelatedField()  # To display the username instead of user ID

    class Meta:
        model = Chats
        fields = ['chat_id', 'room', 'user', 'latest_message']  # Include any other fields you need

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'

