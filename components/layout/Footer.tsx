export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50/80 py-12 text-zinc-600">
      <div className="container-page grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-zinc-900">MONO</p>
          <p className="max-w-md text-sm leading-6 text-zinc-500">
            Refined essentials built for daily comfort. Designed for modern wardrobes with quality,
            fit, and understated style in mind.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 text-xs">
            <a className="rounded-full border border-zinc-300 px-3 py-1.5 transition hover:border-zinc-900 hover:text-zinc-900" href="https://instagram.com" target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a className="rounded-full border border-zinc-300 px-3 py-1.5 transition hover:border-zinc-900 hover:text-zinc-900" href="https://x.com" target="_blank" rel="noreferrer">
              X / Twitter
            </a>
            <a className="rounded-full border border-zinc-300 px-3 py-1.5 transition hover:border-zinc-900 hover:text-zinc-900" href="https://linkedin.com" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-900">Customer Care</h3>
          <ul className="space-y-2 text-sm">
            <li>Shipping & Returns</li>
            <li>Size Guide</li>
            <li>FAQs</li>
            <li>Contact Support</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-900">Company</h3>
          <ul className="space-y-2 text-sm">
            <li>About Us</li>
            <li>Sustainability</li>
            <li>Careers</li>
            <li>Press Kit</li>
          </ul>
        </div>
      </div>

      <div className="container-page mt-10 border-t border-zinc-200 pt-6 text-xs uppercase tracking-[0.16em] text-zinc-500">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 MONO Commerce. All rights reserved.</p>
          <p>Secure checkout · Fast delivery · Easy returns</p>
        </div>
      </div>
    </footer>
  );
}
