from django.contrib import admin
from .models import Chats, Message

# Admin interface for Chats model
@admin.register(Chats)
class ChatsAdmin(admin.ModelAdmin):
    list_display = ('chat_id', 'list_users', 'created_at')  # Display the chat ID, participants, and creation time
    search_fields = ('users__username',)  # Allow searching by participant usernames
    list_filter = ('users',)  # Filter by participants
    ordering = ('chat_id',)  # Default ordering by chat ID

    def list_users(self, obj):
        """Display a comma-separated list of participants in the chat."""
        return ", ".join([user.username for user in obj.users.all()])
    
    list_users.short_description = 'Users'  # Rename the column in the admin list view


# Admin interface for Message model
@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('message_id', 'chat', 'message', 'user', 'timestamp')  # Columns to display in the admin list view
    search_fields = ('chat__chat_id', 'user', 'message')  # Allow searching by chat room name, user, or message content
    list_filter = ('chat', 'user')  # Filter by chat room and user
    ordering = ('timestamp',)  # Default ordering by message timestamp
    date_hierarchy = 'timestamp'  # Add date hierarchy filter for messages

