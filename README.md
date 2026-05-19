# Store

Zara-inspired storefront demo built with **Next.js + Tailwind CSS** for the frontend and **Django + Django REST Framework** for the backend under `backend/`.

## Current deployment status

- **Netlify:** Frontend deployment target (static/storefront hosting).
- **Vercel:** Frontend deployment target (Next.js-compatible hosting).
- **Backend:** Django API currently intended for local development setup in this repository.

> If you want, we can add exact live URLs for Netlify and Vercel once you share the active project links.

## Frontend (Next.js) - local development

Use these steps to run the frontend in a local environment:

```bash
npm install
npm run dev
```

Then open:

- `http://localhost:3000`

### Production preview locally (optional)

```bash
npm run build
npm start
```

## Django backend

A starter Django backend lives in `backend/`.

### Quick start

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py runserver
```

### First endpoint

- `GET /api/health/` returns backend health JSON.
