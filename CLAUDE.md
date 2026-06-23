# 3D Printing as a Service — DEWA Internal Platform

## Project Overview

An internal platform for DEWA employees to browse a catalog of 3D-printable
models, configure a print request (color, pickup location), and submit it for
fulfillment — no employee login required. Admins log in to manage the catalog
and process incoming requests.

**Two sides, one shared catalog + request queue:**
- **Customer side** — public (no login). Browse/search catalog → view model
  detail (3D preview, color, pickup, est. print time) → submit request form.
- **Admin side** — login required. Dashboard (demand analytics) → catalog
  management (CRUD + file uploads) → request queue (view/update status).

---

## Phase Tracker

Work through these one at a time. Update the checkbox when a phase is done,
and add a one-line note on what was actually built/changed so future sessions
have context.

- [x] **Phase 1 — Scaffold + design system**
      Next.js 16 (App Router) + Tailwind v4. Custom teal/amber palette via
      @theme, Sora display + Inter body fonts, CSS 3D wireframe-cube logomark,
      blueprint dot-grid utility class, Header + Footer shell, placeholder
      homepage. Dev server runs on :3000.
- [x] **Phase 2 — Database + admin auth**
      @supabase/ssr + @supabase/supabase-js installed. schema.sql + seed.sql in
      supabase/. Browser/server clients in src/lib/supabase/. Middleware guards
      /admin/* → /admin/login. Admin login page + AdminNav (sign-out) + protected
      layout with server-side auth check.
      AUTH: fake credentials for this test platform — ADMIN_EMAIL + ADMIN_PASSWORD
      in .env.local, checked via httpOnly cookie in src/lib/admin-auth.ts.
      For production: replace the three functions in admin-auth.ts (signIn,
      signOut, getAdminSession) with @supabase/ssr calls; middleware and all
      admin routes stay unchanged.
- [x] **Phase 3 — Public catalog**
      /catalog route with full-page header, 3-col card grid, live search
      (title/description/tags), category filter pills (All + 5 categories),
      results count line, empty state with blueprint motif. Mock data in
      src/lib/mock-models.ts (9 models, 5 categories) — replace with Supabase
      queries in Phase 8. Cards link to /catalog/[id] (Phase 4).
- [x] **Phase 4 — Model detail page**
      /catalog/[id] with breadcrumb, 420px preview panel (placeholder when no
      GLB; <model-viewer> auto-wires when glb_file_url is set), colour swatch
      selector, 2×2 pickup location grid, est. print time badge, amber "Request
      this model" CTA. Selections passed as ?color=&location= URL params into
      Phase 5. notFound() for unknown ids. PICKUP_LOCATIONS added to
      mock-models.ts.
- [x] **Phase 5 — Request submission**
      /catalog/[id]/request reads ?color= & ?location= from Phase 4. Summary
      card shows model/colour/pickup/est. time. Form: name, phone (UAE regex),
      email, payroll_id + CSS-hidden honeypot. useActionState + server action
      in src/lib/actions/submit-request.ts — validates server-side, inserts to
      Supabase requests table (skipped gracefully when URL is placeholder),
      sends Resend HTML email to ADMIN_EMAIL (skipped when key is placeholder).
      Redirects to /confirmed on success. RESEND_API_KEY + RESEND_FROM added
      to .env.local. Minimal /confirmed stub built (Phase 6 enhances it).
- [x] **Phase 6 — Confirmation screen**
      /confirmed reads ?model=&pickup=&color= params set by the Phase 5 server
      action. Shows: animated teal check circle, personalised heading, summary
      chip (model/colour/pickup), 3-step "what happens next" list (queued →
      fabricated → ready for collection), "Browse more models" + "Back to home"
      CTAs. Degrades gracefully when visited directly without params.
- [x] **Phase 7 — Admin dashboard**
      recharts installed. getDashboardData() in src/lib/dashboard-data.ts:
      fetches from Supabase when configured, falls back to deterministic mock
      data (isMock flag). Four charts: AreaChart (30-day volume), PieChart
      donut (by status), horizontal BarChart (top 7 models), BarChart (by
      pickup location). Four KPI stat cards (new/in_progress/ready/completed
      with % of total). "Sample data" badge shown when Supabase not connected.
      Types extracted to src/lib/types.ts.
- [x] **Phase 8 — Admin catalog management**
      /admin/catalog — model list table (title, category, print time, colour
      swatches, GLB badge, Edit/Delete per row). /admin/catalog/new and
      /admin/catalog/[id]/edit — shared ModelForm client component (title,
      description, category, tags, print time, colour checkboxes, GLB upload,
      image upload). Server actions in src/lib/actions/admin-catalog.ts:
      createModel / updateModel / deleteModel — all use SUPABASE_SERVICE_ROLE_KEY
      (service-role client, bypasses RLS). Uploads go to "models" Storage bucket
      (glb/ and images/ prefixes). Graceful "not configured" error when env vars
      are placeholders. Mock list shown read-only with "Sample data" badge when
      Supabase not connected; Delete button hidden in mock mode.
      Add SUPABASE_SERVICE_ROLE_KEY to .env.local (placeholder added).
- [x] **Phase 9 — Admin request management**
      /admin/requests — RequestsTable client component. Filter pills (All + 4
      statuses with per-status counts). Table columns: Customer (name +
      payroll_id + relative time), Model, Colour · Pickup (with swatch), Status
      badge, Update status dropdown. Click any row to expand contact detail panel
      (phone, email, payroll_id, est. print time). Status update via
      updateRequestStatus server action (src/lib/actions/admin-requests.ts).
      Dropdown disabled in mock mode with tooltip. 6 mock requests in
      src/lib/mock-requests.ts covering all four statuses.
- [x] **Phase 10 — Polish + deploy**
      Global 404 page (src/app/not-found.tsx) — wireframe ? icon, "Page not
      found" heading, Browse catalog + Go home CTAs. Skeleton loading states:
      src/app/(public)/catalog/loading.tsx (card grid skeletons),
      src/app/admin/(protected)/loading.tsx (KPI card + chart skeletons).
      Pre-existing TS error fixed (tabIndex in style object in RequestForm.tsx).
      Build passes clean: 14 routes, 0 TS errors.
      DEPLOY: push repo to GitHub → import to vercel.com → add all .env.local
      vars as Vercel environment variables → deploy. No config file needed.
- [x] **Phase 11 — UX improvements**
      (1) Quantity selector: stepper (−/+, 1–10) added to ConfiguratorPanel;
      qty passed via URL param → RequestPage → RequestForm (shows in summary,
      updates estimated print time × qty); server action reads qty, multiplies
      estimated_print_time for DB insert, includes qty in admin email.
      (2) Square catalog cards: thumbnail changed from fixed height:160 to
      aspectRatio:1 so images/placeholders are always square.
      (3) Removed all "no login required" / "no account required" copy from the
      catalog page header, homepage hero, ConfiguratorPanel footer, and
      RequestForm footer.
      (4) Contact Us page: /contact with name/email/subject/message form;
      server action in src/lib/actions/contact.ts sends email via Resend to
      ADMIN_EMAIL; inline success state. "Contact" added to Header nav and
      Footer. middleware.ts renamed to proxy.ts (Next.js 16 requirement).
- [x] **Phase 12 — Bug fixes & visual polish**
      (1) Server Actions body size limit raised to 50 MB in next.config.ts
      (experimental.serverActions.bodySizeLimit) — fixes "Body exceeded 1 MB"
      error when uploading GLB/image files via the admin panel.
      (2) Transmitter Cradle category typo fixed: "workspace" → "Workspace" in
      mock-models.ts (was causing a duplicate filter pill and wrong icon).
      (3) Catalog card thumbnail background: light #F2F5F4 when a real image is
      present; dark #0F1D1B kept for no-image SVG placeholders. Applies in both
      CatalogGrid (card view) and ModelViewer (detail page GLB viewer).

---

## Tech Stack

- **Frontend**: Next.js (App Router) + Tailwind CSS
- **Backend/DB/Storage**: Supabase (Postgres, Storage for images/GLB files)
- **Auth**: Fake credentials for test platform (ADMIN_EMAIL + ADMIN_PASSWORD in
  `.env.local`, cookie-based via `src/lib/admin-auth.ts`). Production path:
  swap the three functions in `admin-auth.ts` for Supabase Auth calls —
  everything else (middleware, layouts, AdminNav) stays the same.
- **3D viewing**: `<model-viewer>` web component (rotate/zoom GLB files)
- **Email**: Resend, sending admin notifications to a regular external mailbox
- **Hosting**: Vercel

---

## Design Direction

Professional, trustworthy government-portal feel inspired by DEWA's own site:
clean teal/green primary palette, generous white space, clear typographic
hierarchy, card-based layouts. More creative than a typical utility portal —
push that through the 3D-printing identity itself:

- Interactive rotating 3D model previews as the visual centerpiece of the
  catalog (not flat icons)
- A warm accent color (amber/orange) used sparingly for CTAs and status badges
- Subtle blueprint/isometric/wireframe motifs for empty states and hero areas
- Keep transactional screens (forms, admin dashboard) restrained and
  data-dense; save the visual flair for browsing/discovery screens

The **Frontend Design** plugin should be active for all UI work — let it
establish purpose/audience/aesthetic before generating code rather than
overriding it with generic Tailwind defaults.

---

## Data Model

```
users (admins only)
  id, email, password_hash, role

models
  id, title, description, category, tags[], images[], glb_file_url,
  base_print_time_minutes, available_colors[], created_by, created_at

colors
  id, name, hex
  seed: Black, White, Grey

pickup_locations
  id, name
  seed: Al Sheraa, Hudaiba, Al Quoz, Al Ruwayyah

requests (standalone — no user_id, no login required to submit)
  id, model_id, color_id, pickup_location_id,
  customer_name, phone, email, payroll_id,
  status (new | in_progress | ready | completed),
  estimated_print_time, created_at
```

---

## Locked Decisions (don't re-litigate these)

- **No customer login.** Catalog and request form are public routes. Identity
  is captured per-submission (name/phone/email/payroll), not via account.
- **GLB only for 3D files.** No automated STL→GLB conversion pipeline in v1 —
  convert manually before uploading via admin panel.
- **Print time is admin-entered**, not calculated from slicing. A fixed
  `base_print_time_minutes` per model.
- **No request status lookup for employees in v1.** They submit and wait to
  be contacted by admin directly.
- **Admin notification email** goes to a regular external mailbox via Resend
  (not an internal Exchange/Graph integration).
- **Admin auth is fake credentials** for this test build (`src/lib/admin-auth.ts`).
  Production swap: replace `signIn`, `signOut`, `getAdminSession` in that file
  with `@supabase/ssr` equivalents. The middleware cookie name (`admin-session`)
  must be updated to match the Supabase session cookie name.

---

## Deferred to v2 (don't build now, just don't block them)

- Automated STL → GLB conversion on upload
- Real slicer-based print time estimation
- Employee status lookup (by email + payroll ID, or confirmation code)
- Microsoft Entra ID / Azure AD SSO if this later opens beyond a single
  internal network
- Cross-checking payroll ID against an HR directory
