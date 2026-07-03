import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { sendOrderConfirmationEmail } from '@/lib/email';
import { stripe } from '@/lib/stripe';
import { OrderModel } from '@/models/Order';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.redirect(new URL('/checkout?payment=missing-session', request.url));
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const orderId = session.metadata?.orderId;

    if (!orderId) {
      return NextResponse.redirect(new URL(`/order-confirmation/${session.id}`, request.url));
    }

    await connectDB();

    const status = session.payment_status === 'paid' ? 'paid' : 'pending_payment';
    const order = await OrderModel.findByIdAndUpdate(
      orderId,
      {
        status,
        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : undefined,
      },
      { new: true },
    );

    if (status === 'paid' && order?.shippingAddress?.email) {
      await sendOrderConfirmationEmail(order.shippingAddress.email, String(order._id));
    }

    return NextResponse.redirect(new URL(`/order-confirmation/${orderId}`, request.url));
  } catch {
    return NextResponse.redirect(new URL('/checkout?payment=verification-failed', request.url));
  }
}
