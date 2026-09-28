import { NextResponse } from 'next/server';
export async function POST() {
  return NextResponse.json(
    { error: 'Payment Intents are not supported. Use the server-validated Stripe Checkout endpoint instead.' },
    { status: 410 },
  );
}
