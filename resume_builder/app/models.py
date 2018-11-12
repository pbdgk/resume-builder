from django.db import models
from django.conf import settings
from django.dispatch import receiver
from django.db.models.signals import post_save


class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=255, blank=True)
    last_name = models.CharField(max_length=255, blank=True)
    profession = models.CharField(max_length=255, blank=True)


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


class Skill(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=255, blank=True, default="")
    rating = models.IntegerField(blank=True, default=0)
    priority = models.IntegerField(blank=True)

    def save(self, *args, **kwargs):
        if self.priority is None:
            objects = Skill.objects.filter(user=self.user)
            if not objects.exists():
                self.priority = 1
            else:
                self.priority = objects.count() + 1
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        priority = self.priority
        user = self.user
        super().delete(*args, **kwargs)
        objects = Skill.objects.filter(user=user)
        for obj in objects:
            if obj.priority > priority:
                obj.priority = obj.priority - 1
                obj.save()


class Photo(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='photos', default='photos/photo.png')


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def build_profile_on_user_creation(sender, instance, created, **kwargs):
    if created:
        Profile.objects.get_or_create(user=instance)
        Photo.objects.get_or_create(user=instance)
