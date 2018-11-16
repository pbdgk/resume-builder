from django.urls import path, re_path
from . import views


urlpatterns = [
    path('preview/', views.preview, name='preview'),
    re_path(r'^app/[^/]*$', views.index, name='index'),
]
