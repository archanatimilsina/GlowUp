from django.contrib import admin
from .models import ForumPost, Comment

@admin.register(ForumPost)
class ForumPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'created_at', 'total_likes')
    
    search_fields = ('title', 'content', 'author__email')
    
    list_filter = ('created_at', 'author')

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('user', 'post', 'text', 'created_at')
    search_fields = ('text', 'user__email', 'post__title')
    list_filter = ('created_at',)