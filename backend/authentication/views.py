from rest_framework import generics,status
from django.core.mail import send_mail
from django.urls import reverse
from django.utils.encoding import force_str
from .serializers import SetNewPasswordSerializer
from rest_framework.permissions import AllowAny,IsAuthenticated
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

from django.http import JsonResponse

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
    
class LogoutView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            # Get the refresh token from the request data
            refresh_token = request.data.get("refresh")

            if refresh_token is None:
                return Response({"error": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)

            # Blacklist the token (mark it as unusable)
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response({"message": "Logout successful. Token has been blacklisted."}, status=status.HTTP_205_RESET_CONTENT)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class PasswordResetView(generics.GenericAPIView):
    serializer_class = PasswordResetSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        base_url = serializer.validated_data['base_url']
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User with this email does not exist."}, status=404)

        # Generate password reset token and UID
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        # Create password reset link
        
        reset_link = base_url + '/auth/password-reset-confirm/' + uid + '/' + token + '/'

        # Send email
        send_mail(
            subject="Password Reset Request",
            message=f"Click the link below to reset your password:\n{reset_link}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
        )

        return Response({
            'message': 'Password reset link has been sent to your email.',
            'uid': uid,
             #TODO:You can remove this from the response in production(the token and reset_link)
            'token': token, 
            'reset_link': reset_link, 
        })

class PasswordResetConfirmView(generics.GenericAPIView):
    serializer_class = SetNewPasswordSerializer
    permission_classes = [AllowAny]
    def post(self, request, uidb64, token, *args, **kwargs):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user.set_password(serializer.validated_data['password'])
            user.save()
            return Response({"message": "Password has been reset successfully."})
        else:
            return Response({"error": "Invalid reset link"}, status=400)


class RefreshTokenView(generics.GenericAPIView):
    serializer_class = RefreshTokenSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        refresh = serializer.validated_data['refresh']
        token = RefreshToken(refresh)
        return Response({
            'access': str(token.access_token),
            'refresh': str(token)
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
                'username': user.username,  
                'email': user.email,
                'phone_number': user.phone_number,
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class CheckIfUserIsAdmin(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return JsonResponse({"staff": user.is_staff}, status = status.HTTP_200_OK)