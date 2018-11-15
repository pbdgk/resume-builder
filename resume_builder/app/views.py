from django.shortcuts import render
from django.contrib.auth.decorators import login_required


@login_required(login_url='login')
def index(request):
    context = {}
    return render(request, 'app/index.html', context)


def preview(request):
    return render(request, 'app/preview.html')