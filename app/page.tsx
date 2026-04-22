import Link from 'next/link';
import { sampleProducts } from '@/lib/sampleData';
import { ProductCard } from '@/components/product/ProductCard';

export default function HomePage() {
  return (
    <div>
      <section className="relative">
        <img src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1900&q=80" alt="Hero" className="h-[60vh] w-full object-cover md:h-[75vh]" />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 container-page flex items-end pb-16">
          <div className="max-w-xl text-white">
            <p className="mb-3 text-xs uppercase tracking-[0.24em]">Spring/Summer 2026</p>
            <h1 className="mb-6 text-4xl font-light uppercase tracking-[0.16em] md:text-6xl">Premium Daily Wear</h1>
            <Link href="/shop" className="inline-block border border-white px-7 py-3 text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-black">Explore Collection</Link>
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-2xl uppercase tracking-[0.2em]">Featured</h2>
          <Link href="/shop" className="text-xs uppercase tracking-[0.18em] text-zinc-500">View all</Link>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {sampleProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
