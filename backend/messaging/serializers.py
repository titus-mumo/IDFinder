from rest_framework import serializers
from .models import Chats, Message

class ChatRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chats
        fields = '__all__'

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'

