import { NextResponse } from 'next/server';
import { connectDB, isMongoDBConfigured } from '@/lib/db';
import { stripe } from '@/lib/stripe';
import { OrderModel } from '@/models/Order';

type CheckoutItem = {
  productId: string;
  name: string;
  quantity: number;
  size: string;
  color: string;
  price: number;
};

type ShippingAddress = {
  fullName?: string;
  email?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
};

function getOrigin(request: Request) {
  return process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
}

function toStripeAmount(price: number) {
  return Math.round(price * 100);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      userId?: string;
      items?: CheckoutItem[];
      shippingAddress?: ShippingAddress;
      subtotal?: number;
      tax?: number;
      total?: number;
    };

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'STRIPE_SECRET_KEY is not configured for sandbox checkout.' }, { status: 500 });
    }

    if (!body.items?.length) {
      return NextResponse.json({ error: 'Your cart is empty.' }, { status: 400 });
    }

    if (!body.shippingAddress?.email) {
      return NextResponse.json({ error: 'A shipping email is required.' }, { status: 400 });
    }

    const subtotalInCents = body.items.reduce((sum, item) => sum + toStripeAmount(item.price) * item.quantity, 0);
    const taxInCents = Math.max(0, Math.round((body.tax || 0) * 100));
    const totalInCents = subtotalInCents + taxInCents;

    if (totalInCents < 50) {
      return NextResponse.json({ error: 'Stripe requires a minimum charge of $0.50 USD.' }, { status: 400 });
    }

    let orderId: string | undefined;

    if (isMongoDBConfigured()) {
      await connectDB();

      const order = await OrderModel.create({
        userId: body.userId || '000000000000000000000001',
        items: body.items,
        shippingAddress: body.shippingAddress,
        subtotal: body.subtotal,
        tax: body.tax,
        total: body.total,
        status: 'pending_payment',
      });

      orderId = String(order._id);
    }

    const origin = getOrigin(request);
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: body.shippingAddress.email,
      line_items: [
        ...body.items.map((item) => ({
          quantity: item.quantity,
          price_data: {
            currency: 'usd',
            unit_amount: toStripeAmount(item.price),
            product_data: {
              name: item.name,
              description: `${item.color} / ${item.size}`,
            },
          },
        })),
        ...(taxInCents > 0
          ? [
              {
                quantity: 1,
                price_data: {
                  currency: 'usd',
                  unit_amount: taxInCents,
                  product_data: { name: 'Estimated tax' },
                },
              },
            ]
          : []),
      ],
      metadata: {
        ...(orderId ? { orderId } : {}),
        integration: 'sandbox_checkout_session',
      },
      payment_intent_data: {
        metadata: {
          ...(orderId ? { orderId } : {}),
          integration: 'sandbox_checkout_session',
        },
      },
      success_url: `${origin}/api/checkout/complete?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?canceled=1`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to create a Stripe Checkout session.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
