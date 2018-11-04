from django.conf import settings
from django.dispatch import receiver
from django.db.models.signals import post_save

from .models import Profile


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def build_profile_on_user_creation(sender, instance, created, **kwargs):
  if created:
    profile = Profile(user=instance)
    profile.save()
