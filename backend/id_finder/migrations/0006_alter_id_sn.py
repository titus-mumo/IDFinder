# Generated by Django 5.1 on 2024-09-12 17:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('id_finder', '0005_alter_id_id_no'),
    ]

    operations = [
        migrations.AlterField(
            model_name='id',
            name='sn',
            field=models.CharField(max_length=12),
        ),
    ]