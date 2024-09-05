from rest_framework import generics
from .models import ID
from .serializers import IDSerializer, IDListSerializer
from rest_framework.permissions import IsAuthenticated
#TODO: implement orc using tesseract.

from PIL import Image
from rest_framework.exceptions import ValidationError

class IDCreateView(generics.CreateAPIView):
    queryset = ID.objects.all()
    serializer_class = IDSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)  # Associate the ID with the logged-in user

class IDListView(generics.ListAPIView):
    serializer_class = IDListSerializer  # Serializer with limited fields (id_name, id_no)
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ID.objects.all()  # Return all IDs with limited info (home view)

class MyIDListView(generics.ListAPIView):
    serializer_class = IDSerializer  # Serializer with all fields
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ID.objects.filter(user=self.request.user)  # Return only IDs found by the user
