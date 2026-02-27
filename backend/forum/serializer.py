from rest_framework import serializers
from .models import ForumPost, Comment

# --- 1. COMMENT SERIALIZER ---
class CommentSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    user_profile_pic = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'user', 'text', 'user_profile_pic']

    def get_user_profile_pic(self, obj):
        """
        Safely gets the profile picture of the person who commented.
        """
        try:
            # Check if user has a profile and if that profile has a picture
            if hasattr(obj.user, 'profile') and obj.user.profile.profile_pic:
                return obj.user.profile.profile_pic.url
        except Exception:
            return None
        return None


# --- 2. FORUM POST SERIALIZER ---
class ForumPostSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='author.username')
    author_email = serializers.ReadOnlyField(source='author.email')
    
    # FIX: Removed source='total_likes' to stop the AssertionError
    total_likes = serializers.ReadOnlyField() 
    
    author_profile_pic = serializers.SerializerMethodField()
    isLiked = serializers.SerializerMethodField()
    
    # This nesting allows us to see the comments inside the post object
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = ForumPost
        fields = [
            'id', 'author', 'author_email', 'author_profile_pic', 
            'title', 'content', 'image', 'total_likes', 
            'isLiked', 'created_at', 'comments'
        ]

    def get_author_profile_pic(self, obj):
        """
        Fetches the profile picture of the post author.
        """
        try:
            if hasattr(obj.author, 'profile') and obj.author.profile.profile_pic:
                return obj.author.profile.profile_pic.url
        except Exception:
            return None
        return None

    def get_isLiked(self, obj):
        """
        Checks if the currently logged-in user (passed via context) 
         has liked this specific post.
        """
        email = self.context.get('current_user_email')
        if email:
            # Checks if any user with this email is in the 'likes' many-to-many field
            return obj.likes.filter(email=email).exists()
        return False