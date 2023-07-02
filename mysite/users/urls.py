from . import views
from django.urls import path,include

urlpatterns = [
    path('login_user', views.login_user,name='login'), 
    path('/send/message', views.receive_message, name='receive_message'),
    path('/send/feedback', views.send_feedback, name='send_feedback'),
]
