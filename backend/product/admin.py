from django.contrib import admin
from .models import Product, Cart
# Register your models here.
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['id','product_name','product_type','brand','notable_effects','skin_type','price','picture_src','description','rating']



@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['id', 'email', 'get_product_name', 'quantity', 'added_at']
    search_fields = ['email']
    def get_product_name(self, obj):
        return obj.product.product_name
    get_product_name.short_description = 'Product Name' 