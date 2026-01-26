from django.shortcuts import render
from rest_framework.decorators import api_view
import pandas as pd
from .serializer import ProductSerializer
from .models import Product
from django.db import DatabaseError
from rest_framework.response import Response


@api_view(['POST','GET'])
def dataset_load(request):
   # load csv file
   dataset = pd.read_csv("../AI/dataset/glowup.csv")
   # Convert dataset to list of dictionaries
   data_dict = dataset.to_dict(orient='records')
   product_instances = []
   errors = []

   for entry in data_dict:
       serializer = ProductSerializer(data =entry)
       if serializer.is_valid():
           product_instances.append(Product(**serializer.validated_data))
# Product({'name': 'Serum', 'price': 20}) validated data looks like this which will create issue bcz we are trying to put into a field
# if we use ** ,Django sees the field names and assigns the values correctly.
       else:
           errors.append({"product": entry.get('product_name'), "error": serializer.errors})
   try:
    saved_objs = Product.objects.bulk_create(product_instances)
    print(f"Success! {len(saved_objs)} products are now in the DB.")
   except DatabaseError as e:
    print(f"Database error: {e}")
    
   return Response({
        "message": f"Successfully imported {len(product_instances)} products",
        "errors_encountered": len(errors),
        "details": errors[:10] 
        })


