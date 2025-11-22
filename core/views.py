from django.shortcuts import render
from .models import Project

def home(request):
    projects = Project.objects.all()
    return render(request, 'home.html', {'projects': projects})

def about(request):
    return render(request, 'about.html')

# views.py
from django.shortcuts import render, redirect
from django.contrib import messages
from .models import ContactMessage

def contact(request):
    if request.method == "POST":
        name = request.POST.get('name')
        email = request.POST.get('email')
        message_text = request.POST.get('message')

        # Simple validation (optional, tu JS bhi use kar raha hai)
        if name and email and message_text:
            ContactMessage.objects.create(
                name=name,
                email=email,
                message=message_text
            )
            messages.success(request, "Thanks bhai! Tera message mil gaya, jaldi reply karunga 🚀")
            return redirect('contact')  # ya home page pe bhi bhej sakta hai
        else:
            messages.error(request, "Sab fields bhar na bhai!")

    return render(request, 'contact.html')  # tera template ka naam

