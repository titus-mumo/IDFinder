from django.db import models
from django.conf import settings
from django.utils import timezone

class Chats(models.Model):
    chat_id = models.AutoField(primary_key=True, unique=True)
    users = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='chats')
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Chat ID {self.chat_id} with {', '.join([user.username for user in self.users.all()])}"

class Message(models.Model):
    message_id = models.AutoField(primary_key=True, unique=True)
    chat = models.ForeignKey(Chats, on_delete=models.CASCADE)
    message = models.TextField()
    user = models.TextField(default='anonymous')
    timestamp = models.DateTimeField(auto_now_add=True)
