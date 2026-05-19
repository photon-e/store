# Store

Zara-inspired storefront demo with:

- **Frontend:** Next.js + Tailwind CSS
- **Backend:** Django + Django REST Framework (`backend/`)

This guide focuses on making setup easy for:

1. local development,
2. deploying the backend to **PythonAnywhere**,
3. deploying the frontend to **Netlify** or **Vercel**.

---

## 1) Local development (recommended first)

### Prerequisites

Install these before starting:

- **Node.js 20+** and npm
- **Python 3.10+**
- **Git**

Check your versions:

```bash
node -v
npm -v
python3 --version
git --version
```

---

## 2) Run the frontend locally (Next.js)

From the repository root:

```bash
npm install
npm run dev
```

Open:

- `http://localhost:3000`

Optional production-mode check:

```bash
npm run build
npm start
```

---

## 3) Run the backend locally (Django)

From the repository root:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Backend will be available at:

- `http://127.0.0.1:8000`

Health endpoint:

- `GET http://127.0.0.1:8000/api/health/`

### Local workflow tip

Use two terminals:

- Terminal A: run frontend (`npm run dev`)
- Terminal B: run backend (`python manage.py runserver`)

---

## 4) Deploy backend on PythonAnywhere

> Goal: host only the Django backend on PythonAnywhere.

### Step A - Create app + virtualenv

1. Create a PythonAnywhere account and open a **Bash console**.
2. Clone this repo:

```bash
git clone <your-repo-url> ~/store
cd ~/store/backend
```

3. Create and activate a virtualenv:

```bash
python3.10 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

4. Initialize DB:

```bash
python manage.py migrate
```

### Step B - Configure Django settings for production

Update `backend/store_backend/settings.py` before production use:

- set `DEBUG = False`,
- set a strong `SECRET_KEY`,
- set `ALLOWED_HOSTS` to include your PythonAnywhere domain,
- (recommended) configure CORS/CSRF trusted origins for your frontend domain(s).

Example host values to allow:

- `<yourusername>.pythonanywhere.com`
- your Netlify/Vercel frontend domain(s)

### Step C - Configure PythonAnywhere web app

1. In PythonAnywhere dashboard, create a **new web app** (manual config, Python 3.10+).
2. Set virtualenv path to `~/store/backend/.venv`.
3. Edit WSGI file to point to Django project path and app object (`store_backend.wsgi.application`).
4. Reload the web app.

### Step D - Static files

Collect static files once your production settings are ready:

```bash
cd ~/store/backend
source .venv/bin/activate
python manage.py collectstatic --noinput
```

Then configure static mapping in PythonAnywhere Web tab if needed.

---

## 5) Deploy frontend on Vercel

> Best fit for Next.js.

1. Push your repo to GitHub/GitLab/Bitbucket.
2. Import project in Vercel.
3. Build settings (usually auto-detected):
   - Build command: `npm run build`
   - Output: Next.js default
4. Add environment variables (if your app uses API URL config).
5. Deploy.

After deploy, point frontend API calls to your PythonAnywhere backend URL.

---

## 6) Deploy frontend on Netlify

> Netlify works, but Next.js deployments may require adapter/runtime configuration depending on features used.

1. Import repo in Netlify.
2. Use build command:

```bash
npm run build
```

3. Publish directory depends on your Netlify Next.js setup (plugin/runtime).
4. Add environment variables for backend API URL.
5. Deploy and verify pages/API usage.

If you use advanced Next.js server features, Vercel is typically the smoothest deployment path.

---

## 7) Connect frontend + backend in production

After both are deployed:

1. Set frontend API base URL to your PythonAnywhere backend domain.
2. Allow frontend domains in backend security settings (`ALLOWED_HOSTS`, and CORS/CSRF config if enabled).
3. Test from deployed frontend:
   - page load
   - API-backed views
   - `GET /api/health/`

---

## 8) Common troubleshooting

- **`ModuleNotFoundError` on PythonAnywhere:** confirm virtualenv path and reinstall `requirements.txt`.
- **400/403 host errors:** verify `ALLOWED_HOSTS` and trusted origins include exact deployed domains.
- **Frontend can’t reach backend:** confirm correct backend URL and HTTPS usage.
- **Static assets missing (backend):** run `collectstatic` and verify static mapping.

---

## Current deployment intent

- **Backend host:** PythonAnywhere
- **Frontend host:** Netlify or Vercel
