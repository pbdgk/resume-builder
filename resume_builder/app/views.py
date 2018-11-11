from django.shortcuts import render
from django.contrib.auth.decorators import login_required


@login_required(login_url='login')
def index(request):
    context = {}
    return render(request, 'app/index.html', context)

def test_(request):
    context = {}
    return render(request, 'app/test_.html', context)
