from django.urls import path

from . import views

urlpatterns = [
    path('profiles/', views.ProfileRestView.as_view(), name='profile'),
    path('summaries/', views.SummaryRestView.as_view(), name='summary'),
    path('socials/', views.SocialRestView.as_view(), name='social'),
    path('jobs/', views.JobRestView.as_view(), name='job'),
    path('schools/', views.SchoolRestView.as_view(), name='school'),
    path('skills/', views.SkillRestView.as_view(), name='skill'),
    path('photos/', views.PhotoRestView.as_view(), name='photo'),
    path('doc/', views.DocRestView.as_view(), name='doc'),
    path('download/', views.Download.as_view()),
]
