from django.contrib import admin

# Register your models here.
from .models import ToDoList, Item
# Register your models here.
admin.site.register(ToDoList)
admin.site.register(Item)