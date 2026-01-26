from django.urls import path
from . import views

urlpatterns = [
    path('dataset_load/', views.dataset_load ,name="load_dataset") 
]
