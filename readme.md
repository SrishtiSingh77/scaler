## Calix – Scheduling Platform (Cal.com Style)

This is a full‑stack scheduling/booking application inspired by Cal.com.  
It lets a default “owner” define availability and event types, and exposes a public booking flow for visitors.

### Tech stack

- **Frontend**: Next.js 16 (App Router), React 19
- **Styling**: Custom CSS (`globals.css`) with a Cal.com‑inspired UI
- **Backend**: Node.js + Express + TypeScript
- **Database/ORM**: Neon PostgreSQL + Prisma

### Features

- **Event types management**
  - Create, edit, delete event types (title, description, duration, slug)
  - Each event type gets a unique `/book/[slug]` public booking page
- **Availability**
  - Define weekday schedules with time ranges and a timezone
  - Multiple schedules supported; link schedules to event types
- **Public booking**
  - Calendar + available time slots based on schedules
  - Booking form collects name and email
  - Prevents double booking for the same time slot
- **Bookings dashboard**
  - View upcoming and past bookings
  - Cancel existing bookings

### Local development – quick start

#### 1. Clone and install

```bash
# from the repo root
cd backend
npm install

cd ../frontend
npm install
```

#### 2. Configure environment variables

Backend (`backend/.env`):

```bash
DATABASE_URL="postgresql://<user>:<password>@<host>/<database>?sslmode=require"
PORT=4000
```

Use the connection string from your Neon Postgres project.

Frontend (`frontend/.env`):

```bash
NEXT_PUBLIC_API_BASE_URL="http://localhost:4000"
# Optional: EmailJS keys if you use email features
NEXT_PUBLIC_EMAILJS_SERVICE_ID="<service_id>"
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID="<template_id>"
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY="<public_key>"
```

#### 3. Run database migrations + seed

```bash
cd backend
npx prisma migrate dev
npx prisma db seed
```

This creates the schema and seeds a default owner user plus sample data.

#### 4. Start backend and frontend

```bash
# in backend/
npm run dev   # http://localhost:4000

# in frontend/
npm run dev   # http://localhost:3000
```

Visit `http://localhost:3000` to use the app. The frontend talks to the backend via `NEXT_PUBLIC_API_BASE_URL`.

### Project structure

- `backend/` – Express API, Prisma schema, migrations and seed script  
  For more backend details, see [`backend/README.md`](backend/README.md).
- `frontend/` – Next.js app (landing page, people page, dashboard, booking flows)  
  For more frontend details, see [`frontend/README.md`](frontend/README.md).

### Assumptions

- There is a single “default owner” user (seeded) for the admin side (dashboard, availability, event types).
- Public booking pages are anonymous and do not require authentication.
- The app is optimized for local development against Neon Postgres; for production, configure a persistent DB and environment‑appropriate URLs.

