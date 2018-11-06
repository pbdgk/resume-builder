from django.contrib.auth.models import User

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions

from app.models import Profile, Job, School
from app.serializers import ProfileSerializer, JobSerializer, SchoolSerializer


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
        priority = request.POST.get('priority')
        job = Job.objects.filter(user=request.user).filter(priority=priority)[0]
        serialized = JobSerializer(job, data=request.data, partial=True)
        if serialized.is_valid():
            serialized.save()
            return Response(serialized.data, status=status.HTTP_200_OK)
        return Response(serialized.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, format=None):
        priority = request.POST.get('priority')
        job = Job.objects.filter(user=request.user).filter(priority=priority)[0]
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
        job = School.objects.create(user=request.user)
        serialized = SchoolSerializer(job)
        return Response(serialized.data, status=status.HTTP_201_CREATED)

    def put(self, request, format=None):
        priority = request.POST.get('priority')
        school = School.objects.filter(user=request.user).filter(priority=priority)[0]
        serialized = SchoolSerializer(school, data=request.data, partial=True)
        if serialized.is_valid():
            serialized.save()
            return Response(serialized.data, status=status.HTTP_200_OK)
        return Response(serialized.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, format=None):
        priority = request.POST.get('priority')
        school = School.objects.filter(user=request.user).filter(priority=priority)[0]
        serialized = JobSerializer(school.delete())
        return Response(serialized.data, status=status.HTTP_200_OK)
