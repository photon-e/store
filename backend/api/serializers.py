from rest_framework import serializers

from .models import Order, OrderItem, Product


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'slug',
            'description',
            'brand',
            'category',
            'gender',
            'color',
            'size',
            'image_url',
            'price_cents',
            'stock_quantity',
            'is_active',
            'created_at',
            'updated_at',
        ]


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.filter(is_active=True), source='product', write_only=True
    )

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_id', 'quantity', 'unit_price_cents']
        read_only_fields = ['unit_price_cents']


class AddOrderItemSerializer(serializers.Serializer):
    product_id = serializers.PrimaryKeyRelatedField(queryset=Product.objects.filter(is_active=True), source='product')
    quantity = serializers.IntegerField(min_value=1, default=1)


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    total_cents = serializers.IntegerField(read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'status', 'items', 'total_cents', 'created_at', 'updated_at']
        read_only_fields = ['status']
