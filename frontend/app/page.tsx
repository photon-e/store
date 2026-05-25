import Link from 'next/link';
import { sampleProducts } from '@/lib/sampleData';
import { ProductCard } from '@/components/product/ProductCard';


const featuredImageGrids = [
  [
    { src: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80', alt: 'Featured look 1' },
    { src: 'https://images.unsplash.com/photo-1464863979621-258859e62245?auto=format&fit=crop&w=900&q=80', alt: 'Featured look 2' },
    { src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80', alt: 'Featured look 3' },
    { src: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80', alt: 'Featured look 4' },
  ],
  [
    { src: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=80', alt: 'Featured look 5' },
    { src: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80', alt: 'Featured look 6' },
    { src: 'https://images.unsplash.com/photo-1551163943-3f7e29e93d81?auto=format&fit=crop&w=900&q=80', alt: 'Featured look 7' },
    { src: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80', alt: 'Featured look 8' },
  ],
];

export default function HomePage() {
  return (
    <div>
      <section className="relative">
        <img src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1900&q=80" alt="Hero" className="h-[60vh] w-full object-cover md:h-[75vh]" />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 container-page flex items-end pb-16">
          <div className="max-w-xl text-white">
            <p className="mb-3 text-xs uppercase tracking-[0.24em]">Lagos Edit 2026</p>
            <h1 className="mb-6 text-4xl font-light uppercase tracking-[0.16em] md:text-6xl">Premium Clothing for Everyday Style</h1>
            <Link href="/shop" className="inline-block border border-white px-7 py-3 text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-black">Explore Collection</Link>
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-2xl uppercase tracking-[0.2em]">Featured</h2>
          <Link href="/shop" className="text-xs uppercase tracking-[0.18em] text-zinc-500">View all</Link>
        </div>
        <div className="mb-10 space-y-6">
          {featuredImageGrids.map((grid, gridIndex) => (
            <div key={`featured-grid-${gridIndex}`} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {grid.map((image) => (
                <article key={image.alt} className="group surface-card overflow-hidden">
                  <div className="relative overflow-hidden bg-zinc-100">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="h-80 w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute bottom-4 left-4 bg-black/70 px-3 py-2 text-white">
                      <p className="text-base font-black uppercase tracking-[0.14em]">GENERAL</p>
                      <p className="text-xs tracking-[0.25em]">FEATURED</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ))}
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {sampleProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
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
