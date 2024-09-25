from django.db import models
from django.conf import settings

class Chats(models.Model):
    chat_id = models.AutoField(primary_key=True, unique=True)
    room = models.CharField(max_length=255, unique=True, default='common room')  # This will store the room name (admin_user)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return self.room
    
class Message(models.Model):
    message_id = models.AutoField(primary_key=True, unique=True)
    chat = models.ForeignKey(Chats, on_delete=models.CASCADE)
    message = models.TextField()
    user = models.TextField(default='anonymous')
    timestamp = models.DateTimeField(auto_now_add=True)
