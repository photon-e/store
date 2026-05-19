# Store

Zara-inspired storefront demo built with Tailwind CSS and vanilla JavaScript on the frontend, with a Django + Django REST Framework backend under `backend/`.

## Current deployment status

- **Netlify:** Frontend deployment target (static/storefront hosting).
- **Vercel:** Frontend deployment target (Next.js-compatible hosting).
- **Backend:** Django API currently intended for local development setup in this repository.

> If you want, we can add exact live URLs for Netlify and Vercel once you share the active project links.

Open `index.html` in your browser.

## Django backend (new)

A starter Django backend now lives in `backend/`.

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
