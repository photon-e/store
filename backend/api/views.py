from django.http import JsonResponse
from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Order, OrderItem, Product
from .serializers import OrderSerializer, ProductSerializer


def health_check(_: object) -> JsonResponse:
    return JsonResponse({'status': 'ok', 'service': 'django-backend'})


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]


class CartViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user, status=Order.Status.DRAFT).prefetch_related('items__product')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def add_item(self, request, pk=None):
        order = self.get_object()
        product_id = request.data.get('product_id')
        quantity = max(1, int(request.data.get('quantity', 1)))

        product = Product.objects.get(pk=product_id, is_active=True)
        item, created = OrderItem.objects.get_or_create(
            order=order,
            product=product,
            defaults={'quantity': quantity, 'unit_price_cents': product.price_cents},
        )
        if not created:
            item.quantity += quantity
            item.save(update_fields=['quantity'])

        return Response(OrderSerializer(order).data)
