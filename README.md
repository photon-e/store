# Store

Zara-inspired storefront demo built with Tailwind CSS and vanilla JavaScript on the frontend, with a Django + Django REST Framework backend under `backend/`.

## Current deployment status

- **Netlify:** Frontend deployment target (static/storefront hosting).
- **Vercel:** Frontend deployment target (Next.js-compatible hosting).
- **Backend:** Django API currently intended for local development setup in this repository.

> If you want, we can add exact live URLs for Netlify and Vercel once you share the active project links.

## Local development environment installation guide

### 1) Prerequisites

Install the following tools:

- **Git**
- **Node.js 20+** and **npm** (for frontend)
- **Python 3.11+** and **pip** (for backend)

### 2) Clone and open the project

```bash
git clone <your-repo-url>
cd store
```

### 3) Frontend setup (root project)

```bash
npm install
npm run dev
```

Frontend runs at:

- `http://localhost:3000` (typical Next.js default)

### 4) Backend setup (Django API)

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Backend runs at:

- `http://127.0.0.1:8000`

### 5) Verify backend endpoints

Health check:

- `GET http://127.0.0.1:8000/api/health/`

Product APIs:

- `GET http://127.0.0.1:8000/api/products/`
- `GET http://127.0.0.1:8000/api/products/{id}/`

Cart APIs (authenticated):

- `GET http://127.0.0.1:8000/api/carts/`
- `POST http://127.0.0.1:8000/api/carts/`
- `POST http://127.0.0.1:8000/api/carts/{id}/add_item/`

## Project structure

- `backend/` — Django project (`store_backend`) and API app (`api`)
- `components/`, `lib/`, `public/` — frontend source/assets

## Notes

- SQLite is used by default for local backend development.
- Django admin is available at `/admin/` after creating a superuser.
- For production, move `SECRET_KEY` and debug/config values to environment variables.
