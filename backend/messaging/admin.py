from django.contrib import admin
from .models import Chats, Message

# Admin interface for Chats model
@admin.register(Chats)
class ChatsAdmin(admin.ModelAdmin):
    list_display = ('chat_id', 'room', 'user')  # Columns to display in the admin list view
    search_fields = ('room', 'user__username')  # Allow searching by room name or user's username
    list_filter = ('user',)  # Filter by user
    ordering = ('chat_id',)  # Default ordering by chat ID


# Admin interface for Message model
@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('message_id', 'chat', 'message', 'user', 'timestamp')  # Columns to display in the admin list view
    search_fields = ('chat__room', 'user', 'message')  # Allow searching by chat room name, user, or message content
    list_filter = ('chat', 'user')  # Filter by chat room and user
    ordering = ('timestamp',)  # Default ordering by message timestamp
    date_hierarchy = 'timestamp'  # Add date hierarchy filter for messages

