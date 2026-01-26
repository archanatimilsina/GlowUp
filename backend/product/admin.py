from django.contrib import admin
from .models import Product
# Register your models here.
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['product_name','product_type','brand','notable_effects','skin_type','price','picture_src','description','rating']
