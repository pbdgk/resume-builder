from django.contrib import admin
from .models import Profile, Job, School, Skill, Photo, Socials


project_models = (Profile, Job, School, Skill, Photo, Socials)

for project_model in project_models:
    admin.site.register(project_model)
