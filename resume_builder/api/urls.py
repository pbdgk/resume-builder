from django.urls import path

from .views import ProfileRestView, JobRestView, SchoolRestView, SkillRestView


urlpatterns = [
    path('profile/', ProfileRestView.as_view(), name='profile'),
    path('jobs/', JobRestView.as_view(), name='job'),
    path('schools/', SchoolRestView.as_view(), name='school'),
    path('skills/', SkillRestView.as_view(), name='skill'),
]
