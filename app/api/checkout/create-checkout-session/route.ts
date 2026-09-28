import { NextResponse } from 'next/server';
import { connectDB, isMongoDBConfigured } from '@/lib/db';
import { sampleProducts } from '@/lib/sampleData';
import { stripe } from '@/lib/stripe';
import { OrderModel } from '@/models/Order';
import { ProductModel } from '@/models/Product';

const TAX_RATE = 0.08;

type CheckoutRequestItem = {
  productId?: unknown;
  quantity?: unknown;
  size?: unknown;
  color?: unknown;
};

type CheckoutItem = {
  productId: string;
  name: string;
  quantity: number;
  size: string;
  color: string;
  pricePence: number;
};

type CatalogProduct = {
  id: string;
  name: string;
  pricePence: number;
  stock: number;
  sizes: string[];
  colors: string[];
};

type ShippingAddress = {
  fullName?: string;
  email?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
};

class CheckoutValidationError extends Error {}

function getOrigin(request: Request) {
  return process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
}

async function getCatalogProducts(productIds: string[]): Promise<CatalogProduct[]> {
  if (!isMongoDBConfigured()) {
    return sampleProducts.map((product) => ({
      id: product._id,
      name: product.name,
      pricePence: product.pricePence,
      stock: product.stock,
      sizes: product.sizes,
      colors: product.colors,
    }));
  }

  await connectDB();
  const products = await ProductModel.find({ _id: { $in: productIds } }).lean();

  return products.map((product) => ({
    id: String(product._id),
    name: product.name,
    pricePence: product.pricePence,
    stock: product.stock,
    sizes: product.sizes,
    colors: product.colors,
  }));
}

async function buildCheckoutItems(requestedItems: unknown): Promise<CheckoutItem[]> {
  if (!Array.isArray(requestedItems) || requestedItems.length === 0) {
    throw new CheckoutValidationError('Your cart is empty.');
  }

  const items = requestedItems as CheckoutRequestItem[];
  const productIds = items.map((item) => item.productId).filter((productId): productId is string => typeof productId === 'string');

  if (productIds.length !== items.length) {
    throw new CheckoutValidationError('Each cart item must include a valid product ID.');
  }

  const catalogProducts = await getCatalogProducts([...new Set(productIds)]);
  const productsById = new Map(catalogProducts.map((product) => [product.id, product]));
  const quantitiesByProduct = new Map<string, number>();

  for (const item of items) {
    if (!Number.isInteger(item.quantity) || (item.quantity as number) <= 0) {
      throw new CheckoutValidationError('Each cart item must have a positive whole-number quantity.');
    }

    quantitiesByProduct.set(item.productId as string, (quantitiesByProduct.get(item.productId as string) || 0) + (item.quantity as number));
  }

  for (const [productId, quantity] of quantitiesByProduct) {
    const product = productsById.get(productId);
    if (!product) throw new CheckoutValidationError('A product in your cart is no longer available.');
    if (quantity > product.stock) throw new CheckoutValidationError(`${product.name} does not have enough stock available.`);
  }

  return items.map((item) => {
    const product = productsById.get(item.productId as string);
    if (!product) throw new CheckoutValidationError('A product in your cart is no longer available.');
    if (typeof item.size !== 'string' || !product.sizes.includes(item.size)) {
      throw new CheckoutValidationError(`The selected size for ${product.name} is unavailable.`);
    }
    if (typeof item.color !== 'string' || !product.colors.includes(item.color)) {
      throw new CheckoutValidationError(`The selected colour for ${product.name} is unavailable.`);
    }

    return {
      productId: product.id,
      name: product.name,
      quantity: item.quantity as number,
      size: item.size,
      color: item.color,
      pricePence: product.pricePence,
    };
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { items?: unknown; shippingAddress?: ShippingAddress };

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'STRIPE_SECRET_KEY is not configured for sandbox checkout.' }, { status: 500 });
    }
    if (!body.shippingAddress?.email) {
      return NextResponse.json({ error: 'A shipping email is required.' }, { status: 400 });
    }

    const items = await buildCheckoutItems(body.items);
    const subtotalPence = items.reduce((sum, item) => sum + item.pricePence * item.quantity, 0);
    const taxPence = Math.round(subtotalPence * TAX_RATE);
    const totalPence = subtotalPence + taxPence;

    if (totalPence < 30) {
      return NextResponse.json({ error: 'Stripe requires a minimum charge of £0.30 GBP.' }, { status: 400 });
    }

    let orderId: string | undefined;
    if (isMongoDBConfigured()) {
      const order = await OrderModel.create({
        items,
        shippingAddress: body.shippingAddress,
        subtotalPence,
        taxPence,
        totalPence,
        status: 'pending_payment',
      });
      orderId = String(order._id);
    }

    const origin = getOrigin(request);
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: body.shippingAddress.email,
      line_items: [
        ...items.map((item) => ({
          quantity: item.quantity,
          price_data: {
            currency: 'gbp',
            unit_amount: item.pricePence,
            product_data: { name: item.name, description: `${item.color} / ${item.size}` },
          },
        })),
        {
          quantity: 1,
          price_data: {
            currency: 'gbp',
            unit_amount: taxPence,
            product_data: { name: 'Estimated tax' },
          },
        },
      ],
      metadata: { ...(orderId ? { orderId } : {}), integration: 'sandbox_checkout_session' },
      payment_intent_data: { metadata: { ...(orderId ? { orderId } : {}), integration: 'sandbox_checkout_session' } },
      success_url: `${origin}/api/checkout/complete?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?canceled=1`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to create a Stripe Checkout session.';
    const status = error instanceof CheckoutValidationError ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
