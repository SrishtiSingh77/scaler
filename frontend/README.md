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

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
