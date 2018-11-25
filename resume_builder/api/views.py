from django.contrib.auth.models import User

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from rest_framework.parsers import MultiPartParser, FormParser, FileUploadParser

from app.models import Profile, Summary, Job, School, Skill, Photo, Socials
from app.serializers import (ProfileSerializer,
                             SummarySerializer,
                             JobSerializer,
                             SchoolSerializer,
                             SkillSerializer,
                             PhotoSerializer,
                             SocialSerializer,
                             GetSocialSerializer,
                             DocSerializer,
                            )


class ProfileRestView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        profile = Profile.objects.get(user=request.user)
        serialized = ProfileSerializer(profile)
        if serialized:
            return Response(serialized.data, status=status.HTTP_200_OK)
        return Response(serialized.errors, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, format=None):
        profile = Profile.objects.get(user=request.user)
        serialized = ProfileSerializer(profile, data=request.data, partial=True)
        if serialized.is_valid():
            serialized.save()
            return Response(serialized.data, status=status.HTTP_200_OK)
        return Response(serialized.errors, status=status.HTTP_400_BAD_REQUEST)


class SummaryRestView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        summary = Summary.objects.get(user=request.user)
        serialized = SummarySerializer(summary)
        if serialized:
            return Response(serialized.data, status=status.HTTP_200_OK)
        return Response(serialized.errors, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, format=None):
        summary = Summary.objects.get(user=request.user)
        serialized = SummarySerializer(summary, data=request.data, partial=True)
        if serialized.is_valid():
            serialized.save()
            return Response(serialized.data, status=status.HTTP_200_OK)
        return Response(serialized.errors, status=status.HTTP_400_BAD_REQUEST)


class JobRestView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        jobs = Job.objects.filter(user=request.user)
        serialized = JobSerializer(jobs, many=True)
        if serialized:
            return Response(serialized.data, status=status.HTTP_200_OK)
        return Response(serialized.errors, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, format=None):
        job = Job.objects.create(user=request.user)
        serialized = JobSerializer(job)
        return Response(serialized.data, status=status.HTTP_201_CREATED)

    def put(self, request, format=None):
        priority = request.data.get('priority')
        job = Job.objects.filter(user=request.user).filter(priority=priority).first()
        serialized = JobSerializer(job, data=request.data, partial=True)
        if serialized.is_valid():
            serialized.save()
            return Response(serialized.data, status=status.HTTP_200_OK)
        return Response(serialized.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, format=None):
        priority = request.data.get('priority')
        job = Job.objects.filter(user=request.user).filter(priority=priority).first()
        serialized = JobSerializer(job.delete())
        return Response(serialized.data, status=status.HTTP_200_OK)


class SchoolRestView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        schools = School.objects.filter(user=request.user)
        serialized = SchoolSerializer(schools, many=True)
        if serialized:
            return Response(serialized.data, status=status.HTTP_200_OK)
        return Response(serialized.errors, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, format=None):
        school = School.objects.create(user=request.user)
        serialized = SchoolSerializer(school)
        return Response(serialized.data, status=status.HTTP_201_CREATED)

    def put(self, request, format=None):
        priority = request.data.get('priority')
        school = School.objects.filter(user=request.user).filter(priority=priority).first()
        serialized = SchoolSerializer(school, data=request.data, partial=True)
        if serialized.is_valid():
            serialized.save()
            return Response(serialized.data, status=status.HTTP_200_OK)
        return Response(serialized.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, format=None):
        priority = request.data.get('priority')
        school = School.objects.filter(user=request.user).filter(priority=priority).first()
        serialized = JobSerializer(school.delete())
        return Response(serialized.data, status=status.HTTP_200_OK)


class SkillRestView(APIView):

    def get(self, request, format=None):
        skills = Skill.objects.filter(user=request.user)
        serialized = SkillSerializer(skills, many=True)
        if serialized:
            return Response(serialized.data, status=status.HTTP_200_OK)
        return Response(serialized.errors, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, format=None):
        skill = Skill.objects.create(user=request.user)
        serialized = SkillSerializer(skill)
        return Response(serialized.data, status=status.HTTP_201_CREATED)

    def put(self, request, format=None):
        priority = request.data.get('priority')
        skill = Skill.objects.filter(user=request.user).filter(priority=priority).first()
        serialized = SkillSerializer(skill, data=request.data, partial=True)
        if serialized.is_valid():
            serialized.save()
            return Response(serialized.data, status=status.HTTP_200_OK)
        return Response(serialized.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, format=None):
        priority = request.data.get('priority')
        skill = Skill.objects.filter(user=request.user).filter(priority=priority).first()
        serialized = SkillSerializer(skill.delete())
        return Response(serialized.data, status=status.HTTP_200_OK)


