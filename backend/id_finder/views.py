from rest_framework import generics, permissions
from .models import ID
from .serializers import IDSerializer, IDListSerializer
from rest_framework.permissions import IsAuthenticated

class IDCreateView(generics.CreateAPIView):
    queryset = ID.objects.all()
    serializer_class = IDSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class IDListView(generics.ListAPIView):
    serializer_class = IDListSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        return ID.objects.all()
    

class MyIDListView(generics.ListAPIView):
    serializer_class = IDSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ID.objects.filter(user=self.request.user)
