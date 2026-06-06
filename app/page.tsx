import Link from 'next/link';
import { sampleProducts } from '@/lib/sampleData';
import { ProductCard } from '@/components/product/ProductCard';
import { HeroCarousel } from '@/components/layout/HeroCarousel';

export default function HomePage() {
  const featuredImages = [
    '/images/product-1.jpg',
    '/images/product-2.jpg',
    '/images/product-3.jpg',
    '/images/product-4.jpg',
    '/images/product-5.jpg',
    '/images/product-6.jpg',
    '/images/IMG_9520.JPG',
    '/images/IMG_9521.JPG',
    '/images/IMG_9522.JPG',
    '/images/IMG_9523.JPG',
    '/images/IMG_9524.JPG',
  ];

  return (
    <div>
      <HeroCarousel />

      <section className="container-page py-14">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-2xl uppercase tracking-[0.2em]">Featured</h2>
          <Link href="/shop" className="text-xs uppercase tracking-[0.18em] text-zinc-500">View all</Link>
        </div>
        <div className="mb-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {featuredImages.map((image, index) => {
            const product = sampleProducts[index % sampleProducts.length];
            return <ProductCard key={`featured-${product._id}-${image}`} product={{ ...product, images: [image] }} />;
          })}
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-zinc-50">
        <div className="container-page grid gap-6 py-12 text-center sm:grid-cols-3 sm:text-left">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-zinc-500">Free Shipping</p>
            <p className="text-sm text-zinc-700">On all US orders above $100.</p>
          </div>
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-zinc-500">Easy Returns</p>
            <p className="text-sm text-zinc-700">30-day return window with quick refunds.</p>
          </div>
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-zinc-500">Secure Payment</p>
            <p className="text-sm text-zinc-700">Encrypted checkout with trusted providers.</p>
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 p-8">
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-500">Why GENERAL</p>
            <h3 className="mb-4 text-2xl uppercase tracking-[0.14em] text-zinc-900">Built as a modern clothing brand</h3>
            <p className="mb-6 text-sm leading-7 text-zinc-600">
              We craft trend-forward and timeless pieces with premium fabrics, standout cuts, and comfort-first construction to elevate your everyday wardrobe.
            </p>
            <Link href="/shop" className="inline-block border border-zinc-900 px-6 py-2 text-xs uppercase tracking-[0.2em] text-zinc-900 transition hover:bg-zinc-900 hover:text-white">
              Shop now
            </Link>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-zinc-900 p-8 text-white">
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-300">Newsletter</p>
            <h3 className="mb-4 text-2xl uppercase tracking-[0.14em]">Get style updates & early access</h3>
            <p className="mb-6 text-sm leading-7 text-zinc-300">
              Be first to know about new drops, seasonal edits, and members-only offers.
            </p>
            <form className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-md border border-white/25 bg-white/10 px-4 py-2 text-sm placeholder:text-zinc-300 focus:border-white focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-md bg-white px-5 py-2 text-xs font-medium uppercase tracking-[0.15em] text-zinc-900 transition hover:bg-zinc-200"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
