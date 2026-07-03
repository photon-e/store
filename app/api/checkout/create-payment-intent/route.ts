import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

type CheckoutItem = {
  productId?: string;
  name?: string;
  quantity?: number;
  size?: string;
  color?: string;
  price?: number;
};

export async function POST(request: Request) {
  try {
    const { amount, cart } = (await request.json()) as { amount?: number; cart?: CheckoutItem[] };

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'STRIPE_SECRET_KEY is not configured for sandbox checkout.' }, { status: 500 });
    }

    if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: 'A valid checkout amount is required.' }, { status: 400 });
    }

    const amountInCents = Math.round(amount * 100);

    if (amountInCents < 50) {
      return NextResponse.json({ error: 'Stripe requires a minimum charge of $0.50 USD.' }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
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
