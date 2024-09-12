from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_str
from .models import VerificationCode
import re

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'phone_number', 'password', 'username']  # Included username
        extra_kwargs = {
            'password': {'write_only': True},
            'username': {'read_only': True}  # Username will be auto-generated
        }

    def validate_phone_number(self, value):
        pattern = r'^\+\d{3}-\d{9,10}$'
        if not re.match(pattern, value):
            raise serializers.ValidationError("Phone number must be in the format +XXX-XXXXXXXXX")

        if User.objects.filter(phone_number=value).exists():
            raise serializers.ValidationError("A user with this phone number already exists")
        
        return value

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        user = authenticate(email=email, password=password)
        if user is None:
            raise serializers.ValidationError("Invalid email or password")
        return {'user': user}

class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    def validate(self, attrs):
        # Ensure the refresh token is present in the request data
        refresh = attrs.get('refresh')

        if not refresh:
            raise serializers.ValidationError("Refresh token is required.")
        
        return attrs

class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("User with this email does not exist.")
        return value
    
class SetNewPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True, required=True)
    password_confirm = serializers.CharField(write_only=True, required=True)

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords do not match.")
        return attrs


class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True)

    def validate(self, data):
        uid = data.get('uid')
        token = data.get('token')
        new_password = data.get('new_password')
        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError("Invalid token or user")
        if not default_token_generator.check_token(user, token):
            raise serializers.ValidationError("Invalid token")
        user.set_password(new_password)
        user.save()
        return data


class RefreshTokenSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    def validate(self, data):
        refresh = data.get('refresh')
        try:
            token = RefreshToken(refresh)
        except Exception as e:
            raise serializers.ValidationError("Invalid token")
        return data


class VerifyCodeSerializer(serializers.Serializer):
    phone_number = serializers.CharField()
    code = serializers.CharField()

    def validate(self, data):
        phone_number = data.get('phone_number')
        code = data.get('code')
        try:
            verification_code = VerificationCode.objects.get(user__phone_number=phone_number, code=code, is_active=True)
            verification_code.is_active = False
            verification_code.save()
        except VerificationCode.DoesNotExist:
            raise serializers.ValidationError("Invalid code")
        return data
