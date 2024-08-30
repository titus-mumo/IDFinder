from rest_framework import generics,status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.conf import settings
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    PasswordResetSerializer,
    PasswordResetConfirmSerializer,
    RefreshTokenSerializer,
    VerifyCodeSerializer
)

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'user': {
                    'email': user.email,
                    'username': user.username,  # Added username to the response
                    'phone_number': user.phone_number,
                },
                'message': 'User registered successfully. Verification code sent to phone number.'
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'username': user.username,  # Added username to the response
                'email': user.email,
                'phone_number': user.phone_number,
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class PasswordResetView(generics.GenericAPIView):
    serializer_class = PasswordResetSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = User.objects.get(email=serializer.validated_data['email'])
        # Generate password reset token and UID
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        # Here you would send an email with the token and UID
        # For now, we are just returning it in the response for testing
        return Response({
            'uid': uid,
            'token': token,
        })


class PasswordResetConfirmView(generics.GenericAPIView):
    serializer_class = PasswordResetConfirmSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({"message": "Password has been reset successfully."})


class RefreshTokenView(generics.GenericAPIView):
    serializer_class = RefreshTokenSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        refresh = serializer.validated_data['refresh']
        token = RefreshToken(refresh)
        return Response({
            'access': str(token.access_token)
        })


class VerifyCodeView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = VerifyCodeSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            verification_code = serializer.validated_data['code']
            user = serializer.validated_data['user']
            # Assuming some logic to verify the code and activate the user
            return Response({
                'message': 'Phone number verified successfully.',
                'username': user.username,  # Added username to the response
                'email': user.email,
                'phone_number': user.phone_number,
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)