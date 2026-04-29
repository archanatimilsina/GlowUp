from django.contrib import admin
from .models import Contact
@admin.register(Contact)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['id','full_name','email','brand_name','subject','message','created_at','admin_note','is_resolved']


