from django.db import models
from django.conf import settings

class ForumPost(models.Model):
    # The person who created the post
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='my_forum_posts'
    )
    title = models.CharField(max_length=255)
    content = models.TextField()
    image = models.ImageField(upload_to='forum_posts/%Y/%m/', null=True, blank=True)
    likes = models.ManyToManyField(
        settings.AUTH_USER_MODEL, 
        related_name='liked_posts', 
        blank=True
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at'] 

    def total_likes(self):
        return self.likes.count()

    def __str__(self):
        return f"{self.title} by {self.author.email}"

class Comment(models.Model):
    post = models.ForeignKey(
        ForumPost, 
        on_delete=models.CASCADE, 
        related_name='comments'
    )
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='my_comments'
    )
    
    text = models.TextField()
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Comment by {self.user.email} on {self.post.title}"