# Generated by Django 2.1.3 on 2018-11-13 16:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0011_auto_20181113_0830'),
    ]

    operations = [
        migrations.AddField(
            model_name='socials',
            name='group',
            field=models.SmallIntegerField(default=1),
        ),
    ]
