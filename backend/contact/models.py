from django.db import models

class Contact(models.Model):
    full_name = models.CharField(max_length=150)
    email = models.EmailField()
    brand_name = models.CharField(max_length=150, blank=True, null=True)
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_resolved = models.BooleanField(default=False)
    admin_note = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['-created_at'] 

    def __str__(self):
        return f"{self.full_name} - {self.subject}"