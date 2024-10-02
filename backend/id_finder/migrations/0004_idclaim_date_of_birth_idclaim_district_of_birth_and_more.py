# Generated by Django 5.1 on 2024-09-27 21:37

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('id_finder', '0003_idclaim'),
    ]

    operations = [
        migrations.AddField(
            model_name='idclaim',
            name='date_of_birth',
            field=models.DateTimeField(default=datetime.datetime(2024, 9, 28, 0, 37, 32, 9456)),
        ),
        migrations.AddField(
            model_name='idclaim',
            name='district_of_birth',
            field=models.CharField(default='Nairobi', max_length=30),
        ),
        migrations.AddField(
            model_name='idclaim',
            name='id_name',
            field=models.CharField(default='Konshens', max_length=100),
        ),
        migrations.AddField(
            model_name='idclaim',
            name='selfie',
            field=models.FileField(default='selfie/default.jpg', upload_to='selfie/'),
        ),
    ]
