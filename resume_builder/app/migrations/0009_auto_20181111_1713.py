# Generated by Django 2.1.3 on 2018-11-11 17:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0008_photo'),
    ]

    operations = [
        migrations.AlterField(
            model_name='photo',
            name='image',
            field=models.ImageField(default='photos/photo.png', upload_to='photos'),
        ),
    ]