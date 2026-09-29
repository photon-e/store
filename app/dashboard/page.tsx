import Link from 'next/link';

const shortcuts = [
  {
    number: '01',
    title: 'Shop the collection',
    description: 'Explore considered pieces for everyday wear.',
    href: '/shop',
    action: 'Browse products',
  },
  {
    number: '02',
    title: 'Your basket',
    description: 'Review your picks and get ready to check out.',
    href: '/cart',
    action: 'View your cart',
  },
];

export default function DashboardPage() {
  return (
    <div className="container-page py-10 sm:py-16">
      <div className="mb-8 flex flex-col justify-between gap-6 border-b border-zinc-200 pb-8 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">GENERAL / Your account</p>
          <h1 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">Your space.</h1>
          <p className="mt-3 max-w-lg text-sm leading-6 text-zinc-600">Welcome back. Pick up where you left off or find something new for your everyday.</p>
        </div>
        <Link href="/shop" className="inline-flex w-fit items-center justify-center rounded-lg bg-zinc-950 px-5 py-3 text-xs uppercase tracking-[0.16em] text-white hover:bg-zinc-800">
          Explore the shop <span aria-hidden="true" className="ml-3">↗</span>
        </Link>
      </div>

      <section className="grid gap-4 sm:grid-cols-2" aria-label="Account shortcuts">
        {shortcuts.map((item) => (
          <Link key={item.number} href={item.href} className="group surface-card flex min-h-56 flex-col justify-between p-6 sm:p-8">
            <div className="flex items-start justify-between">
              <span className="text-xs tracking-[0.16em] text-zinc-500">{item.number}</span>
              <span aria-hidden="true" className="text-xl transition-transform group-hover:translate-x-1">↗</span>
            </div>
            <div className="mt-8">
              <h2 className="text-xl font-medium">{item.title}</h2>
              <p className="mt-2 text-sm text-zinc-600">{item.description}</p>
              <span className="mt-5 inline-block text-xs uppercase tracking-[0.15em] underline underline-offset-4">{item.action}</span>
            </div>
          </Link>
        ))}
      </section>

      <section className="mt-8 grid gap-4 rounded-2xl bg-amber-100 p-6 sm:grid-cols-[1fr_auto] sm:items-center sm:p-8">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">A little inspiration</p>
          <h2 className="mt-2 text-xl font-medium">Good pieces. No overthinking.</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-700">Find easy layers, everyday essentials, and new favourites in the latest collection.</p>
        </div>
        <Link href="/shop" className="mt-2 inline-flex w-fit items-center rounded-lg border border-zinc-900 px-4 py-3 text-xs uppercase tracking-[0.15em] hover:bg-zinc-950 hover:text-white sm:mt-0">Shop now</Link>
      </section>
    </div>
  );
}
