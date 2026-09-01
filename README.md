# Instant Mechanic — Live Operations Dashboard

A production-style full-stack operations dashboard for a vehicle service company. It includes live booking operations, analytics, mechanics, customers, a mechanic location map, authentication, role-aware APIs, CSV export, API docs, rate limiting, Docker, and automated test scaffolding.

## What is included
- Responsive React dashboard with desktop/tablet/mobile layouts
- Overview KPI cards: total/today/completed/pending/cancelled bookings, revenue, active mechanics, new customers
- Analytics: bookings over time, revenue over time, booking status, service category breakdown
- Bookings: search, status/category filters, sorting, pagination, detail view, status updates, CSV export
- Mechanics: availability, jobs completed, rating, current/last booking, detail page, live map
- Customers: search and customer activity/lifetime value
- Live updates with Socket.IO when booking status changes
- JWT authentication with Admin and Operations roles
- Express API + MongoDB with 650 realistic seeded bookings, 75 customers and 24 mechanics
- Swagger UI at `/api-docs`
- Helmet, CORS and API rate limiting
- Dockerfiles and docker-compose
- Test harness (`npm test`)

## Architecture
React/Vite UI → REST API + Socket.IO → Express/Node.js → MongoDB

## Tech stack
**Frontend:** React, Vite, React Router, Recharts, Leaflet, Socket.IO Client, Lucide icons, custom responsive CSS.

**Backend:** Node.js, Express, Mongoose, MongoDB, JWT, Socket.IO, Helmet, express-rate-limit, Swagger UI.

## Local setup
### 1. Database
Install MongoDB locally or create a MongoDB Atlas database.

### 2. Backend
```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev
```
API: `http://localhost:5000`
Swagger: `http://localhost:5000/api-docs`

Demo accounts:
- Admin: `admin@instantmechanic.demo` / `Admin@123`
- Operations: `ops@instantmechanic.demo` / `Admin@123`

### 3. Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
Open `http://localhost:5173`.

## Environment variables
### Backend
- `PORT` — API port
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — long random JWT signing secret
- `FRONTEND_URL` — deployed frontend origin

### Frontend
- `VITE_API_URL` — backend API base URL including `/api`
- `VITE_SOCKET_URL` — backend origin used by Socket.IO

## API
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/dashboard`
- `GET /api/bookings`
- `GET /api/bookings/:id`
- `PATCH /api/bookings/:id`
- `GET /api/bookings/export`
- `GET /api/mechanics`
- `GET /api/mechanics/:id`
- `GET /api/customers`
- `GET /health`
- `GET /api-docs`

## Deployment
### Frontend — Vercel
1. Push the `frontend` directory to GitHub (or use the monorepo root with Vercel Root Directory = `frontend`).
2. Build command: `npm run build`.
3. Output directory: `dist`.
4. Add `VITE_API_URL=https://YOUR-AWS-API/api` and `VITE_SOCKET_URL=https://YOUR-AWS-API`.
5. Deploy.

### Backend — AWS
The assignment requests AWS for the backend. A straightforward option is EC2:
1. Create an Ubuntu EC2 instance.
2. Install Node.js 22 and Git.
3. Install/configure MongoDB Atlas (recommended) and allow the EC2 IP in Atlas network access.
4. Clone the repo and run `cd backend && npm install --omit=dev`.
5. Create `.env` with production values.
6. Run with a process manager such as PM2: `pm2 start src/server.js --name instant-mechanic-api`.
7. Put Nginx in front of the API and enable HTTPS with Certbot.
8. Set the Vercel environment variables to the HTTPS API URL.

Socket.IO needs WebSocket upgrade support in Nginx. Keep `/socket.io/` proxied with HTTP/1.1 upgrade headers.

## Docker
For a local all-in-one environment:
```bash
docker compose up --build
```

## Testing
```bash
cd backend
npm test
```

## AI usage
AI tools can be used under the assignment rules. For the submission, document the actual tools you used, what they generated, and what you personally reviewed/modified. Do not claim tools or manual work you did not perform.

## Production notes
- Replace demo credentials immediately.
- Use a strong JWT secret.
- Restrict CORS to the deployed Vercel origin.
- Use MongoDB Atlas with a dedicated database user and least-privilege access.
- Put the API behind HTTPS and a reverse proxy.
- For a larger workload, add Redis-backed rate limiting/caching and structured logging.
