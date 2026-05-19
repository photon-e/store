from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Product(TimeStampedModel):
    class Category(models.TextChoices):
        TOPS = 'tops', 'Tops'
        BOTTOMS = 'bottoms', 'Bottoms'
        OUTERWEAR = 'outerwear', 'Outerwear'
        DRESSES = 'dresses', 'Dresses'
        SHOES = 'shoes', 'Shoes'
        ACCESSORIES = 'accessories', 'Accessories'

    class Gender(models.TextChoices):
        MEN = 'men', 'Men'
        WOMEN = 'women', 'Women'
        UNISEX = 'unisex', 'Unisex'

    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    brand = models.CharField(max_length=120, blank=True)
    category = models.CharField(max_length=30, choices=Category.choices)
    gender = models.CharField(max_length=20, choices=Gender.choices, default=Gender.UNISEX)
    color = models.CharField(max_length=60)
    size = models.CharField(max_length=20)
    image_url = models.URLField(blank=True)
    price_cents = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    stock_quantity = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['name']

    def __str__(self) -> str:
        return self.name


class Order(TimeStampedModel):
    class Status(models.TextChoices):
        DRAFT = 'draft', 'Draft'
        PLACED = 'placed', 'Placed'
        PAID = 'paid', 'Paid'
        CANCELLED = 'cancelled', 'Cancelled'

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders')
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)

    @property
    def total_cents(self) -> int:
        return sum(item.quantity * item.unit_price_cents for item in self.items.all())


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.PROTECT, related_name='order_items')
    quantity = models.PositiveIntegerField(default=1, validators=[MinValueValidator(1)])
    unit_price_cents = models.PositiveIntegerField()

    class Meta:
        unique_together = ('order', 'product')
