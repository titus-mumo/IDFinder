from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.db import models
import random

# User Manager
class UserManager(BaseUserManager):
    def create_user(self, email, phone_number, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        if not phone_number:
            raise ValueError('The Phone Number field must be set')
        
        email = self.normalize_email(email)
        user = self.model(email=email, phone_number=phone_number, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, phone_number, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        
        return self.create_user(email, phone_number, password, **extra_fields)

# User Model
class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, unique=True)
    role = models.CharField(max_length=50, blank=True)  # 'admin' or 'normal_user'
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(null=True, blank=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['phone_number']

    def __str__(self):
        return self.email

# Verification Code Model
class VerificationCode(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)  # Reference CustomUser directly
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.user.phone_number} - {self.code}"

# Utility Functions for Verification
def generate_verification_code():
    return ''.join(str(random.randint(0, 9)) for _ in range(6))

def send_verification_code(user):
    code = generate_verification_code()
    verification_code, created = VerificationCode.objects.get_or_create(user=user)
    verification_code.code = code
    verification_code.is_active = True
    verification_code.save()
    # SMS sending logic not yet done 
    # will work on it within the weekend
    print(f"Verification code sent to {user.phone_number}: {code}")

def verify_code(user, code):
    try:
        verification_code = VerificationCode.objects.get(user=user, is_active=True)
        if verification_code.code == code:
            verification_code.is_active = False  
            verification_code.save()
            return True
        return False
    except VerificationCode.DoesNotExist:
        return False

# Custom Password Reset Token Generator
class CustomPasswordResetTokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        return f"{user.pk}{timestamp}{user.phone_number}"
