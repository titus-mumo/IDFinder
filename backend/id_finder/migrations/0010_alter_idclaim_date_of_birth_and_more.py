# Generated by Django 5.1 on 2024-09-30 10:16

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('id_finder', '0009_alter_id_primary_key_alter_idclaim_date_of_birth'),
    ]

    operations = [
        migrations.AlterField(
            model_name='idclaim',
            name='date_of_birth',
            field=models.DateTimeField(default=datetime.datetime(2024, 9, 30, 13, 16, 0, 884376)),
        ),
        migrations.AlterField(
            model_name='idclaim',
            name='image_match',
            field=models.CharField(default='70', max_length=100),
        ),
    ]
