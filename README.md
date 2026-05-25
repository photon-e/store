# Store

This repository is organized as a full-stack monorepo with separate folders:

- `frontend/` → Next.js + Tailwind storefront
- `backend/` → Django + Django REST Framework API

## Project structure

```text
store/
  frontend/
    app/
    components/
    lib/
    public/
    package.json
  backend/
    api/
    store_backend/
    manage.py
```

## If your PR shows a complex merge conflict

If your branch was created before the folder split, conflicts are expected because many frontend files were moved from repo root into `frontend/`.

Use this mapping when resolving conflicts locally:

- `app/*` → `frontend/app/*`
- `components/*` → `frontend/components/*`
- `lib/*` → `frontend/lib/*`
- `models/*` → `frontend/models/*`
- `public/*` → `frontend/public/*`
- `services/*` → `frontend/services/*`
- `store/*` → `frontend/store/*`
- `types/*` → `frontend/types/*`
- `scripts/*` → `frontend/scripts/*`
- `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.js`, `middleware.ts`, `next-env.d.ts`, `index.html` → now under `frontend/`

Recommended local conflict workflow:

```bash
git fetch origin
git checkout <your-branch>
git merge origin/main
# resolve conflicts using the mapping above
git add -A
git commit
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

## Deploy backend on PythonAnywhere

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

WSGI snippet:

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

In `backend/store_backend/settings.py`, set:
- `DEBUG = False`
- secure `SECRET_KEY`
- `ALLOWED_HOSTS` including `<username>.pythonanywhere.com`
- CSRF/CORS trusted origins including your frontend domain

## Deploy frontend

```bash
cd frontend
npm run build
```

Deploy from `frontend/` in Vercel/Netlify and set frontend environment variables to your backend URL.
