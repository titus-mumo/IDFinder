# Generated by Django 5.1 on 2024-09-27 21:38

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('messaging', '0003_remove_chats_room_remove_chats_user_chats_created_at_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chats',
            name='created_at',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]
