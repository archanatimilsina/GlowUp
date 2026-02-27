from django.urls import path
from . import views

urlpatterns = [
    path('dataset_load/', views.dataset_load ,name="load_dataset") ,
    path('view/', views.product_view ,name="product_view") ,
    path('view/<int:id>/', views.product_view_by_id ,name="product_view_by_id") ,
    path('view/type/<str:product_type>/', views.product_view_by_type, name="product_view_by_type"),
    path('update/<int:id>/', views.product_update ,name="product_update") ,
    path('delete/<int:id>/', views.product_delete ,name="product_delete") ,
    path('recommend/', views.recommend_view, name='recommend-products'),
    path('cart/add/', views.insertIntoCart, name='add-to-cart'),
    path('cart/view/', views.viewCart, name='view-cart'),
    path('cart/delete/<int:id>/', views.remove_from_cart, name='remove_from_cart'),
]
