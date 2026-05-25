# Store

Zara-inspired storefront demo with a **Next.js frontend** and a **Django REST backend** (`backend/`).

## Tech stack
- Frontend: Next.js + Tailwind CSS
- Backend: Django + Django REST Framework
- Default local DB: SQLite

## 1) Local development (frontend + backend)

### Prerequisites
- Node.js 20+
- npm 10+
- Python 3.10+
- Git

Check versions:

```bash
node -v
npm -v
python3 --version
git --version
```

### Start frontend
From repository root:

```bash
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`.

### Start backend
From repository root:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Backend runs at `http://127.0.0.1:8000`.

Useful endpoints:
- Health: `GET /api/health/`
- Products: `GET /api/products/`
- Product filters metadata: `GET /api/products/filters/`

### Recommended local workflow
Use two terminals:
- Terminal A: frontend (`npm run dev`)
- Terminal B: backend (`python manage.py runserver`)

## 2) Production-oriented Django settings
Before deployment, update `backend/store_backend/settings.py`:
- `DEBUG = False`
- strong `SECRET_KEY`
- `ALLOWED_HOSTS` includes your PythonAnywhere domain
- configure CSRF/CORS trusted origins for your frontend domain(s)

Example `ALLOWED_HOSTS` entries:
- `<username>.pythonanywhere.com`
- your frontend host(s), e.g. Vercel/Netlify custom domain

## 3) Deploy backend on PythonAnywhere

### A. Create app and install dependencies
In a PythonAnywhere Bash console:

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

### B. Create web app
1. PythonAnywhere dashboard → **Web** → **Add a new web app**
2. Choose **Manual configuration** and Python 3.10+
3. Virtualenv path: `~/store/backend/.venv`

### C. Configure WSGI
Edit the PythonAnywhere WSGI file and ensure project path is configured:

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

### D. Reload and verify
- Reload the web app from PythonAnywhere Web tab
- Verify `https://<username>.pythonanywhere.com/api/health/`

## 4) Deploy frontend (Vercel recommended)

1. Push repo to Git provider
2. Import into Vercel
3. Build command: `npm run build` (usually auto-detected)
4. Set frontend environment variable(s) to your backend URL
5. Deploy and test API-backed pages

## 5) Troubleshooting
- `ModuleNotFoundError`: activate the correct virtualenv and reinstall requirements
- Host/CSRF errors: verify host/origin entries exactly match deployed URLs
- API connection issues: verify HTTPS URL and backend availability
- Missing static files on PythonAnywhere: rerun `collectstatic` and static mapping
