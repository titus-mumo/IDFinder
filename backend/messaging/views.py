from django.shortcuts import render
from rest_framework import views, status, generics
from rest_framework.permissions import IsAuthenticated
from .models import Chats
from .serializers import ChatRoomSerializer, MessageSerializer
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Chats, Message

User = get_user_model()


# Create your views here.

class ViewChats(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MessageSerializer

    def get_queryset(self):
        chat = Chats.objects.filter(user = self.request.user).first()
        return Message.objects.filter(chat=chat).order_by('timestamp')




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




