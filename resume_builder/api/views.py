from django.contrib.auth.models import User

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from rest_framework.parsers import MultiPartParser, FormParser, FileUploadParser

from app.models import Profile, Job, School, Skill, Photo, Socials
from app.serializers import ProfileSerializer, JobSerializer, SchoolSerializer, SkillSerializer, PhotoSerializer, SocialSerializer


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


class SocialRestView(APIView):

    def get(self, request, format=None):
        social = Socials.objects.filter(user=request.user)
        serialized = SocialSerializer(social, many=True)
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
