from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializer import ContactSerializer
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
@api_view(['POST']) 
def submit_contact_form(request):
    serializer = ContactSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Success! We received your note."}, status=201)
    
    return Response(serializer.errors, status=400)