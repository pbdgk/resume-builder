from django.contrib import admin
from .models import Profile, Job, School, Skill

# Register your models here.
admin.site.register(Profile)
admin.site.register(Job)
admin.site.register(School)
admin.site.register(Skill)
