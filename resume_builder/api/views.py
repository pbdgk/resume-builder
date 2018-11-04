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

    def put(self, request, pk, format=None):
        # TODO: ITS wrong! another logic retreiving of job!
        job = Job.objects.filter(user=request.user)[pk]
        serialized = JobSerializer(job, data=request.data, partial=True)
        if serialized.is_valid():
            serialized.save()
            return Response(serialized.data, status=status.HTTP_200_OK)
        return Response(serialized.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, format=None):
        job = Job.objects.filter(user=request.user)
        serialized = JobSerializer(job, many=True)
        if serialized:
            return Response(serialized.data, status=status.HTTP_200_OK)
        return Response(serialized.errors, status=status.HTTP_404_NOT_FOUND)
