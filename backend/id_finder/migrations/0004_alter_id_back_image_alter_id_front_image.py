# Generated by Django 5.1 on 2024-09-12 16:58

import id_finder.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('id_finder', '0003_remove_id_id_image_id_back_image_id_front_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='id',
            name='back_image',
            field=models.ImageField(default='id_images/back/default.jpg', upload_to=id_finder.models.id_image_upload_path),
        ),
        migrations.AlterField(
            model_name='id',
            name='front_image',
            field=models.ImageField(default='id_images/front/default.jpg', upload_to=id_finder.models.id_image_upload_path),
        ),
    ]
