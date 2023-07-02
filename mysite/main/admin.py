from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from users.models import CustomUser

# Register your models here.
from .models import ToDoList, Item

# Register your models here.
admin.site.register(ToDoList)
admin.site.register(Item)

class CustomUserAdmin(UserAdmin):
    # specify the fields to display in the admin list view
    list_display = ('username', 'email', 'first_name', 'last_name', 'token')

# Register the CustomUser model with the CustomUserAdmin
admin.site.register(CustomUser, CustomUserAdmin)