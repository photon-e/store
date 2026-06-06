'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type HeroSlide = {
  image: string;
  alt: string;
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  href: string;
};

const slides: HeroSlide[] = [
  {
    image: '/images/caro1.png',
    alt: 'GENERAL clothing carousel campaign image 1',
    eyebrow: 'Lagos Edit 2026',
    title: 'Premium Clothing for Everyday Style',
    description: 'Signature GENERAL hoodies, refined layers, and street-ready essentials built around comfort.',
    cta: 'Explore Collection',
    href: '/shop',
  },
  {
    image: '/images/caro2.png',
    alt: 'GENERAL clothing carousel campaign image 2',
    eyebrow: 'New Drop',
    title: 'Statement Pieces in Monochrome',
    description: 'Minimal palettes, clean silhouettes, and elevated details for a sharp daily uniform.',
    cta: 'Shop New Arrivals',
    href: '/shop?category=new',
  },
  {
    image: '/images/caro3.png',
    alt: 'GENERAL clothing carousel campaign image 3',
    eyebrow: 'Members First',
    title: 'Essentials That Move With You',
    description: 'Premium fabrics and easy fits for training days, city nights, and everything between.',
    cta: 'View Essentials',
    href: '/shop?category=essentials',
  },
];

export function HeroCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => setActiveSlide(index);
  const goToPrevious = () => setActiveSlide((current) => (current - 1 + slides.length) % slides.length);
  const goToNext = () => setActiveSlide((current) => (current + 1) % slides.length);

  return (
    <section className="relative overflow-hidden bg-zinc-950" aria-label="Featured collections">
      <div className="relative h-[60vh] min-h-[520px] md:h-[75vh]">
        {slides.map((slide, index) => (
          <div
            key={slide.image}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${index === activeSlide ? 'opacity-100' : 'opacity-0'}`}
            aria-hidden={index !== activeSlide}
          >
            <img src={slide.image} alt={slide.alt} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/15" />
          </div>
        ))}

        <div className="absolute inset-0 container-page flex items-end pb-20 md:pb-24">
          <div className="max-w-2xl text-white">
            <p className="mb-3 text-xs uppercase tracking-[0.24em] text-zinc-200">{slides[activeSlide].eyebrow}</p>
            <h1 className="mb-5 text-4xl font-light uppercase tracking-[0.16em] md:text-6xl">{slides[activeSlide].title}</h1>
            <p className="mb-7 max-w-lg text-sm leading-7 text-zinc-200 md:text-base">{slides[activeSlide].description}</p>
            <Link href={slides[activeSlide].href} className="inline-block border border-white px-7 py-3 text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-black">
              {slides[activeSlide].cta}
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-3 md:bottom-10">
          {slides.map((slide, index) => (
            <button
              key={slide.title}
              type="button"
              className={`h-2.5 rounded-full transition-all ${index === activeSlide ? 'w-10 bg-white' : 'w-2.5 bg-white/45 hover:bg-white/75'}`}
              aria-label={`Show slide ${index + 1}`}
              aria-current={index === activeSlide}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>

        <button
          type="button"
          className="absolute left-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/25 text-2xl text-white hover:bg-white hover:text-zinc-950 md:flex"
          aria-label="Show previous slide"
          onClick={goToPrevious}
        >
          ‹
        </button>
        <button
          type="button"
          className="absolute right-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/25 text-2xl text-white hover:bg-white hover:text-zinc-950 md:flex"
          aria-label="Show next slide"
          onClick={goToNext}
        >
          ›
        </button>
      </div>
    </section>
  );
}
