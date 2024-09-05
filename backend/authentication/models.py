from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
import re
import random
import string

class UserManager(BaseUserManager):
    def validate_phone_number(self, phone_number):
        # Regex pattern to match phone number format like "+254-7198888282"
        pattern = r'^\+\d{3}-\d{9,10}$'
        if not re.match(pattern, phone_number):
            raise ValidationError(_('Phone number must be in the format +XXX-XXXXXXXXX'))

    def create_user(self, email, phone_number, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        if not phone_number:
            raise ValueError('The Phone Number field must be set')

        # Validate phone number format
        self.validate_phone_number(phone_number)

        # Check if the phone number already exists
        if self.model.objects.filter(phone_number=phone_number).exists():
            raise ValidationError(_('A user with this phone number already exists'))

        email = self.normalize_email(email)
        username = email.split('@')[0]  # Get the part of the email before '@'
        user = self.model(email=email, phone_number=phone_number, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, phone_number, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, phone_number, password, **extra_fields)


class Custom_User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=255, blank=True)
    phone_number = models.CharField(max_length=15, unique=True, blank=True, null=True)
    verification_code = models.CharField(max_length=6, blank=True, null=True)
    is_phone_verified = models.BooleanField(default=False)
    role = models.CharField(max_length=50, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(null=True, blank=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['phone_number']

    def __str__(self):
        return self.email

    def generate_verification_code(self):
        # Generate a random alphanumeric code in the format 9A9FRU
        letters_and_digits = string.ascii_uppercase + string.digits
        self.verification_code = ''.join(random.choices(letters_and_digits, k=6))
        return self.verification_code

    def save(self, *args, **kwargs):
        if not self.username:
            self.username = self.email.split('@')[0]  # Auto-set username before save if it's empty
        if not self.verification_code:
            self.generate_verification_code()  # Generate the verification code if not set
        super().save(*args, **kwargs)


class VerificationCode(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"Verification code for {self.user.email}"
#TODO: add date created created @