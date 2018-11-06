from django.urls import path

from .views import ProfileRestView, JobRestView

urlpatterns = [
    path('profile/', ProfileRestView.as_view(), name='profile'),
    path('jobs/', JobRestView.as_view(), name='job'),
]
