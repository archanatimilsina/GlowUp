from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

# Create your models here.
class Product(models.Model):
    product_name = models.CharField(max_length=150)
    product_type = models.CharField(max_length=100)
    brand = models.CharField(max_length=100)
    notable_effects = models.JSONField(default=list)
    skin_type = models.JSONField(default=list)
    price = models.DecimalField(max_digits=20,decimal_places=2)
    picture_src = models.URLField(max_length=500)
    description = models.TextField()
    rating = models.FloatField(validators=[MinValueValidator(0.0),MaxValueValidator(5.0)])
       