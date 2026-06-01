# Mono Commerce (GENERAL)

Modern ecommerce demo built with **Next.js (App Router)**, **React**, **TypeScript**, **Tailwind CSS**, **MongoDB (Mongoose)**, **JWT cookie auth**, and **Stripe**.

## Features

- **Storefront UI**: DB-backed home catalog, shop filters, product detail, cart, checkout flow
- **Cart & wishlist**: Client state via Zustand
- **Auth**: Register + login, JWT stored in an HTTP-only cookie
- **Backend APIs**: Next.js Route Handlers under `app/api/*`
- **Payments**: Stripe payment intent creation (server-side)
- **Email (optional)**: Order confirmation via Nodemailer
- **Media (optional)**: Cloudinary helper for uploads

## Tech stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **UI**: Tailwind CSS
- **DB**: MongoDB + Mongoose
- **Payments**: Stripe

## Getting started

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
copy .env.example .env
```

Minimum required to avoid runtime errors:

- `MONGODB_URI`
- `JWT_SECRET`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

Optional integrations:

- **Email**: `SMTP_*`
- **Cloudinary**: `CLOUDINARY_*`

### 3) Run the dev server

```bash
npm run dev
```

Open `http://localhost:3000`.

## Seeding sample data (optional)

This repo includes a small seed script to populate MongoDB with products:

```bash
npm run seed
```



## Troubleshooting production database errors

If the live site shows `Application error: a server-side exception has occurred`, check the deployment logs first. For catalog pages, the most common cause is a missing or invalid `MONGODB_URI`. On Netlify, set `MONGODB_URI` to a hosted Atlas connection string such as `mongodb+srv://USER:PASSWORD@HOST/mono-commerce?retryWrites=true&w=majority`, then redeploy the site. Also confirm Atlas Network Access allows the Netlify deployment to connect and that the database user's password has not been rotated.

## Adding products

Products are managed from the protected admin dashboard:

1. Register or promote an admin user in MongoDB (`role: "admin"`).
2. Log in with that admin account.
3. Open `/admin` and use the **Add Product** form.

The form posts to `POST /api/products`, which requires a valid admin JWT cookie. Required product fields are name, slug, description, category, price in naira, and stock. Sizes, colors, and images can be entered as comma-separated values.

## Scripts

- `npm run dev`: start Next.js in dev mode
- `npm run build`: production build
- `npm run start`: run the production build
- `npm run lint`: run Next.js lint
- `npm run seed`: seed MongoDB with sample products

## Project structure (high level)

- `app/`: pages and API routes (Route Handlers)
- `components/`: UI components
- `lib/`: shared utilities (db/auth/stripe/email)
- `models/`: Mongoose models
- `store/`: Zustand stores

## Notes

- Home, shop, and product detail pages read products from MongoDB; `lib/sampleData.ts` is retained for the seed script.
- The admin dashboard still uses demo metrics/products pending production admin work.
- `middleware.ts` protects `/dashboard`, `/admin`, and `/checkout` using the JWT cookie.