class PhotoRestView(APIView):

    parser_classes = (MultiPartParser,)
    def get(self, request, format=None):
        photo = Photo.objects.filter(user=request.user).first()
        serialized = PhotoSerializer(photo)
        if serialized:
            return Response(serialized.data, status=status.HTTP_200_OK)
        return Response(serialized.errors, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, format=None):

        photo = Photo.objects.get(user=request.user)
        serialized = PhotoSerializer(photo, data=request.data, partial=True)
        if serialized.is_valid():
            serialized.save()
            return Response(serialized.data, status=status.HTTP_200_OK)
        return Response(serialized.errors, status=status.HTTP_400_BAD_REQUEST)


    def put(self, request, format=None):
        photo = Photo.objects.get(user=request.user)
        serialized = PhotoSerializer(photo, data=request.data, partial=True)
        if serialized.is_valid():
            serialized.save()
            return Response(serialized.data, status=status.HTTP_200_OK)
        return Response(serialized.errors, status=status.HTTP_400_BAD_REQUEST)


SOCIALS = {
    'github': {
        'label': 'Github',
        'field_type': 'text',
        'field_name': 'github',
        'fa_image_class': 'fab fa-github',
    },

    'linkedin': {
        'label': 'Linkedin',
        'field_type': 'text',
        'field_name': 'linkedin',
        'fa_image_class': "fab fa-linkedin-in",
    },

    'codepen': {
        'label': 'Codepen',
        'field_type': 'text',
        'field_name': 'codepen',
        'fa_image_class': "fab fa-codepen",
    },

    'link': {
        'label': 'Website',
        'field_type': 'text',
        'field_name': 'link',
        'fa_image_class': "fas fa-link" ,
    },

    'birthday': {
        'label': 'Day of birth',
        'field_type': 'text',
        'field_name': 'birthday',
        'fa_image_class': "fas fa-birthday-cake",
    },

    'email': {
        'label': 'E-mail',
        'field_type': 'text',
        'field_name': 'email',
        'fa_image_class': "far fa-envelope",
    },

    'phone': {
        'label': 'Phone',
        'field_type': 'text',
        'field_name': 'phone',
        'fa_image_class': "fas fa-mobile-alt",
    }
}



class SocialRestView(APIView):

    def post(self, request, format=None):
        user = request.user
        social_name = request.data.get('social', None)
        social = SOCIALS.get(social_name, None)

        try:
            group = int(request.data.get('group', None))
        except ValueError:
            group = None

        if social is None or group is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        social.update({"user": user.pk, "group": group})
        serialized = SocialSerializer(data=social)
        if serialized.is_valid():
            serialized.save()
            return Response(serialized.data, status=status.HTTP_200_OK)
        return Response(serialized.errors, status=status.HTTP_404_NOT_FOUND)

    def get(self, request, format=None):
        social = Socials.objects.filter(user=request.user)
        serialized = GetSocialSerializer(social)
        if serialized:
            return Response(serialized.data, status=status.HTTP_200_OK)
        return Response(serialized.errors, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, format=None):
        name, value = request.data.popitem()
        social = Socials.objects.filter(user=request.user, field_name=name).first()
        data = { 'text': value }
        serialized = SocialSerializer(social, data=data, partial=True)
        if serialized.is_valid():
            serialized.save()
            return Response(serialized.data, status=status.HTTP_200_OK)
        return Response(serialized.errors, status=status.HTTP_404_NOT_FOUND)


class DocRestView(APIView):

    def get(self, request, format=None):
        user = request.user

        profile = Profile.objects.get(user=user)
        profile_ser = ProfileSerializer(profile)

        img = Photo.objects.get(user=user)
        img_ser = PhotoSerializer(img)

        summary = Summary.objects.get(user=user)
        summary_ser = SummarySerializer(summary)

        socials = Socials.objects.filter(user=user)
        socials_ser = GetSocialSerializer(socials)

        education = School.objects.filter(user=user)
        edu_ser = SchoolSerializer(education, many=True)

        jobs = Job.objects.filter(user=user)
        jobs_ser = JobSerializer(jobs, many=True)

        skills = Skill.objects.filter(user=user)
        skills_ser = SkillSerializer(skills, many=True)

        d = {
            "profile": profile_ser.data,
            "img": img_ser.data,
            "socials": socials_ser.data,
            "summary": summary_ser.data,
            "exp": jobs_ser.data,
            "edu": edu_ser.data,
            "skills": skills_ser.data,
            }
        return Response(d, status.HTTP_200_OK)

from django.http import HttpResponse
from wsgiref.util import FileWrapper
class Download(APIView):

    def post(self, request, format=None):
        data = request.data
        import pdfkit
        from django.conf import settings
        import os
        base = settings.BASE_DIR
        out = os.path.join(base, 'api/out.pdf')
        css = os.path.join(base, 'static/app/css/preview.css') 
        pdf = pdfkit.from_string(data, False, css=css)
        response = HttpResponse(pdf, content_type='application/pdf') 
        return response
        # return Response(status.HTTP_200_OK)