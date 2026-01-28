# 🧾 README.md (UPDATED – Port 5000)

## 🚀 Server Setup

This project is a lightweight Pastebin-like backend built using Node.js, Express, and MongoDB.

## 🔧 Environment Variables

Create a `.env` file in the root directory and add the following:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.evc8wj9.mongodb.net/pastebin
BASE_URL=http://localhost:5000
TEST_MODE=0
```

⚠️ **In production (Render), `BASE_URL` should be set to the deployed service URL.**

## ▶️ Run Locally

Install dependencies:
```bash
npm install
```

Start the server:
```bash
npm run dev
```

The server will start on:
```
http://localhost:5000
```

## 🌐 Production Deployment (Render.com)

This app is deployed on **Render.com** for production hosting.

### Deployment Configuration

- Render automatically provides a `PORT` environment variable
- The app falls back to port 5000 for local development

```javascript
const PORT = process.env.PORT || 5000;
```

### Environment Variables on Render

In your Render dashboard, configure the following environment variables:

```
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.evc8wj9.mongodb.net/pastebin
BASE_URL=https://your-app-name.onrender.com
TEST_MODE=0
```

⚠️ **Important:** 
- Replace `BASE_URL` with your actual Render service URL
- Do NOT set `PORT` manually on Render (it's auto-provided)
- Keep `MONGO_URI` secure and use environment variables

### Deployment Steps

1. **Connect Repository:** Link your GitHub/GitLab repository to Render
2. **Build Command:** `npm install`
3. **Start Command:** `npm start` or `node server.js`
4. **Auto-Deploy:** Enable auto-deploy for automatic updates on git push

### Health Check Endpoint

Render can use the health check endpoint to monitor your service:

**GET** `/api/healthz`

```json
{
  "ok": true
}
```

## 🩺 Health Check

**GET** `/api/healthz`

Response:
```json
{
  "ok": true
}
```

## 📝 API Routes

### 1. Create a Paste

**POST** `/api/pastes`

Creates a new paste with optional expiration time and view limit.

**Payload example:**
```json
{
  "content": "Hello Pastebin",
  "ttl_seconds": 120,
  "max_views": 5
}
```

**Response:**
```json
{
  "id": "paste_id_here",
  "url": "http://localhost:5000/p/paste_id_here"
}
```

**Validation:**
- `content` is required and must be a non-empty string
- `ttl_seconds` (optional) must be a positive integer (expiration time in seconds)
- `max_views` (optional) must be a positive integer (maximum number of views allowed)

---

### 2. Fetch Paste (API)

**GET** `/api/pastes/:id`

Retrieves paste content via JSON API. Increments view count automatically.

**Response:**
```json
{
  "content": "Hello Pastebin",
  "remaining_views": 4,
  "expires_at": "2025-01-28T12:00:00.000Z"
}
```

**Notes:**
- Returns 404 if paste is expired or view limit exceeded
- `remaining_views` is `null` if no view limit was set
- `expires_at` is `null` if no TTL was set

---

### 3. View Paste (HTML)

**GET** `/p/:id`

Displays paste content as an HTML page. Increments view count automatically.

**Response:**
```html
<html>
  <body>
    <pre>Hello Pastebin</pre>
  </body>
</html>
```

**Notes:**
- Content is HTML-escaped to prevent XSS attacks
- Returns 404 if paste is expired or view limit exceeded
