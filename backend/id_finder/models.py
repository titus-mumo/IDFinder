from django.db import models

# Create your models here.
class IDModel(models.Model):
    created_at = models.DateTimeField(auto_now_add = True)
    id_no = models.IntegerField(max_length=8)
    serial_number = models.CharField(unique=True,max_length=20)
    id_name = models.CharField(max_length=100)
    date_of_birth = models.CharField(max_length=20)
    gender = models.CharField(max_length=30)
    district_of_birth = models.CharField(max_length=50)
    date_of_issue = models.CharField(max_length=20)
    id_image = models.FileField(upload_to='id_image')
    id_status = models.CharField(max_length=20)
