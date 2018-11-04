from django.urls import path
from .views import ProfileRestView

urlpatterns = [
    path('profile/', ProfileRestView.as_view(), name='profile')
]
