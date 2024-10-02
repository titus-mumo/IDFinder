from rest_framework import serializers
from .models import Chats, Message
from django.contrib.auth import get_user_model

User = get_user_model()

class ChatRoomSerializer(serializers.ModelSerializer):
    latest_message = serializers.CharField(read_only=True)  # This will hold the latest message content
    user = serializers.SerializerMethodField()  # Custom field to get the non-admin user

    class Meta:
        model = Chats
        fields = ['chat_id', 'user', 'latest_message']

    def get_user(self, obj):
        user = obj.users.filter(is_staff=False).first()
        if user:
            return user.username
        return None  # Or handle the case where there's no non-admin user


class MessageSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()  # Custom field to return username

    class Meta:
        model = Message
        fields = ['message', 'user', 'timestamp']

    def get_user(self, obj):
        email = obj.user
        user = User.objects.filter(email = email).first()
        return user.username

