from django.contrib.auth.models import User

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions

from app.models import Profile, Job
from app.serializers import ProfileSerializer, JobSerializer


class ProfileRestView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, format=None):
        profile = Profile.objects.get(user=request.user)
        serialized = ProfileSerializer(profile, data=request.data, partial=True)
        if serialized.is_valid():
            serialized.save()
            return Response(serialized.data, status=status.HTTP_200_OK)
        return Response(serialized.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, format=None):
        profile = Profile.objects.get(user=request.user)
        serialized = ProfileSerializer(profile)
        if serialized:
            return Response(serialized.data, status=status.HTTP_200_OK)
        return Response(serialized.errors, status=status.HTTP_404_NOT_FOUND)


class JobRestView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, format=None):
        user = request.user
        priority = request.POST.get('priority')
        job = Job.objects.filter(user=user).filter(priority=priority)[0]
        job = job.delete()
        serialized = JobSerializer(job)
        return Response(serialized.data, status=status.HTTP_200_OK)


    def post(self, request, format=None):
        user = request.user
        job = Job.objects.create(user=user)
        serialized = JobSerializer(job)
        return Response(serialized.data, status=status.HTTP_201_CREATED)

    def put(self, request, format=None):
        priority = request.POST.get('priority')
        print(request.POST)
        st = request.POST.get("start")
        print(st)
        job = Job.objects.filter(user=request.user).filter(priority=priority)[0]
        serialized = JobSerializer(job, data=request.data, partial=True)
        if serialized.is_valid():
            serialized.save()
            return Response(serialized.data, status=status.HTTP_200_OK)
        return Response(serialized.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, format=None):
        jobs = Job.objects.filter(user=request.user)
        serialized = JobSerializer(jobs, many=True)
        if serialized:
            return Response(serialized.data, status=status.HTTP_200_OK)
        return Response(serialized.errors, status=status.HTTP_404_NOT_FOUND)
