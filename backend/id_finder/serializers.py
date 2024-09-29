from rest_framework import serializers
from .models import ID, IDClaim

class IDSerializer(serializers.ModelSerializer):
    class Meta:
        model = ID
        fields = "__all__"

    def create(self, validated_data):
        return super().create(validated_data)

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)


class IDListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ID
        fields = ['primary_key','id_name', 'id_no']  # Partial ID list view, only name and id_no (blurred in the view logic)


class MyIDListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ID
        fields = "__all__"

        
class IDClaimSerializer(serializers.ModelSerializer):
    class Meta:
        model = IDClaim
        fields = '__all__'

class ViewUserClaimSerializer(serializers.ModelSerializer):
    class Meta:
        model = IDClaim
        fields = ["claim_status", "date_of_birth", "district_of_birth", "id_name", "id_no", "selfie", "created_at"]
