# Happy Monthsary 💕

A little anniversary site with a countdown, a flip-able letter, a photo gallery, and a guestbook — split into a proper frontend/backend, with guestbook notes saved to MySQL instead of the browser's local storage.

## Structure

```
monthsary-site/
├── frontend/               static site — open or host it anywhere
│   ├── index.html
│   ├── css/style.css
│   └── js/
│       ├── config.js       personalization + API_BASE_URL
│       └── app.js          page behavior + calls to the backend
└── backend/                 Node/Express API + MySQL
    ├── server.js
    ├── db.js
    ├── routes/notes.js
    ├── database/schema.sql
    ├── package.json
    ├── .env.example
    └── .gitignore
```

## 1. Create the database

You'll need a running MySQL server. From the project root:

```bash
mysql -u root -p < backend/database/schema.sql
```

This creates the `monthsary_db` database and a `notes` table.

## 2. Run the backend

```bash
cd backend
npm install
cp .env.example .env   # then fill in your real DB credentials
npm run dev             # or: npm start
```

The API listens on `http://localhost:3001` by default. Confirm it's up at `http://localhost:3001/api/health`.

## 3. Run the frontend

The frontend is plain HTML/CSS/JS — any static server works:

```bash
cd frontend
npx http-server .
```

(VS Code's "Live Server" extension or `python3 -m http.server` work too.) Avoid opening `index.html` directly via `file://` — some browsers block the page's `fetch` calls to the API from a `file://` page.

If your backend isn't running on `http://localhost:3001`, update `API_BASE_URL` in `frontend/js/config.js`.

## Personalizing

Everything you'd change for a new monthsary lives in `frontend/js/config.js`: the name, the month label, the "since" date, the letter text, and the gallery (paste a base64 data URL into a photo's `image` field, or leave it out for a placeholder tile).

## The guestbook

Notes submitted in "Leave Me a Little Note" are sent to `POST /api/notes` and stored in the `notes` table; the list is loaded from `GET /api/notes`. Nothing lives in the browser anymore, so every visitor — on any device — sees the same notes.

## Deploying

- **Backend + database**: any Node host (Railway, Render, Fly.io, a VPS...) plus a MySQL database (several of those hosts offer one directly, or use a managed service like PlanetScale).
- **Frontend**: any static host (Netlify, Vercel, GitHub Pages) — point `API_BASE_URL` at your deployed backend's URL, and make sure the backend's CORS setup allows that origin.
