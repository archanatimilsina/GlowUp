from django.shortcuts import render
from rest_framework.decorators import api_view
import pandas as pd
from .serializer import ProductSerializer
from .models import Product
from django.db import DatabaseError
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status
import ast
from django.http import JsonResponse
from .utils import recommend_skin_products 
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
import os
import pandas as pd
from django.conf import settings

@api_view(['GET'])
def product_view(request):
   products = Product.objects.all()
   serializer = ProductSerializer(products,many=True)
   return Response(serializer.data)

# @api_view(['GET'])  
# def product_view_by_id(request, id):
#    try:
#       product = Product.objects.get(id=id)
#       serializer = ProductSerializer(product)
#       if serializer.is_valid():
#         return Response(serializer.data)
#    except Product.DoesNotExist:
#       return Response({'error':'Product not found!!'},status=404)

@api_view(['GET'])  
def product_view_by_id(request, id):
   try:
      product = Product.objects.get(id=id)
      serializer = ProductSerializer(product)
      return Response(serializer.data)
   except Product.DoesNotExist:
      return Response({'error':'Product not found!!'}, status=404)

@api_view(['GET'])  
def product_view_by_type(request, product_type):
   try:
      products = Product.objects.filter(product_type__iexact=product_type)
      if not products.exists():
        return Response({'error': 'No products found for this type.'}, status=404)
      serializer = ProductSerializer(products, many =True)
      return Response(serializer.data)
   except Product.DoesNotExist:
      return Response({'error':'Product not found!!'},status=404)
 

@api_view(['PUT','PATCH'])
def product_update(request,id):
   product = get_object_or_404(id=id)
   is_partial = (request.method == "PATCH")
   serializer = ProductSerializer(instance = product, data = request.data, patch =is_partial)
   if serializer.is_valid():
      serializer.save()
      return Response(serializer.data)
   return Response(serializer.errors, status= 400)
   
@api_view(['DELETE'])
def product_delete(request,id):
   product = get_object_or_404(id=id)
   product.objects.delete()
   return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST','GET'])
def dataset_load(request):
   file_path = os.path.join(settings.BASE_DIR, 'AI', 'dataset', 'glowup.csv')
   # load csv file
   dataset = pd.read_csv(file_path)
   # dataset['notable_effects'] = dataset['notable_effects'].map(ast.literal_eval)
   # dataset['skin_type']= dataset['skin_type'].map(ast.literal_eval)
   # 2. Fix the decimal error: Round price to 2 decimal places
   if 'price' in dataset.columns:
        dataset['price'] = pd.to_numeric(dataset['price'], errors='coerce').round(2)
   # Convert dataset to list of dictionaries
   data_dict = dataset.to_dict(orient='records')
   product_instances = []
   errors = []

   for entry in data_dict:
       serializer = ProductSerializer(data =entry)
       if serializer.is_valid():
          serializer.save()
         #   product_instances.append(Product(**serializer.validated_data))
# Product({'name': 'Serum', 'price': 20}) validated data looks like this which will create issue bcz we are trying to put into a field
# if we use ** ,Django sees the field names and assigns the values correctly.
       else:
           errors.append({"product": entry.get('product_name'), "error": serializer.errors})


   # if product_instances:
   #   try:
   #     saved_objs = Product.objects.bulk_create(product_instances, batch_size=100, ignore_conflicts=True)
   #     print(f"Success! {len(saved_objs)} products are now in the DB.")
   #   except Exception as e:
   #         return Response({"error": f"Database insertion failed: {str(e)}"}, status=500)    
   return Response({
        "message": f"Successfully imported {len(product_instances)} products",
        "errors_count": len(errors),
        "errors_detail": errors[:10]  # Show first 10 errors for debugging
    }, status=status.HTTP_201_CREATED)




@api_view(['POST'])
def recommend_view(request):
    email = request.data.get('email')
    print(f"Searching for user with email: {email}")
    try:
        user = User.objects.get(email=email)
        recommendations = recommend_skin_products(user)
        
        data = []
        for item in recommendations[:]:
            p = item['product']
            data.append({
                'id': p.id,
                'product_name': p.product_name,
                'product_type': p.product_type,
                'picture_src': p.picture_src,
                'price': str(p.price),
                'rating': p.rating,
                'skin_type': p.skin_type
            })
        return JsonResponse(data, safe=False)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Cart, Product

@csrf_exempt
def insertIntoCart(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_email = data.get('email')
            product_id = data.get('product_id')

            if not user_email or not product_id:
                return JsonResponse({'error': 'Missing data'}, status=400)
            product = Product.objects.get(id=product_id)
            cart_item, created = Cart.objects.get_or_create(
                email=user_email, 
                product=product
            )
            if not created:
                cart_item.quantity += 1
                cart_item.save()

            return JsonResponse({'message': 'Added to cart successfully'}, status=200)

        except Product.DoesNotExist:
            return JsonResponse({'error': 'Product not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid method'}, status=405)

from django.http import JsonResponse
from .models import Cart


def viewCart(request):
    # This grabs the email from the URL (?email=...)
    user_email = request.GET.get('email')

    if not user_email:
        return JsonResponse({'error': 'Email is required'}, status=400)

    # 1. Find all cart rows belonging to this email
    # We use .select_related('product') to make it faster
    cart_items = Cart.objects.filter(email=user_email).select_related('product')

    # 2. Convert the database rows into a list React can understand
    data = []
    for item in cart_items:
        data.append({
            "id": item.id, # The ID of the Cart record itself
            "product_id": item.product.id, # The ID of the Skin Product
            "title": item.product.product_name,
            "brand": item.product.brand,
            "price": item.product.price,
            "qty": item.quantity,
            "image": item.product.picture_src
        })

    # 3. Send the list back to React
    return JsonResponse(data, safe=False)


from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Cart  # Make sure this matches your model name

@api_view(['DELETE'])
def remove_from_cart(request, id):
    try:
        # Find the cart item by its primary key (ID)
        item = Cart.objects.get(id=id)
        item.delete()
        return Response({"message": "Item removed successfully"}, status=status.HTTP_200_OK)
    except Cart.DoesNotExist:
        return Response({"error": "Item not found"}, status=status.HTTP_404_NOT_FOUND)