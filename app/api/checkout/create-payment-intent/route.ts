import { NextResponse } from 'next/server';
import { getStripeClient } from '@/lib/stripe';

export async function POST(request: Request) {
  const { amount } = await request.json();

  try {
    const stripe = getStripeClient();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Stripe initialization failed' },
      { status: 500 },
    );
  }
}
