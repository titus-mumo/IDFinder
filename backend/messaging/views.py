from django.shortcuts import render
from rest_framework import views, status, generics
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import Chats
from .serializers import ChatRoomSerializer, MessageSerializer
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Chats, Message
from django.db.models import OuterRef, Subquery

User = get_user_model()


# Create your views here.

class ViewChats(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MessageSerializer

    def get_queryset(self):
        chat = Chats.objects.filter(users = self.request.user).first()
        return Message.objects.filter(chat=chat).order_by('timestamp')

class ViewActiveChatMessages(generics.ListAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = MessageSerializer

    def get_queryset(self):
        chat_id = self.request.query_params.get('chat_id')
        print(chat_id)
        chat = Chats.objects.filter(chat_id = chat_id).first()
        return Message.objects.filter(chat = chat).order_by('timestamp')

class AdminViewChats(generics.ListAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = ChatRoomSerializer

    def get_queryset(self):
        # Subquery to get the latest message for each chat
        latest_message = Message.objects.filter(chat=OuterRef('pk')).order_by('-timestamp').values('message')[:1]

        # Annotate the Chats queryset with the latest message
        chats = Chats.objects.annotate(latest_message=Subquery(latest_message))
        return chats
    
@api_view(['GET'])
def get_chat_id(request):
    if not request.user.is_authenticated:
        return Response({"error": "Authentication required"}, status=status.HTTP_403_FORBIDDEN)

    user = request.user
    chat = Chats.objects.filter(users = user).first()

    return Response({"chat_id": chat.chat_id, "username": user.username}, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_username(request):
    if not request.user.is_authenticated:
        return Response({"error": "Authentication required"}, status=status.HTTP_400_BAD_REQUEST)

    user = request.user
    if not user.is_staff:
        return Response({"error": "Must be admin"}, status=status.HTTP_400_BAD_REQUEST)

    return Response({"username": user.username}, status=status.HTTP_200_OK)




