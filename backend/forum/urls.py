from django.urls import path
from .views import (
    ForumPostListCreateView, 
    ToggleLikeView, 
    CommentActionView, 
    PostDetailUpdateDeleteView
)

urlpatterns = [
    path('posts/', ForumPostListCreateView.as_view(), name='post-list-create'),
    path('posts/<int:post_id>/', PostDetailUpdateDeleteView.as_view(), name='post-detail'),
    path('posts/<int:post_id>/like/', ToggleLikeView.as_view(), name='post-like'),
    path('posts/<int:post_id>/comment/', CommentActionView.as_view(), name='post-comment'),
]