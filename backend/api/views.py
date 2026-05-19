from django.db.models import Q
from django.http import JsonResponse
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Order, OrderItem, Product
from .serializers import AddOrderItemSerializer, OrderSerializer, ProductSerializer


def health_check(_: object) -> JsonResponse:
    return JsonResponse({'status': 'ok', 'service': 'django-backend'})


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ProductSerializer
    queryset = Product.objects.filter(is_active=True)

    def get_queryset(self):
        queryset = super().get_queryset()
        params = self.request.query_params

        category = params.get('category')
        if category:
            queryset = queryset.filter(category=category)

        gender = params.get('gender')
        if gender:
            queryset = queryset.filter(gender=gender)

        color = params.get('color')
        if color:
            queryset = queryset.filter(color__iexact=color)

        size = params.get('size')
        if size:
            queryset = queryset.filter(size__iexact=size)

        min_price = params.get('min_price_cents')
        if min_price:
            queryset = queryset.filter(price_cents__gte=min_price)

        max_price = params.get('max_price_cents')
        if max_price:
            queryset = queryset.filter(price_cents__lte=max_price)

        search = params.get('search')
        if search:
            queryset = queryset.filter(Q(name__icontains=search) | Q(description__icontains=search) | Q(brand__icontains=search))

        return queryset


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items__product')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def add_item(self, request, pk=None):
        order = self.get_object()
        if order.status != Order.Status.DRAFT:
            return Response({'detail': 'Only draft orders can be modified.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = AddOrderItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product = serializer.validated_data['product']
        quantity = serializer.validated_data['quantity']

        if product.stock_quantity < quantity:
            return Response({'detail': 'Insufficient stock for this product.'}, status=status.HTTP_400_BAD_REQUEST)

        order_item, created = OrderItem.objects.get_or_create(
            order=order,
            product=product,
            defaults={'quantity': quantity, 'unit_price_cents': product.price_cents},
        )
        if not created:
            order_item.quantity += quantity
            if order_item.quantity > product.stock_quantity:
                return Response({'detail': 'Insufficient stock for this product.'}, status=status.HTTP_400_BAD_REQUEST)
            order_item.save(update_fields=['quantity'])

        return Response(self.get_serializer(order).data, status=status.HTTP_200_OK)
