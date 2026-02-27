# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from django.shortcuts import get_object_or_404
# from django.contrib.auth import get_user_model
# from django.core.files.base import ContentFile
# import base64

# # Import your models
# from .models import ForumPost, Comment

# User = get_user_model()

# # --- 1. POST LOGIC (VIEW ALL & CREATE) ---

# class ForumPostListCreateView(APIView):
#     """
#     GET: View all posts and their comments
#     POST: Create a new post with an optional image
#     """
#     def get(self, request):
#         posts = ForumPost.objects.all().order_by('-created_at')
#         data = []
        
#         # We manually build the list to show you how data flows
#         for post in posts:
#             data.append({
#                 "id": post.id,
#                 "author": post.author.username,
#                 "author_email": post.author.email,
#                 "title": post.title,
#                 "content": post.content,
#                 "image": post.image.url if post.image else None,
#                 "total_likes": post.total_likes(),
#                 # Checks if the person looking at the post has liked it
#                 "isLiked": request.user in post.likes.all() if request.user.is_authenticated else False,
#                 "created_at": post.created_at,
#                 "comments": [
#                     {
#                         "id": c.id, 
#                         "user": c.user.username, 
#                         "user_email": c.user.email,
#                         "text": c.text,
#                         "created_at": c.created_at
#                     } for c in post.comments.all()
#                 ]
#             })
#         return Response(data)

#     def post(self, request):
#         # Find the person posting by their email
#         email = request.data.get('email')
#         author = get_object_or_404(User, email=email)
        
#         post = ForumPost.objects.create(
#             author=author,
#             title=request.data.get('title'),
#             content=request.data.get('content')
#         )

#         # Handle Base64 Image (The string React sends)
#         image_data = request.data.get('image_data')
#         if image_data:
#             try:
#                 format, imgstr = image_data.split(';base64,')
#                 ext = format.split('/')[-1]
#                 data = ContentFile(base64.b64decode(imgstr), name=f"post_{post.id}.{ext}")
#                 post.image = data
#                 post.save()
#             except Exception as e:
#                 return Response({"error": "Image upload failed"}, status=400)

#         return Response({"message": "Post Created!", "id": post.id}, status=status.HTTP_201_CREATED)


# # --- 2. POST EDIT/DELETE LOGIC ---

# class PostDetailUpdateDeleteView(APIView):
#     """
#     PUT: Edit a post (Only if you are the author)
#     DELETE: Remove a post
#     """
#     def put(self, request, post_id):
#         post = get_object_or_404(ForumPost, id=post_id)
#         user_email = request.data.get('email')

#         # Security check: Only the author can edit
#         if post.author.email != user_email:
#             return Response({"error": "You cannot edit someone else's post"}, status=403)
            
#         post.title = request.data.get('title', post.title)
#         post.content = request.data.get('content', post.content)
#         post.save()
#         return Response({"message": "Post updated successfully"})

#     def delete(self, request, post_id):
#         post = get_object_or_404(ForumPost, id=post_id)
#         post.delete()
#         return Response({"message": "Post deleted"}, status=status.HTTP_204_NO_CONTENT)


# # --- 3. LIKE TOGGLE LOGIC ---

# class ToggleLikeView(APIView):
#     """
#     POST: If liked, unlike it. If not, like it.
#     """
#     def post(self, request, post_id):
#         post = get_object_or_404(ForumPost, id=post_id)
#         user_email = request.data.get('email')
#         user = get_object_or_404(User, email=user_email)

#         if user in post.likes.all():
#             post.likes.remove(user)
#             action = "unliked"
#         else:
#             post.likes.add(user)
#             action = "liked"

#         return Response({
#             "action": action, 
#             "total_likes": post.total_likes(),
#             "isLiked": user in post.likes.all()
#         })


# # --- 4. COMMENT CRUD LOGIC ---

# class CommentActionView(APIView):
#     """
#     POST: Add a new comment to a post
#     PUT: Edit an existing comment
#     DELETE: Delete a comment
#     """
#     def post(self, request, post_id):
#         post = get_object_or_404(ForumPost, id=post_id)
#         user_email = request.data.get('email')
#         user = get_object_or_404(User, email=user_email)
        
#         text = request.data.get('text')
#         if not text:
#             return Response({"error": "Text is required"}, status=400)

#         comment = Comment.objects.create(
#             post=post,
#             user=user,
#             text=text
#         )
#         return Response({"message": "Comment added", "comment_id": comment.id}, status=201)

#     def put(self, request, comment_id):
#         comment = get_object_or_404(Comment, id=comment_id)
#         user_email = request.data.get('email')

#         if comment.user.email != user_email:
#             return Response({"error": "Unauthorized"}, status=403)

#         comment.text = request.data.get('text', comment.text)
#         comment.save()
#         return Response({"message": "Comment updated"})

#     def delete(self, request, comment_id):
#         comment = get_object_or_404(Comment, id=comment_id)
#         comment.delete()
#         return Response({"message": "Comment deleted"}, status=204)


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
        # 1. Get the current user's email from the URL (?email=...)
        current_user_email = request.query_params.get('email')
        
        # 2. Fetch all posts
        posts = ForumPost.objects.all().order_by('-created_at')
     
        serializer = ForumPostSerializer(
            posts, 
            many=True, 
            context={'current_user_email': current_user_email}
        )
        
        # 4. Return the clean data
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