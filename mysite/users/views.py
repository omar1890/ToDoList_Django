from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages 
import requests
from django.http import HttpResponse
import json

def send_feedback(request):
    if request.method == 'POST':
        prompt = request.POST.get('prompt')
        comment = request.POST.get('comment')
        like = request.POST.get('like')
        dislike = request.POST.get('dislike')

        # API endpoint and headers
        url = 'https://testcognitron2.azurewebsites.net/thumbs-up-prompt/'
        headers = {
            'X-API-KEY': '620c37ac-27cf-470e-a058-4861e100257e',
            'Authorization': f'Bearer {request.user.token}'  # Replace 'token' with the actual user token attribute
        }

        # Make the POST request to the external API
        response = requests.post(url, json={'prompt': prompt, 'like': like, 'dislike': dislike, 'comment': comment}, headers=headers, stream=True)
        print(response)
        if response.status_code == 200:
            response_content = response.content
            return HttpResponse("Thanks for your feedback!")
    return HttpResponse("There is a problem!")


def receive_message(request):
    if request.method == 'POST':
        message = request.POST.get('message')
        # API endpoint and headers
        url = 'https://testcognitron2.azurewebsites.net/api/chat'
        headers = {
            'X-API-KEY': '620c37ac-27cf-470e-a058-4861e100257e',
            'Authorization': f'Bearer {request.user.token}'  # Replace 'token' with the actual user token attribute
        }

        # Make the POST request to the external API
        response = requests.post(url, json={'message': message}, headers=headers, stream=True)
        if response.status_code == 200:
            response_content = response.content
            return HttpResponse(response_content)
    return HttpResponse()


def login_user(request):
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            #save user access token
            print(getToken(user.id))
            user.token = getToken(user.id)
            user.save()

            login(request, user)
            return redirect('home')
        else:
            messages.success(request, "There was an error logging in, Try Again!")
            return redirect('login')
    else:
        return render(request, 'login.html', {})

def getToken(user_id):
    url = "https://testcognitron2.azurewebsites.net/api/token/"
    headers = {
        "X-API-KEY": "620c37ac-27cf-470e-a058-4861e100257e",
        "Content-Type": "application/json"
    }
    data = {
        "user_id": user_id,
        "bot_id": "aaf57999-7aa2-4576-88b8-5cb733bcbca3"
    }
    response = requests.post(url, headers=headers, json=data)
    # Process the response and return the result
    if response.ok:
        return response.json()['access']
    else:
        return ''