from datetime import datetime
from django.db import models
from django.conf import settings
from django.utils import timezone

# Function to define the path for uploaded images
def id_image_upload_path(instance, filename):
    return f'id_images/{instance.id_no}/{filename}'

class ID(models.Model):
    primary_key = models.AutoField(unique = True, primary_key=True)
    created_at = models.DateTimeField(default=timezone.now)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='ids_found')
    id_name = models.CharField(max_length=255)
    sn = models.CharField(max_length=12)  # Serial number
    id_no = models.CharField(max_length=8, unique=True)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=10)
    district_of_birth = models.CharField(max_length=255)
    date_of_issue = models.DateField()
    # Save front and back images in their respective folders based on id_no
    front_image = models.ImageField(upload_to=id_image_upload_path)
    back_image = models.ImageField(upload_to=id_image_upload_path)

    id_status = models.CharField(max_length=20, choices=[('Found', 'Found'), ('Claimed', 'Claimed')])

    def __str__(self):
        return f"{self.id_name} - {self.id_no}"
    
    def mark_as_claimed(self, user):
        """Mark the ID as claimed by the user"""
        self.id_status = 'Claimed'
        self.user = user
        self.save()
# New model for handling ID claims
"""The IDClaim model acts as a bridge between the ID model and the user who is making the claim. It tracks the status of the claim and provides a way to associate the claim with both the ID document and the user."""
class IDClaim(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )

    id_found = models.ForeignKey(ID, on_delete=models.CASCADE, related_name='claims')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='claims')
    claim_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    id_no = models.CharField(max_length=8, default='75835858')
    id_name = models.CharField(max_length=100, default='Konshens')
    district_of_birth = models.CharField(max_length=30, default='Nairobi')
    date_of_birth = models.DateTimeField(default=datetime.now())
    selfie = models.FileField(upload_to='selfie/', default='selfie/default.jpg')
    image_match = models.CharField(max_length=100, default='70')

    def __str__(self):
        return f"{self.user} claims {self.id_found.id_no}"

