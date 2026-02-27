from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

# Create your models here.
class Product(models.Model):
    id = models.AutoField(primary_key=True)
    product_name = models.CharField(max_length=150)
    product_type = models.CharField(max_length=100)
    brand = models.CharField(max_length=100)
    notable_effects = models.JSONField(default=list)
    skin_type = models.JSONField(default=list)
    price = models.DecimalField(max_digits=20,decimal_places=2)
    picture_src = models.URLField(max_length=500)
    description = models.TextField()
    rating = models.FloatField(validators=[MinValueValidator(0.0),MaxValueValidator(5.0)])
       

class Cart(models.Model):
    email = models.EmailField() 
    product = models.ForeignKey(Product,  on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.email} - {self.product.product_name}"