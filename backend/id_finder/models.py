from django.db import models
from django.conf import settings
from django.utils import timezone

# Function to define the path for uploaded images
def id_image_upload_path(instance, filename):
    return f'id_images/{instance.id_no}/{filename}'

class ID(models.Model):
    primary_key = models.AutoField(unique = True, primary_key=True, default=1)
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
