from django.contrib.auth.models import User

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions

from app.models import Profile
from app.serializers import ProfileSerializer


class ProfileRestView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, format=None):
        profile = Profile.objects.get(user=request.user)
        data = ProfileSerializer(profile, data=request.data, partial=True)
        if data.is_valid():
            data.save()
            return Response(data, status=status.HTTP_200_OK)
        return Response(data.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, format=None):
        profile = Profile.objects.get(user=request.user)
        if profile:
            return Response(profile, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_404_NOT_FOUND)
