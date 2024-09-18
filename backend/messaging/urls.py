from django.urls import path
from . import views

urlpatterns = [
    path('view-chats/', views.ViewChats.as_view(), name='view_chats'),
]