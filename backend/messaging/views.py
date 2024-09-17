from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAdminUser

# Create your views here.

class ViewChats(generics.GenericAPIView):
    permission_classes = [IsAdminUser]
    

