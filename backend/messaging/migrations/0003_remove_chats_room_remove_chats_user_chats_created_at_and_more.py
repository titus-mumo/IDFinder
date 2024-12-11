# Generated by Django 5.1 on 2024-09-27 21:37

import datetime
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('messaging', '0002_message_delete_chatmessage_chats_room_message_chat'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RemoveField(
            model_name='chats',
            name='room',
        ),
        migrations.RemoveField(
            model_name='chats',
            name='user',
        ),
        migrations.AddField(
            model_name='chats',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2024, 9, 27, 21, 37, 32, 4455, tzinfo=datetime.timezone.utc)),
        ),
        migrations.AddField(
            model_name='chats',
            name='users',
            field=models.ManyToManyField(related_name='chats', to=settings.AUTH_USER_MODEL),
        ),
    ]
