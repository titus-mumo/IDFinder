from django.urls import path
from . import views

urlpatterns = [
    path('view-chats/', views.ViewChats.as_view(), name='view_chats'),
    path('admin/view-chats/', views.AdminViewChats.as_view(), name='view_chats_admin'),
    path('admin/fetch-username/', views.get_username, name='fetch-admin-username'),
    path('fetch_chat_room_name/', views.get_chat_id, name='fetch-chat-id'),
    path('view-active-chat-messages/', views.ViewActiveChatMessages.as_view(), name='view-active-chat-messages'),
]