from django.db import models
from django.conf import settings
from django.dispatch import receiver
from django.db.models.signals import post_save


class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=255, blank=True)
    last_name = models.CharField(max_length=255, blank=True)
    profession = models.CharField(max_length=255, blank=True)


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def build_profile_on_user_creation(sender, instance, created, **kwargs):
    if created:
        Profile.objects.get_or_create(user=instance)


class Job(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    position = models.CharField(max_length=255, blank=True, default="")
    company = models.CharField(max_length=255, blank=True, default="")
    start = models.DateField(blank=True, null=True)
    end = models.DateField(blank=True, null=True)
    experience = models.TextField(blank=True, default="")
    priority = models.IntegerField(blank=True)

    def save(self, *args, **kwargs):
        if self.priority is None:
            jobs = Job.objects.filter(user=self.user)
            if not jobs.exists():
                self.priority = 1
            else:
                self.priority = jobs.count() + 1
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        priority = self.priority
        user = self.user
        super().delete(*args, **kwargs)
        jobs = Job.objects.filter(user=user)
        for job in jobs:
            if job.priority > priority:
                job.priority = job.priority - 1
                job.save()


class School(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=255, blank=True, default="")
    start = models.DateField(blank=True, null=True)
    end = models.DateField(blank=True, null=True)
    description = models.TextField(blank=True, default="")
    priority = models.IntegerField(blank=True)

    def save(self, *args, **kwargs):
        if self.priority is None:
            objects = School.objects.filter(user=self.user)
            if not objects.exists():
                self.priority = 1
            else:
                self.priority = objects.count() + 1
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        priority = self.priority
        user = self.user
        super().delete(*args, **kwargs)
        objects = School.objects.filter(user=user)
        for obj in objects:
            if obj.priority > priority:
                obj.priority = obj.priority - 1
                obj.save()


# class Photo(models.Model):
#     owner = models.ForeignKey('auth.User', related_name='image')
#     image = models.ImageField(upload_to='photos')


# class ResumeData(models.Model):
#     user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
#     profile =

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

# class Languange(models.Model):
#     user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
#     name = models.CharField(max_length=255)
#     stars = models.IntegerField()
#
# class Skill(models.Model):
#     user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
#     name = models.CharField(max_length=255)
#     stars = models.IntegerField()
