# Generated by Django 2.1.3 on 2018-11-10 10:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0004_skill'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='job',
            name='start',
        ),
        migrations.RemoveField(
            model_name='school',
            name='end',
        ),
        migrations.RemoveField(
            model_name='school',
            name='start',
        ),
        migrations.AddField(
            model_name='job',
            name='end_month',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='job',
            name='end_year',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='job',
            name='start_month',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='job',
            name='start_year',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='school',
            name='end_month',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='school',
            name='end_year',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='school',
            name='start_month',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='school',
            name='start_year',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
