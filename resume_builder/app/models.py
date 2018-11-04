from django.db import models
from django.conf import settings
from django.dispatch import receiver
from django.db.models.signals import post_save


# class Photo(models.Model):
#     owner = models.ForeignKey('auth.User', related_name='image')
#     image = models.ImageField(upload_to='photos')


# class ResumeData(models.Model):
#     user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
#     profile =

class Profile(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=255, blank=True)
    last_name = models.CharField(max_length=255, blank=True)
    profession = models.CharField(max_length=255, blank=True)

    # presonal_data = models.ForeignKey("PersonalData", on_delete=models.CASCADE)


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def build_profile_on_user_creation(sender, instance, created, **kwargs):
  if created:
    profile = Profile(user=instance)
    profile.save()


# class PersonalData(models.Model):
#     user = models.ManyToManyField(settings.AUTH_USER_MODEL)
#     phone = models.CharField(max_length=18, blank=True, default="")
#     email = models.EmailField(blank=True, default="")
#     birthday = models.DateField(blank=True, default="")


# class SocialData(models.Model):
#     user = models.ManyToManyField(settings.AUTH_USER_MODEL)
#     user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
#     img_class = models.CharField(max_length=255)
#     link = models.URLField(max_length=255, blank=True, default="")
#
#
class Job(models.Model):
    user = models.ManyToManyField(settings.AUTH_USER_MODEL)
    position = models.CharField(max_length=255, blank=True, default="")
    company = models.CharField(max_length=255, blank=True, default="")
    start_time = models.DateField(blank=True, null=True)
    end_time = models.DateField(blank=True, null=True)
    experience = models.TextField(blank=True, default="")
#
# class Languange(models.Model):
#     user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
#     name = models.CharField(max_length=255)
#     stars = models.IntegerField()
#
# class Skill(models.Model):
#     user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
#     name = models.CharField(max_length=255)
#     stars = models.IntegerField()
