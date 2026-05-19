# Store

Zara-inspired storefront demo built with Tailwind CSS and vanilla JavaScript.

## Features

- Responsive hero and product listing layout
- Product search, category filter, and sort
- Add-to-cart flow with slide-out cart drawer
- Quantity controls and subtotal calculation

## Run locally

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
