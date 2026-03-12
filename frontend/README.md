## Frontend – Calix

This is the Next.js frontend for the Calix scheduling platform.  
It implements the Cal.com‑style UI: landing page, people chooser, event‑type cards, booking flows, and the admin dashboard.

### Tech stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **UI**: React 19 + custom CSS (`app/globals.css`)

### Key screens

- **Landing page** (`/`)
  - Marketing hero and feature overview
- **People / events listing**
  - Cards that link to specific event types and booking flows
- **Dashboard** (`/dashboard`)
  - Event types CRUD
  - Availability schedule management
  - Upcoming bookings list with cancel actions
- **Public booking pages** (`/book/[slug]`)
  - Date picker + available slots
  - Booking form for name/email

### Environment variables

Create `frontend/.env`:

```bash
NEXT_PUBLIC_API_BASE_URL="http://localhost:4000"

# Optional (only if using EmailJS features)
NEXT_PUBLIC_EMAILJS_SERVICE_ID="..."
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID="..."
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY="..."
```

`NEXT_PUBLIC_API_BASE_URL` must point to the backend Express server.

### Scripts

From `frontend/`:

```bash
npm run dev     # Start Next.js dev server on http://localhost:3000
npm run build   # Production build
npm run start   # Start production server (after build)
npm run lint    # Run ESLint
```

### Development notes

- The frontend is configured to call the backend with `fetch` via a small helper in `app/api-client.ts`, which disables caching (`cache: "no-store"`) so you always see fresh data from the API.
- To avoid slow first loads, make sure the backend is already running and Neon Postgres is awake before you hit the dashboard or events pages.
