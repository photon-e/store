import Link from 'next/link';

export default async function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="container-page py-16 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Order confirmed</p>
      <h1 className="mt-3 text-3xl uppercase tracking-[0.16em]">Thank you for your purchase</h1>
      <p className="mt-3 text-zinc-600">Your order ID: {id}</p>
      <Link href="/shop" className="mt-8 inline-block border px-5 py-3 text-xs uppercase tracking-[0.18em]">Continue shopping</Link>
    </div>
  );
}
