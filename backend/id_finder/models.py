from django.db import models
from django.conf import settings 
from django.core.files.storage import FileSystemStorage

class ID(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='ids_found')
    id_name = models.CharField(max_length=255)
    sn = models.CharField(max_length=255)  # Serial number
    id_no = models.CharField(max_length=255, unique=True)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=10)
    district_of_birth = models.CharField(max_length=255)
    date_of_issue = models.DateField()
    id_image = models.ImageField(upload_to='id_images/')
    id_status = models.CharField(max_length=20, choices=[('Found', 'Found'), ('Claimed', 'Claimed')])

    def __str__(self):
        return f"{self.id_name} - {self.id_no}"
