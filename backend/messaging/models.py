from django.db import models
from django.conf import settings

# Create your models here.

class Chats(models.Model):
    chat_id = models.AutoField(primary_key=True, unique=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)