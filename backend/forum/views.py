from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
import base64

from .models import ForumPost, Comment
from .serializer import ForumPostSerializer
User = get_user_model()

class ForumPostListCreateView(APIView):
    def get(self, request):
        current_user_email = request.query_params.get('email')
        posts = ForumPost.objects.all().order_by('-created_at')
        serializer = ForumPostSerializer(
            posts, 
            many=True, 
            context={'current_user_email': current_user_email}
        )
        return Response(serializer.data)
    def post(self, request):
        email = request.data.get('email')
        author = get_object_or_404(User, email=email)
        post = ForumPost.objects.create(
            author=author,
            title=request.data.get('title'),
            content=request.data.get('content')
        )
        image_data = request.data.get('image_data')
        if image_data:
            try:
                format, imgstr = image_data.split(';base64,')
                ext = format.split('/')[-1]
                data = ContentFile(base64.b64decode(imgstr), name=f"post_{post.id}.{ext}")
                post.image = data
                post.save()
            except Exception:
                return Response({"error": "Image upload failed"}, status=400)
        return Response({"message": "Post Created!", "id": post.id}, status=201)

class ToggleLikeView(APIView):
    def post(self, request, post_id):
        post = get_object_or_404(ForumPost, id=post_id)
        user_email = request.data.get('email')
        user = get_object_or_404(User, email=user_email)
        if user in post.likes.all():
            post.likes.remove(user)
            action = "unliked"
        else:
            post.likes.add(user)
            action = "liked"
        return Response({
            "action": action, 
            "total_likes": post.total_likes(),
            "isLiked": (action == "liked")
        })


class CommentActionView(APIView):
    def post(self, request, post_id):
        post = get_object_or_404(ForumPost, id=post_id)
        user_email = request.data.get('email')
        user = get_object_or_404(User, email=user_email)
        text = request.data.get('text')
        if not text:
            return Response({"error": "Text is required"}, status=400)
        comment = Comment.objects.create(post=post, user=user, text=text)
        return Response({"message": "Comment added"}, status=201)



class PostDetailUpdateDeleteView(APIView):
    def delete(self, request, post_id):
        post = get_object_or_404(ForumPost, id=post_id)
        post.delete()
        return Response(status=204)