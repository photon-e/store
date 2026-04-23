# MONO Commerce

Production-style clothing eCommerce web app built with **Next.js App Router + TypeScript + Tailwind + MongoDB + Stripe + JWT + Zustand**.

## Features

- Premium, responsive storefront UI (home, shop, product details)
- Product discovery: search, filter (category, size, max price), sorting, pagination
- Cart with persisted state (localStorage), subtotal/tax/total math
- Checkout flow with shipping form + Stripe Payment Intent API route
- Auth system (register/login) with JWT cookie sessions
- Protected routes via middleware (`/dashboard`, `/checkout`, `/admin`)
- User dashboard and admin dashboard pages
- Admin product management table scaffold + analytics cards
- Wishlist support (persisted in browser)
- Product reviews section + related products
- MongoDB models for products, users, orders, reviews, wishlists
- Order API with optional email confirmation via SMTP
- Cloudinary upload service helper
- Seed script with sample products
- Dark-mode capable Tailwind config (class strategy)

## Pages

- `/` Home
- `/shop`
- `/product/[id]`
- `/cart`
- `/checkout`
- `/login`, `/register`
- `/dashboard`
- `/admin`
- `/order-confirmation/[id]`

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET/POST /api/products`
- `GET/PUT/DELETE /api/products/[id]`
- `POST /api/checkout/create-payment-intent`
- `GET/POST /api/orders`

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy environment file:
   ```bash
   cp .env.example .env.local
   ```
3. Configure `.env.local` values (MongoDB, Stripe, JWT, SMTP, Cloudinary).
4. Seed sample data (optional):
   ```bash
   npm run seed
   ```
5. Run dev server:
   ```bash
   npm run dev
   ```

## Notes

- Checkout currently creates a Stripe Payment Intent and stores order data, but front-end card element UI is intentionally minimal to keep the project concise.
- Admin CRUD actions are scaffolded in UI and backed by product APIs; wire role-aware controls and forms for production deployment.
- Middleware enforces auth for protected routes and admin role checks for `/admin`.
