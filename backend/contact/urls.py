from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.submit_contact_form, name='contact'),
]