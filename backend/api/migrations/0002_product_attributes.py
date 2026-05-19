from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='brand',
            field=models.CharField(blank=True, max_length=120),
        ),
        migrations.AddField(
            model_name='product',
            name='category',
            field=models.CharField(
                choices=[
                    ('tops', 'Tops'),
                    ('bottoms', 'Bottoms'),
                    ('outerwear', 'Outerwear'),
                    ('dresses', 'Dresses'),
                    ('shoes', 'Shoes'),
                    ('accessories', 'Accessories'),
                ],
                default='tops',
                max_length=30,
            ),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='product',
            name='color',
            field=models.CharField(default='black', max_length=60),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='product',
            name='gender',
            field=models.CharField(
                choices=[('men', 'Men'), ('women', 'Women'), ('unisex', 'Unisex')],
                default='unisex',
                max_length=20,
            ),
        ),
        migrations.AddField(
            model_name='product',
            name='image_url',
            field=models.URLField(blank=True),
        ),
        migrations.AddField(
            model_name='product',
            name='size',
            field=models.CharField(default='M', max_length=20),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='product',
            name='stock_quantity',
            field=models.PositiveIntegerField(default=0),
        ),
    ]
