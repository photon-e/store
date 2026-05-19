from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import CartViewSet, ProductViewSet, health_check

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'carts', CartViewSet, basename='cart')

urlpatterns = [
    path('health/', health_check, name='health-check'),
    path('', include(router.urls)),
]
