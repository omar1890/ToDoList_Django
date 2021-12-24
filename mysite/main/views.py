from django.http import HttpResponse, HttpResponseRedirect, response
from django.shortcuts import render

from django.http import HttpResponse
from .forms import CreateNewList
from .models import ToDoList, Item
# Create your views here.


# def index(response, id):
#     ls = ToDoList.objects.get(id=id)
#     return render(response, "main/list.html", {"ls": ls})
def index(request, id):
        ls = ToDoList.objects.get(id=id)

        if request.method == "POST":
            if request.POST.get("save"):
                for item in ls.item_set.all():
                    p = request.POST

                    if "clicked" == p.get("c"+str(item.id)):
                        item.complete = True
                    else:
                        item.complete = False

                    if "text" + str(item.id) in p:
                        item.text = p.get("text" + str(item.id))

                    item.save()

            elif request.POST.get("add"):
                newItem = request.POST.get("new")
                if newItem != "":
                    ls.item_set.create(text=newItem, complete=False)
                else:
                    print("invalid")

        return render(request, "main/index.html", {"ls": ls})


def home(response):
    return render(response, "main/home.html", {})


# def create_list(response):
# 	return render(response,'main/create_list.html',{'form':form})
def create_list(response):
    if response.method == "POST":
        form = CreateNewList(response.POST)
        print(form)
        if form.is_valid():
            n = form.cleaned_data["name"]
            t = ToDoList(name=n)
            t.save()

        return HttpResponseRedirect("/%i" % t.id)

    else:
        form = CreateNewList()

    return render(response, "main/create_list.html", {"form": form})
