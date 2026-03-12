## Backend (Calix)

### Tech stack
- **Runtime**: Node.js + Express
- **Language**: TypeScript
- **ORM**: Prisma
- **DB**: Neon Postgres

### Environment variables
Create a `.env` file in `backend/`:

```bash
DATABASE_URL="postgresql://<user>:<password>@<host>/<database>?sslmode=require"
PORT=4000
```

Use the **PostgreSQL connection string** from your Neon project as `DATABASE_URL`.

### Setup
```bash
cd backend
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Server will start on `http://localhost:4000`.

### Core endpoints

- **Health**
  - `GET /health`

- **Event types (admin, default owner)**
  - `GET /api/event-types`
  - `GET /api/event-types/people` – list “person” event types
  - `GET /api/event-types/events` – list non‑person event types
  - `GET /api/event-types/:id`
  - `POST /api/event-types`
  - `PUT /api/event-types/:id`
  - `DELETE /api/event-types/:id`

- **Availability (admin)**
  - `GET /api/availability/schedules`
  - `GET /api/availability/schedules/:id`
  - `POST /api/availability/schedules`
  - `PUT /api/availability/schedules/:id`
  - `DELETE /api/availability/schedules/:id`

- **Public booking**
  - `GET /api/public/event-types/:slug`
  - `GET /api/public/event-types/:slug/slots?date=YYYY-MM-DD`
  - `POST /api/public/event-types/:slug/book`

- **Bookings dashboard (admin)**
  - `GET /api/bookings?scope=upcoming|past|all`
  - `POST /api/bookings/:id/cancel`

### Seeded sample data

Running `npx prisma db seed` creates:

- **Default owner user**
  - `name`: `Default Owner`
  - `email`: `owner@example.com`
- **Default availability schedule**
  - `id`: `default-schedule`
  - `name`: `Weekdays 9-5`
  - `timezone`: `Asia/Kolkata`
  - Rules: Monday–Friday, 09:00–17:00
- **Event types**
  - `intro-call-30`
    - Title: `Intro Call (30 min)`
    - Description: `A short introduction meeting.`
    - Duration: `30` minutes
    - Attached to `default-schedule`
  - `deep-dive-60`
    - Title: `Deep Dive (60 min)`
    - Description: `A longer deep-dive session.`
    - Duration: `60` minutes
    - Attached to `default-schedule`
- **Bookings**
  - One **past** confirmed booking for `intro-call-30`
  - One **upcoming** confirmed booking for `intro-call-30`

### Postman/raw JSON examples

- **Create availability schedule** – `POST /api/availability/schedules`

```json
{
  "name": "Weekdays 9-5",
  "timezone": "Asia/Kolkata",
  "rules": [
    { "dayOfWeek": 1, "startTimeMinutes": 540, "endTimeMinutes": 1020 },
    { "dayOfWeek": 2, "startTimeMinutes": 540, "endTimeMinutes": 1020 },
    { "dayOfWeek": 3, "startTimeMinutes": 540, "endTimeMinutes": 1020 },
    { "dayOfWeek": 4, "startTimeMinutes": 540, "endTimeMinutes": 1020 },
    { "dayOfWeek": 5, "startTimeMinutes": 540, "endTimeMinutes": 1020 }
  ]
}
```

- **Update availability schedule** – `PUT /api/availability/schedules/:id`

```json
{
  "name": "Updated Weekdays 10-6",
  "timezone": "Asia/Kolkata",
  "rules": [
    { "dayOfWeek": 1, "startTimeMinutes": 600, "endTimeMinutes": 1080 },
    { "dayOfWeek": 2, "startTimeMinutes": 600, "endTimeMinutes": 1080 },
    { "dayOfWeek": 3, "startTimeMinutes": 600, "endTimeMinutes": 1080 },
    { "dayOfWeek": 4, "startTimeMinutes": 600, "endTimeMinutes": 1080 },
    { "dayOfWeek": 5, "startTimeMinutes": 600, "endTimeMinutes": 1080 }
  ]
}
```

- **Create event type** – `POST /api/event-types`
  - Use a `scheduleId` you got from the previous call.

```json
{
  "title": "Intro Call (30 min)",
  "description": "Short intro meeting",
  "durationMinutes": 30,
  "slug": "intro-call-30",
  "scheduleId": "<schedule-id-here>"
}
```

- **Update event type** – `PUT /api/event-types/:id`

```json
{
  "title": "Updated Intro Call",
  "description": "Updated description",
  "durationMinutes": 45,
  "slug": "intro-call-45",
  "scheduleId": "<schedule-id-here>"
}
```

- **Get available slots** – `GET /api/public/event-types/intro-call-30/slots?date=2026-03-15`
  - No body; just set query param `date`.

- **Create public booking** – `POST /api/public/event-types/intro-call-30/book`
  - `startTime` must be one of the slot ISO strings returned from the slots API.

```json
{
  "bookerName": "Alice Example",
  "bookerEmail": "alice@example.com",
  "startTime": "2026-03-15T04:30:00.000Z"
}
```

- **Cancel booking** – `POST /api/bookings/:id/cancel`
  - No raw body required.


