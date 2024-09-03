from rest_framework import serializers
from .models import ID

class IDSerializer(serializers.ModelSerializer):
    class Meta:
        model = ID
        fields = '__all__'

class IDListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ID
        fields = ['id_name', 'id_no']
