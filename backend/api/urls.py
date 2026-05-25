from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import OrderViewSet, ProductViewSet, health_check, product_filters

router = DefaultRouter()
router.register('products', ProductViewSet, basename='product')
router.register('orders', OrderViewSet, basename='order')

urlpatterns = [
    path('health/', health_check, name='health-check'),
    path('products/filters/', product_filters, name='product-filters'),
    path('', include(router.urls)),
]
