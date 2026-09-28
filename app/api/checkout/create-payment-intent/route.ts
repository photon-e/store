import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

type CheckoutItem = {
  productId?: string;
  name?: string;
  quantity?: number;
  size?: string;
  color?: string;
  pricePence?: number;
};

export async function POST(request: Request) {
  try {
    const { amountPence, cart } = (await request.json()) as { amountPence?: number; cart?: CheckoutItem[] };

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'STRIPE_SECRET_KEY is not configured for sandbox checkout.' }, { status: 500 });
    }

    if (typeof amountPence !== 'number' || !Number.isFinite(amountPence) || amountPence <= 0) {
      return NextResponse.json({ error: 'A valid checkout amount is required.' }, { status: 400 });
    }

    const amountInPence = Math.round(amountPence);

    if (amountInPence < 30) {
      return NextResponse.json({ error: 'Stripe requires a minimum charge of £0.30 GBP.' }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInPence,
      currency: 'gbp',
      automatic_payment_methods: { enabled: true },
      metadata: {
        integration: 'sandbox_checkout',
        cartItems: String(cart?.length || 0),
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to create a Stripe payment intent.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
