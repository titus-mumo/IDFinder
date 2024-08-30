# Generated by Django 5.1 on 2024-08-30 04:59

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('id_finder', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='ID',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('id_name', models.CharField(max_length=255)),
                ('sn', models.CharField(max_length=255)),
                ('id_no', models.CharField(max_length=255, unique=True)),
                ('date_of_birth', models.DateField()),
                ('gender', models.CharField(max_length=10)),
                ('district_of_birth', models.CharField(max_length=255)),
                ('date_of_issue', models.DateField()),
                ('id_image', models.ImageField(upload_to='id_images/')),
                ('id_status', models.CharField(choices=[('Found', 'Found'), ('Claimed', 'Claimed')], max_length=20)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='ids_found', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.DeleteModel(
            name='IDModel',
        ),
    ]
