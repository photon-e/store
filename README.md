# Store

This repository is organized as a full-stack monorepo with separate folders for the frontend and backend:

- `frontend/` → Next.js + Tailwind storefront
- `backend/` → Django + Django REST Framework API

## Project structure

```text
store/
  frontend/
  backend/
```

## Local development

### Prerequisites
- Node.js 20+
- npm 10+
- Python 3.10+
- Git

### Run frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:3000`

### Run backend (Django)

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Backend: `http://127.0.0.1:8000`

Useful backend endpoints:
- `GET /api/health/`
- `GET /api/products/`
- `GET /api/products/filters/`

### Recommended workflow
Use two terminals:
- Terminal A: `cd frontend && npm run dev`
- Terminal B: `cd backend && python manage.py runserver`

## Deploy backend on PythonAnywhere

### 1) Install and initialize

```bash
git clone <your-repo-url> ~/store
cd ~/store/backend
python3.10 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
```

### 2) Create web app
1. PythonAnywhere dashboard → **Web** → **Add a new web app**
2. Choose **Manual configuration** + Python 3.10+
3. Set virtualenv path to `~/store/backend/.venv`

### 3) Configure WSGI

```python
import os
import sys

path = '/home/<username>/store/backend'
if path not in sys.path:
    sys.path.append(path)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'store_backend.settings')

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
```

### 4) Production settings
In `backend/store_backend/settings.py`, set:
- `DEBUG = False`
- secure `SECRET_KEY`
- `ALLOWED_HOSTS` including `<username>.pythonanywhere.com`
- CSRF/CORS trusted origins including your frontend domain

## Deploy frontend (Vercel recommended)

```bash
cd frontend
npm run build
```

Then deploy from the `frontend/` directory in Vercel/Netlify and configure frontend environment variables to point at your backend URL.
