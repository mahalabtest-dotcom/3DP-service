# DEWA 3D Print Service

Internal platform for DEWA employees to browse a catalog of 3D-printable models, configure a print request (colour, pickup location, quantity), and submit for fulfillment — no employee login required.

## Stack

- **Next.js 16** (App Router) + **Tailwind CSS v4**
- **Supabase** — Postgres database + Storage (GLB & image uploads)
- **Resend** — admin email notifications
- **`<model-viewer>`** — interactive 3D GLB previews
- **Recharts** — admin analytics dashboard
- Hosted on **Vercel**

## Getting Started

```bash
npm install
npm run dev
```

Copy `.env.local.example` to `.env.local` and fill in your Supabase and Resend credentials before running.

## Project Structure

```
src/
  app/
    (public)/       — customer-facing routes (catalog, request, contact)
    admin/          — admin routes (login, dashboard, catalog, requests)
  components/
    catalog/        — public-facing UI components
    admin/          — admin UI components
  lib/
    actions/        — server actions (submit-request, admin-catalog, contact)
    supabase/       — browser & server Supabase clients
```

See `CLAUDE.md` for full phase-by-phase build notes and locked decisions.
