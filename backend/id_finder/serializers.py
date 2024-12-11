from rest_framework import serializers
from .models import ID, IDClaim
from django.conf import settings
from messaging.models import Chats

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
    reference_id = serializers.SerializerMethodField()
    chat_id = serializers.SerializerMethodField()
    username = serializers.SerializerMethodField() 
    phone_number = serializers.SerializerMethodField()

    class Meta:
        model = IDClaim
        fields = ["id","claim_status", "date_of_birth", "district_of_birth", "id_name", "id_no", "selfie", "created_at", "reference_id", "image_match", "chat_id", "username", "phone_number"]

    def get_reference_id(self, obj):
        return obj.id_found.id_no
    
    def get_username(self, obj):
        return obj.user.username
    
    def get_chat_id(self, obj):
        return Chats.objects.filter(users = obj.user).first().chat_id
    
    def get_phone_number(self, obj):
        return obj.user.phone_number
    
class ViewIDInClaimSerializer(serializers.ModelSerializer):
    modified_front_image = serializers.SerializerMethodField()

    class Meta:
        model = ID
        fields = ['date_of_birth', 'id_no', 'district_of_birth', 'id_name', 'front_image', 'modified_front_image']

    def get_modified_front_image(self, obj):
        request = self.context.get('request')
        front_image = obj.front_image.url if obj.front_image else None
        
        if front_image:
            # Attach the base URL
            return request.build_absolute_uri(front_image) if request else settings.BASE_URL + front_image
        return None
    
