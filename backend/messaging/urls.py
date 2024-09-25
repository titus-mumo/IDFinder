from django.urls import path
from . import views

urlpatterns = [
    path('view-chats/', views.ViewChats.as_view(), name='view_chats'),
    path('admin/view-chats/', views.AdminViewChats.as_view(), name='view_chats_admin'),
    path('fetch_chat_room_name/', views.get_chat_room, name='fetch-chat-room')
]