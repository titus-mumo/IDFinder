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
        chat = Chats.objects.filter(user = self.request.user).first()
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
def get_chat_room(request):
    if not request.user.is_authenticated:
        return Response({"error": "Authentication required"}, status=status.HTTP_403_FORBIDDEN)

    # Fetch the first admin (or customize this to handle multiple admins)
    try:
        admin = User.objects.filter(is_staff=True).first()
        if not admin:
            return Response({"error": "Admin not found"}, status=status.HTTP_404_NOT_FOUND)
    except User.DoesNotExist:
        return Response({"error": "Admin not found"}, status=status.HTTP_404_NOT_FOUND)

    user = request.user

    if user.is_staff:
        return Response({"error": "Admins cannot chat with other admins"}, status=status.HTTP_403_FORBIDDEN)

    room_name = f"{admin.username}_{user.username}"


    chat_room, created = Chats.objects.get_or_create(room=room_name, user=user)

    return Response({"room_name": room_name, "admin": admin.username, "user": user.username}, status=status.HTTP_200_OK)




