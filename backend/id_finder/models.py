from django.db import models
from django.conf import settings
from PIL import Image
import os
from io import BytesIO
from django.core.files.base import ContentFile

# Function to define the path for uploaded images
def id_image_upload_path(instance, filename):
    extension = filename.split('.')[-1]
    if 'back_image' in filename:
        return f'id_images/{instance.id_no}/back.{extension}'
    else:
        return f'id_images/{instance.id_no}/front.{extension}'

class ID(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='ids_found')
    id_name = models.CharField(max_length=255)
    sn = models.CharField(max_length=12)  # Serial number
    id_no = models.CharField(max_length=8, unique=True)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=10)
    district_of_birth = models.CharField(max_length=255)
    date_of_issue = models.DateField()

    # Save front and back images in their respective folders based on id_no
    front_image = models.ImageField(upload_to=id_image_upload_path, default='id_images/front/default.jpg')
    back_image = models.ImageField(upload_to=id_image_upload_path, default='id_images/back/default.jpg')

    id_status = models.CharField(max_length=20, choices=[('Found', 'Found'), ('Claimed', 'Claimed')])

    def save(self, *args, **kwargs):
        # Compress and convert images before saving them
        if self.front_image:
            self.front_image = self.compress_image(self.front_image, 'front')
        if self.back_image:
            self.back_image = self.compress_image(self.back_image, 'back')

        super().save(*args, **kwargs)

    # Compression and conversion logic
    def compress_image(self, uploaded_image, image_type):
        img = Image.open(uploaded_image)
        img_io = BytesIO()
        
        # Compress and convert the image
        img_format = 'JPEG' if img.mode in ('RGB', 'RGBA') else 'PNG'  # Convert to JPEG or PNG based on mode
        img = img.convert('RGB')  # Convert to RGB for JPEG
        
        img.save(img_io, format=img_format, quality=70)  # Compress to 70% quality
        
        # Create a new Django file object for saving
        new_image = ContentFile(img_io.getvalue(), f'{image_type}.{img_format.lower()}')
        
        return new_image

    def __str__(self):
        return f"{self.id_name} - {self.id_no}"
