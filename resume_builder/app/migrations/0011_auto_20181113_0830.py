# Generated by Django 2.1.3 on 2018-11-13 08:30

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('app', '0010_personalinfo'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='PersonalInfo',
            new_name='Socials',
        ),
    ]
