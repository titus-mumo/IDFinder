from rest_framework import serializers
from .models import ID

class IDSerializer(serializers.ModelSerializer):
    class Meta:
        model = ID
        fields = ["__all__"]

    def create(self, validated_data):
        return super().create(validated_data)

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)


class IDListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ID
        fields = ['id_name', 'id_no']  # Partial ID list view, only name and id_no (blurred in the view logic)


class MyIDListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ID
        fields = ["__all__"]
