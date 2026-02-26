# TakuraBid — Outstanding Work & Completion Roadmap

**Repository:** [https://github.com/Nqobileee/Takura-Bid](https://github.com/Nqobileee/Takura-Bid)
**Production:** [https://takura-bid-six.vercel.app/](https://takura-bid-six.vercel.app/)
**Last Updated:** 2026-02-26

This document is a technical audit of everything that remains to be implemented, fixed, or hardened before TakuraBid can be considered production-ready. Items are organised by domain and prioritised within each section.

---

## Table of Contents

1. [Security & Authentication](#1-security--authentication)
2. [Database & Schema](#2-database--schema)
3. [Admin Panel](#3-admin-panel)
4. [AI / ML Features](#4-ai--ml-features)
5. [Real-Time Features](#5-real-time-features)
6. [Payment Processing](#6-payment-processing)
7. [Reviews & Ratings](#7-reviews--ratings)
8. [Job Progress Tracking](#8-job-progress-tracking)
9. [Invoicing & Document Generation](#9-invoicing--document-generation)
10. [Notifications](#10-notifications)
11. [Route Optimisation](#11-route-optimisation)
12. [Driver Credential Verification](#12-driver-credential-verification)
13. [Analytics](#13-analytics)
14. [File & Document Uploads](#14-file--document-uploads)
15. [Email & SMS Notifications](#15-email--sms-notifications)
16. [Mobile & Progressive Web App](#16-mobile--progressive-web-app)
17. [Production Readiness](#17-production-readiness)
18. [Summary Table](#18-summary-table)

---

## 1. Security & Authentication

### 1.1 Password Storage — CRITICAL

**Current state:** Passwords are stored in plaintext in the `users` table (`password` column). This is the most severe vulnerability in the application.

**What is needed:**
- Hash all passwords with `bcrypt` (cost factor ≥ 12) or `argon2id` at the time of registration and password change.
- On login, compare the submitted password against the stored hash using a constant-time comparison function.
- Migrate any existing plaintext passwords: prompt users to reset on next login, or run a one-time hash migration script.

**Files to modify:**
- `src/app/api/` — any route that writes or reads the `password` field
- `src/app/auth/` — signup and login page handlers
- Schema: the `password` column type can remain `TEXT` but must only ever contain a hash string

---

### 1.2 Row-Level Security (RLS)

**Current state:** RLS is **disabled** on all Supabase tables. Access control is enforced only at the application layer. Any database leak (exposed anon key, Supabase dashboard access) gives full read/write access to all tables.

**What is needed:**
- Enable RLS on every table in the Supabase dashboard.
- Write policies per table per operation. Minimum viable policies:

| Table | SELECT | INSERT | UPDATE | DELETE |
|:------|:-------|:-------|:-------|:-------|
| `users` | own row only | own row (signup) | own row | deny |
| `loads` | all (browse) | client only | own load | own load |
| `bids` | own bids / load owner | driver only | deny | own pending bid |
| `jobs` | involved parties | deny | involved parties | deny |
| `messages` | job participants | job participants | deny | deny |
| `direct_messages` | sender or recipient | authenticated | mark as read (own) | deny |
| `notifications` | own only | service role | own only | own only |
| `reviews` | all | post-job only | deny | deny |

- Update `supabase_schema.sql` with all RLS policies so they can be re-applied on schema reset.

---

### 1.3 Session Security

**Current state:** The `takura_user` cookie carries a raw UUID with no signature or expiry. An attacker who obtains any valid UUID can impersonate that user indefinitely.

**What is needed:**
- Sign the cookie value using HMAC-SHA256 with a server-side secret (`SESSION_SECRET` env var). Verify the signature on every request in `middleware.ts`.
- Set a cookie `Max-Age` or `Expires` header (e.g., 7 days) and enforce server-side session expiry by storing a `session_expires_at` timestamp.
- Set `HttpOnly=true` on the cookie so it cannot be read by client-side JavaScript (removes `document.cookie` access — requires refactoring `AuthProvider`).
- Set `Secure=true` on production.
- Implement a logout endpoint that clears the cookie server-side (`Set-Cookie: takura_user=; Max-Age=0`).

---

### 1.4 Input Validation & Sanitisation

**Current state:** API route handlers perform minimal type checking. No schema validation library is used.

**What is needed:**
- Integrate `zod` for request body validation on all `POST`/`PUT` route handlers.
- Validate all user-supplied strings for length limits.
- Sanitise any string that is displayed as HTML (XSS prevention) — currently the app uses React which escapes by default, but verify no `dangerouslySetInnerHTML` usage.
- Parameterise all Supabase queries (already the case with the SDK, but verify no raw SQL string interpolation exists).

---

### 1.5 Rate Limiting

**Current state:** No rate limiting exists on any API route.

**What is needed:**
- Apply rate limiting to authentication endpoints (`/api/auth/login`, `/api/auth/signup`) — maximum 10 attempts per IP per 15 minutes.
- Apply rate limiting to bid submission and message sending.
- Use Vercel Edge Middleware with an in-memory sliding window, or integrate Upstash Redis for distributed rate limiting.

---

### 1.6 Multi-Factor Authentication (MFA)

**Current state:** Not implemented.

**What is needed:**
- TOTP-based MFA (Google Authenticator compatible) as an optional feature for drivers with `payment_verified = true`.
- Store TOTP secret encrypted in the `users` table (`totp_secret` column).
- Implement enrolment flow (QR code generation) and verification middleware.

---

### 1.7 Audit Logging

**Current state:** No audit trail exists for sensitive operations.

**What is needed:**
- Create an `audit_logs` table: `(id UUID, user_id UUID, action TEXT, resource_type TEXT, resource_id TEXT, ip_address TEXT, created_at TIMESTAMPTZ)`.
- Log: login/logout, bid submission, bid acceptance, job status changes, profile edits, admin actions.
- Do not log message content — only metadata.

---

## 2. Database & Schema

### 2.1 Invoice Table

**Current state:** The `TakuraBid_SRS.md` specifies invoice download as a feature. No `invoices` table exists in the schema.

**What is needed — add to `supabase_schema.sql`:**

```sql
CREATE TABLE invoices (
  invoice_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id       TEXT REFERENCES jobs(job_id),
  client_id    UUID REFERENCES users(user_id),
  driver_id    UUID REFERENCES users(user_id),
  amount_usd   NUMERIC(10,2) NOT NULL,
  currency     TEXT NOT NULL DEFAULT 'USD',
  status       TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft','Issued','Paid','Void')),
  issued_at    TIMESTAMPTZ,
  paid_at      TIMESTAMPTZ,
  pdf_url      TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ON invoices(job_id);
CREATE INDEX ON invoices(client_id);
CREATE INDEX ON invoices(driver_id);
```

---

### 2.2 Session / Token Table

**Current state:** Sessions are managed purely via cookie with no server-side record.

**What is needed:**

```sql
CREATE TABLE sessions (
  session_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES users(user_id) ON DELETE CASCADE,
  token_hash   TEXT NOT NULL UNIQUE,
  ip_address   TEXT,
  user_agent   TEXT,
  expires_at   TIMESTAMPTZ NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ON sessions(user_id);
CREATE INDEX ON sessions(expires_at);
```

---

### 2.3 Schema Fields Present in DB but Missing from UI

The following columns exist in the database but are not surfaced or used in any frontend page or API route:

| Table | Column | Status |
|:------|:-------|:-------|
| `users` | `availability_status` | DB exists, no UI toggle |
| `users` | `skill_tags[]` | DB exists, profile form does not allow editing |
| `users` | `payment_verified` | DB exists, no verification flow |
| `users` | `driver_ranking` | DB exists, no calculation or display |
| `users` | `total_earnings` | DB exists, not updated when job completes |
| `jobs` | `progress_percent` | DB exists, no update mechanism or progress bar |
| `jobs` | `started_at` | DB exists, not set when driver accepts job |
| `jobs` | `completed_at` | DB exists, not set when job is marked complete |
| `loads` | `trip_type` | DB exists, not included in post-load form |
| `loads` | `description` | DB exists, may not be in post-load form |

Each of these requires:
1. A UI element to display or edit the value.
2. An API route (or extension of an existing route) to read/write the value.
3. Business logic to trigger updates automatically where appropriate (e.g., `total_earnings` incremented on job completion).

---

### 2.4 Missing Indexes

Review query patterns and add indexes for:
- `bids(load_id)` — frequently filtered
- `bids(driver_id)` — frequently filtered
- `messages(job_id)` — frequently filtered, ordered by `created_at`
- `direct_messages(sender_id, recipient_id)` — conversation lookup
- `notifications(user_id, read)` — unread count queries
- `jobs(driver_id)` — driver job list
- `jobs(status)` — status filtering

---

### 2.5 Data Integrity Constraints

**What is needed:**
- Add CHECK constraints: `bids.amount_usd > 0`, `jobs.progress_percent BETWEEN 0 AND 100`, `reviews.rating BETWEEN 1 AND 5`.
- Add NOT NULL constraints where currently absent but logically required.
- Add a UNIQUE constraint on `jobs(load_id)` — one job per load.
- Enforce `bids.status` enum at DB level: `CHECK (status IN ('Pending','Accepted','Rejected'))`.

---

## 3. Admin Panel

**Current state:** No admin panel exists. No admin role exists in the schema.

**What is needed:**

### 3.1 Admin Role

- Add `'Admin'` as a valid value for `users.role`.
- Create a protected `/admin` route group that checks `user.role === 'Admin'` in middleware.
- Seed at least one admin user in `supabase_schema.sql`.

### 3.2 Admin Dashboard Pages

| Page | Functionality |
|:-----|:--------------|
| `/admin/dashboard` | Platform KPIs: total users, active loads, jobs in progress, revenue (simulated), new signups today |
| `/admin/users` | Searchable/filterable user table; view, suspend, delete users; toggle `payment_verified`; view role |
| `/admin/loads` | All loads with status; ability to remove flagged loads |
| `/admin/jobs` | All active/completed jobs; dispute flag visibility |
| `/admin/bids` | All bids across the platform |
| `/admin/reviews` | Moderation queue for flagged reviews |
| `/admin/notifications` | Send platform-wide announcements |
| `/admin/analytics` | Platform-level aggregate analytics |

### 3.3 Admin API Routes

All admin routes must be under `/api/admin/` and gated by `user.role === 'Admin'` check.

```
GET  /api/admin/users          — paginated user list with filters
GET  /api/admin/users/[id]     — user detail
PUT  /api/admin/users/[id]     — update role, suspend, verify payment
GET  /api/admin/loads          — all loads
DELETE /api/admin/loads/[id]   — remove load
GET  /api/admin/analytics      — platform aggregate metrics
POST /api/admin/notifications  — broadcast notification
```

---

## 4. AI / ML Features

### 4.1 ML Pricing API Integration — Partially Implemented

**Current state:** `POST /api/pricing/estimate` exists and calls an external FastAPI service running a GradientBoosting model. However:
- The FastAPI service URL is hardcoded and may not be deployed to a stable endpoint.
- There is no fallback when the ML service is unavailable.
- The pricing estimate is not surfaced prominently in the bid submission UI.

**What is needed:**
- Deploy the FastAPI ML service to a permanent URL (Railway, Render, or Vercel Serverless with Python runtime).
- Add `ML_API_URL` as an environment variable; never hardcode the URL.
- Implement a fallback pricing formula (distance × base rate per km) when the ML API is unreachable.
- Display the ML-estimated price on the bid form as a suggested amount with an explanation.

---

### 4.2 Smart Driver-Load Matching — Not Implemented

**Current state:** The SRS specifies an AI smart matching algorithm that surfaces relevant loads to drivers based on their `skill_tags`, `driver_ranking`, `availability_status`, and the load's `cargo_type`. No such algorithm exists in the codebase. The available loads page (`/api/loads/available`) returns all loads unfiltered.

**What is needed:**

**Scoring algorithm (server-side, `src/lib/matching.ts`):**

```typescript
interface MatchScore {
  load_id: string
  score: number  // 0–100
  reasons: string[]
}

function scoreLoadForDriver(load: Load, driver: User): MatchScore {
  let score = 0
  const reasons: string[] = []

  // Skill tag overlap
  const overlap = load.requirements.filter(r => driver.skill_tags.includes(r))
  score += (overlap.length / Math.max(load.requirements.length, 1)) * 40
  if (overlap.length > 0) reasons.push(`${overlap.length} matching skill(s)`)

  // Driver ranking bonus
  score += Math.min(driver.driver_ranking / 5, 1) * 30
  if (driver.driver_ranking >= 4) reasons.push('Highly rated driver')

  // Availability
  if (driver.availability_status === 'Available') {
    score += 20
    reasons.push('Currently available')
  }

  // Urgency match
  if (load.urgency === 'High') score += 10

  return { load_id: load.load_id, score, reasons }
}
```

- Sort `GET /api/loads/available` results by match score when a driver is authenticated.
- Show match score percentage and reasons on each load card in `/driver/loads`.

---

### 4.3 Route Optimisation Enhancement

**Current state:** `src/lib/routes.ts` provides a static lookup table of distances between 8 Zimbabwean cities and pre-built route suggestions. There is no dynamic optimisation.

**What is needed:**
- Integrate the Google Maps Distance Matrix API or OpenRouteService API for live distance and duration calculations.
- Add `MAPS_API_KEY` to environment variables.
- For multi-stop loads (`trip_type = 'Multi-Stop'`), implement a nearest-neighbour TSP heuristic to suggest the most fuel-efficient stop sequence.
- Display the optimised route, estimated distance (km), estimated duration (hours), and estimated fuel cost on the job detail page.

---

## 5. Real-Time Features

### 5.1 Real-Time Messaging — Not Implemented

**Current state:** Both job messages (`/api/messages`) and direct messages (`/api/direct-messages`) are fetched by polling on a timer or on page load. There is no WebSocket or server-sent event channel. New messages only appear after a manual refresh or the next poll cycle.

**What is needed:**
- Subscribe to Supabase Realtime channels on the `messages` and `direct_messages` tables.
- In the chat page components, open a Realtime subscription on mount and append incoming messages to local state.

```typescript
// Example — job chat
const channel = supabase
  .channel(`job-messages-${jobId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'messages',
    filter: `job_id=eq.${jobId}`,
  }, (payload) => {
    setMessages(prev => [...prev, payload.new as Message])
  })
  .subscribe()

return () => { supabase.removeChannel(channel) }
```

- Enable Realtime on the `messages` and `direct_messages` tables in the Supabase dashboard.
- Remove the polling interval once Realtime is in place.

---

### 5.2 Real-Time Notifications — Not Implemented

**Current state:** The `notifications` table exists and rows are inserted by API routes (bid placed, bid accepted, etc.). However, there is no mechanism to push these notifications to the browser in real time. Users only see notifications if they refresh the page.

**What is needed:**
- Subscribe to `notifications` table changes filtered by `user_id` on every page load (in `DashboardLayout` or `AuthProvider`).
- Show an in-app notification toast when a new row arrives.
- Update the unread notification badge count in real time.

---

### 5.3 Live Job Progress Updates — Not Implemented

**Current state:** `jobs.progress_percent` exists but is never updated by any API route. There is no progress bar in the UI.

**What is needed:**
- `PUT /api/jobs/[jobId]/progress` — driver-only endpoint to update `progress_percent` (0–100) and optionally set `completed_at` when progress reaches 100.
- Subscribe to `jobs` table Realtime changes on the job detail page so both client and driver see the progress bar update live.
- Add a progress bar component to the job detail page for both roles.

---

## 6. Payment Processing

**Current state:** No payment processing exists. `agreed_rate_usd` is stored on the job but no money moves through the platform.

**What is needed:**

### 6.1 Payment Gateway Integration

- Integrate **Paynow Zimbabwe** for local ZWL and USD payments (primary market).
- Integrate **Stripe** as a secondary gateway for international payments.
- Install SDKs: `paynow-node` and `stripe`.

### 6.2 Payment Flow

```
1. Client accepts bid  → job created with status=Pending, amount held in escrow
2. Driver accepts job  → job becomes Active
3. Job marked complete → funds released to driver minus platform fee
4. Dispute raised      → funds held until resolved by admin
```

### 6.3 New API Routes Required

```
POST /api/payments/initiate      — client initiates payment for a job
GET  /api/payments/[jobId]       — payment status for a job
POST /api/payments/release       — admin or automatic release on completion
POST /api/payments/refund        — admin-initiated refund
```

### 6.4 Schema Additions

```sql
CREATE TABLE payments (
  payment_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id          TEXT REFERENCES jobs(job_id),
  payer_id        UUID REFERENCES users(user_id),
  payee_id        UUID REFERENCES users(user_id),
  amount_usd      NUMERIC(10,2) NOT NULL,
  platform_fee    NUMERIC(10,2) NOT NULL DEFAULT 0,
  net_amount      NUMERIC(10,2) NOT NULL,
  gateway         TEXT NOT NULL CHECK (gateway IN ('Paynow','Stripe')),
  gateway_ref     TEXT,
  status          TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending','Held','Released','Refunded','Failed')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  released_at     TIMESTAMPTZ
);
```

### 6.5 Platform Fee Logic

- Charge a configurable platform fee (e.g., 5%) on each completed job.
- Deduct fee before releasing funds to driver.
- Track platform revenue in admin analytics.

---

## 7. Reviews & Ratings

**Current state:** The `reviews` table exists with `job_id`, `reviewer_id`, `reviewee_id`, `rating` (1–5), and `comment` columns. No API route, no UI component, and no trigger to prompt review after job completion exist.

**What is needed:**

### 7.1 API Routes

```
POST /api/reviews          — submit a review (requires completed job, one review per party per job)
GET  /api/reviews/[userId] — get all reviews for a user with average rating
```

### 7.2 UI Components

- After a job reaches `status = 'Completed'`, show a review prompt modal to both client and driver.
- Display average star rating and review count on driver profile cards (visible to clients on the Find Drivers page).
- Show review history on the driver's own profile page.

### 7.3 Driver Ranking Calculation

The `users.driver_ranking` column should be automatically updated when a new review is submitted:

```sql
-- Trigger to update driver_ranking on review insert
CREATE OR REPLACE FUNCTION update_driver_ranking()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users
  SET driver_ranking = (
    SELECT AVG(rating)::NUMERIC(3,2)
    FROM reviews
    WHERE reviewee_id = NEW.reviewee_id
  )
  WHERE user_id = NEW.reviewee_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_driver_ranking
AFTER INSERT OR UPDATE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_driver_ranking();
```

---

## 8. Job Progress Tracking

**Current state:** `jobs.progress_percent` column exists but is never read or written by any application code.

**What is needed:**

### 8.1 Driver Update Flow

- Add a progress update control to the driver job detail page: a slider or step buttons (0%, 25%, 50%, 75%, 100%).
- On change, call `PUT /api/jobs/[jobId]/progress` with `{ progress_percent: number }`.
- When `progress_percent` reaches 100, automatically set `jobs.status = 'Completed'` and `jobs.completed_at = now()`.
- Trigger `total_earnings` update on `users` table for the driver.

### 8.2 Client View

- Show a progress bar on the client job detail page with the current percentage.
- Show milestone labels: Pickup, In Transit, Delivery, Complete.
- Subscribe to Realtime updates so the bar moves without page reload.

### 8.3 GPS/Location Tracking (Future)

- Store driver GPS coordinates periodically in a `location_updates` table.
- Display driver location on a map embed (Google Maps / Leaflet) on the client job page.

---

## 9. Invoicing & Document Generation

**Current state:** No invoice system exists. The SRS specifies that both clients and drivers should be able to download a PDF invoice after job completion.

**What is needed:**

### 9.1 PDF Generation

- Use `@react-pdf/renderer` or `puppeteer` to generate PDF invoices server-side.
- Invoice must include: invoice number, date, client details, driver details, load description, route, agreed rate, platform fee, net amount, payment reference.

### 9.2 Storage

- Upload generated PDF to Supabase Storage bucket (`invoices/`).
- Store the public URL in `invoices.pdf_url`.
- Bucket must have appropriate access policy (authenticated users can read their own invoices only).

### 9.3 API Routes

```
POST /api/invoices/[jobId]/generate — generate and store PDF, create invoices row
GET  /api/invoices/[jobId]          — return invoice record with pdf_url
```

### 9.4 UI

- Add "Download Invoice" button to job detail page for completed jobs.
- Button visible to both client and driver.

---

## 10. Notifications

**Current state:** The `notifications` table exists and rows are inserted by several API routes. However:
- Notifications are not fetched or displayed anywhere in the UI.
- There is no notification bell or badge in the dashboard header.
- There is no real-time delivery.

**What is needed:**

### 10.1 API Routes

```
GET  /api/notifications            — get all notifications for current user
PUT  /api/notifications/[id]/read  — mark single notification as read
PUT  /api/notifications/read-all   — mark all as read
```

### 10.2 UI Components

- Notification bell icon in `DashboardLayout` header with unread count badge.
- Dropdown panel showing the 10 most recent notifications with read/unread state.
- Click on notification navigates to relevant resource (`reference_id`).

### 10.3 Realtime Delivery

- Subscribe to `notifications` table Realtime events filtered by `user_id`.
- On new notification, increment badge count and show a toast.

---

## 11. Route Optimisation

**Current state:** `src/lib/routes.ts` provides a static distance lookup table for 8 Zimbabwean cities. Route suggestions are pre-built strings, not dynamically computed.

**What is needed:**

### 11.1 Dynamic Distance Calculation

- Replace static lookup with an API call to Google Maps Distance Matrix or OpenRouteService.
- Cache results in Supabase or Redis to avoid repeated API calls for the same city pairs.

### 11.2 Multi-Stop Optimisation

- For loads with `trip_type = 'Multi-Stop'`, accept an array of waypoints.
- Run nearest-neighbour or 2-opt TSP heuristic over the waypoints.
- Return optimised stop order, total distance, estimated duration, and estimated fuel cost.

### 11.3 UI Integration

- Show optimised route preview on the driver job page.
- Show turn-by-turn summary (city list in order).
- Show fuel savings vs. unoptimised order as a percentage.

---

## 12. Driver Credential Verification

**Current state:** `users.payment_verified` exists but no verification flow is implemented. Any user can register as a driver with no credential check.

**What is needed:**

### 12.1 Document Upload

- Drivers must upload: driver's licence, vehicle registration, insurance certificate, operator's licence.
- Store uploads in Supabase Storage bucket (`driver-docs/`) with private access.

### 12.2 Verification Workflow

- On document upload, set `users.payment_verified = false` and flag for admin review.
- Admin reviews documents in the admin panel and sets `payment_verified = true`.
- Verified drivers receive a "Verified" badge on their profile.
- Only verified drivers can bid on loads marked as requiring verification.

### 12.3 Schema Addition

```sql
CREATE TABLE driver_documents (
  doc_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id    UUID REFERENCES users(user_id) ON DELETE CASCADE,
  doc_type     TEXT NOT NULL CHECK (doc_type IN ('Licence','VehicleReg','Insurance','OperatorsLicence')),
  file_url     TEXT NOT NULL,
  verified     BOOLEAN NOT NULL DEFAULT false,
  reviewed_by  UUID REFERENCES users(user_id),
  reviewed_at  TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

## 13. Analytics

### 13.1 Hardcoded Values — Must Be Replaced

**Current state:** Both `GET /api/analytics/client` and `GET /api/analytics/driver` return hardcoded placeholder values for several metrics. These are not derived from real database records.

**What is needed:**
- Audit both analytics route handlers and identify every hardcoded constant.
- Replace each with a real Supabase query computing the value from actual data.

**Known hardcoded items:**
- Idle time vs. driving time ratio (driver analytics)
- Pay per mile calculation (driver analytics)
- Bid acceptance/decline donut chart data (driver analytics)
- Driver ranking percentile (driver analytics)
- Cost trend over time (client analytics)

### 13.2 Missing Analytics Features

| Metric | Required Calculation |
|:-------|:--------------------|
| Average bid response time | `AVG(bids.created_at - loads.created_at)` grouped by load |
| On-time delivery rate | jobs completed before estimated duration |
| Driver earnings by month | SUM(agreed_rate_usd) grouped by EXTRACT(month FROM completed_at) |
| Load posting frequency | COUNT(loads) grouped by week |
| Top routes | Most common origin-destination pairs |
| Platform revenue | SUM(platform_fee) from payments table |

---

## 14. File & Document Uploads

**Current state:** No file upload capability exists anywhere in the application.

**What is needed:**
- Configure a Supabase Storage bucket for each upload type: `driver-docs`, `invoices`, `load-attachments`, `profile-photos`.
- Create signed upload URLs server-side; never expose the service role key to the client.
- Add file size and MIME type validation server-side.
- Add profile photo upload to the profile edit page for both roles.
- Add load attachment upload (photos of goods, Bill of Lading) to the post-load form.

---

## 15. Email & SMS Notifications

**Current state:** No outbound communication exists. All notifications are in-app only.

**What is needed:**

### 15.1 Email (Resend or SendGrid)

Trigger emails for:
- Account registration (welcome email)
- Bid received (to client)
- Bid accepted (to driver)
- Job started (to client)
- Job completed (to both parties)
- Invoice available (to both parties)
- Payment received (to driver)

### 15.2 SMS (Twilio or Africa's Talking)

For the Zimbabwean market, SMS is often more reliable than email. Use Africa's Talking for local delivery:
- Bid accepted notification
- Job status change
- Payment received

### 15.3 Implementation

- Add `RESEND_API_KEY` / `AFRICAS_TALKING_API_KEY` to environment variables.
- Create `src/lib/email.ts` and `src/lib/sms.ts` utility modules.
- Call from relevant API routes after the primary DB operation succeeds.
- Use fire-and-forget pattern so notification failure does not block the response.

---

## 16. Mobile & Progressive Web App

**Current state:** The application is a standard web app. No PWA manifest, no service worker, no offline support.

**What is needed:**

### 16.1 PWA Setup

- Add `public/manifest.json` with app name, icons, theme colour, display mode `standalone`.
- Add `<link rel="manifest">` to the root layout.
- Register a service worker using Next.js `next-pwa` plugin or a custom Workbox configuration.
- Cache static assets and the shell layout for offline access.

### 16.2 Mobile UX

- Audit all pages for touch target sizes (minimum 44×44 px).
- Ensure the load board and dashboard are usable on a 375px wide screen.
- Add swipe-to-refresh gesture on the loads board.
- Test on Android Chrome and Safari iOS.

### 16.3 Push Notifications

- Register for Web Push using the Notifications API.
- Store `PushSubscription` objects in a `push_subscriptions` table.
- Send push notifications from the server using `web-push` library for the same events listed in Section 15.

---

## 17. Production Readiness

### 17.1 Error Monitoring

- Integrate Sentry (`@sentry/nextjs`) for client and server error tracking.
- Set `SENTRY_DSN` as an environment variable.
- Add a global error boundary component in the root layout.

### 17.2 Logging

- Add structured server-side logging using `pino` or `winston`.
- Log: API route access, auth events, bid/job lifecycle events, errors.
- Ship logs to a log aggregation service (Logtail, Datadog, or Vercel Log Drains).

### 17.3 Environment Variable Hardening

- Audit all `.env.local` references. Ensure no secret key is prefixed `NEXT_PUBLIC_` (public keys are bundled into client JavaScript).
- Add `SESSION_SECRET`, `ML_API_URL`, `MAPS_API_KEY`, `RESEND_API_KEY`, `STRIPE_SECRET_KEY`, `PAYNOW_INTEGRATION_ID`, `PAYNOW_INTEGRATION_KEY` to `.env.local.example`.

### 17.4 Build & Type Safety

- Run `npm run type-check` and resolve all TypeScript errors.
- Run `npm run lint` and resolve all ESLint warnings.
- All API route handlers must use `NextRequest` type with explicit return types (`Promise<NextResponse>`).

### 17.5 Testing

| Layer | Tool | Coverage Target |
|:------|:-----|:----------------|
| Unit | Jest + React Testing Library | Core utility functions, auth logic |
| Integration | Jest with Supabase test DB | All API route handlers |
| E2E | Playwright | Full bid-to-job-completion flow |

- Set up a separate Supabase project for the test environment.
- Add `npm run test` and `npm run test:e2e` scripts.
- Add a GitHub Actions CI workflow to run tests on every push to `main`.

### 17.6 Performance

- Add `loading.tsx` files to all route segments for streaming suspense.
- Add `generateMetadata()` to page components for SEO.
- Implement `next/image` for all image rendering.
- Add HTTP caching headers on read-only API routes (`Cache-Control: private, max-age=30`).

### 17.7 Database Connection Pooling

- Configure Supabase connection pooling (PgBouncer) for production to avoid connection exhaustion under load.
- Use the pooled connection string in production environment variables.

---

## 18. Summary Table

| # | Domain | Priority | Complexity | Status |
|:--|:-------|:---------|:-----------|:-------|
| 1.1 | Password hashing | CRITICAL | Low | Not done |
| 1.2 | Row-Level Security | CRITICAL | Medium | Not done |
| 1.3 | Session security (signing, expiry) | High | Medium | Not done |
| 1.4 | Input validation (Zod) | High | Medium | Not done |
| 1.5 | Rate limiting | High | Low | Not done |
| 1.6 | MFA | Low | High | Not done |
| 1.7 | Audit logging | Medium | Low | Not done |
| 2.1 | Invoice table | High | Low | Not done |
| 2.2 | Session table | Medium | Low | Not done |
| 2.3 | Wire up existing DB columns to UI | High | Medium | Not done |
| 2.4 | Missing indexes | Medium | Low | Not done |
| 2.5 | DB constraints | Medium | Low | Not done |
| 3 | Admin panel | High | High | Not done |
| 4.1 | ML pricing — stabilise & deploy | Medium | Medium | Partial |
| 4.2 | Smart driver matching algorithm | Medium | Medium | Not done |
| 4.3 | Route optimisation — dynamic | Low | High | Partial (static only) |
| 5.1 | Real-time messaging | High | Medium | Not done |
| 5.2 | Real-time notifications | High | Low | Not done |
| 5.3 | Live job progress updates | Medium | Medium | Not done |
| 6 | Payment processing | High | High | Not done |
| 7 | Reviews & ratings | High | Medium | Not done (table only) |
| 8 | Job progress tracking UI | High | Medium | Not done |
| 9 | Invoice PDF generation | Medium | Medium | Not done |
| 10 | Notification UI & bell | High | Medium | Not done |
| 11 | Route optimisation (dynamic) | Low | High | Not done |
| 12 | Driver credential verification | High | High | Not done |
| 13 | Analytics — real data | High | Medium | Partial (hardcoded) |
| 14 | File uploads | Medium | Medium | Not done |
| 15 | Email & SMS | Medium | Medium | Not done |
| 16 | PWA / mobile | Low | Medium | Not done |
| 17 | Production readiness (Sentry, CI, tests) | High | Medium | Not done |

---

*This document should be reviewed and updated as items are completed. Cross-reference with `TakuraBid_SRS.md` for full feature specifications and `DOCUMENTATION.md` for academic system documentation.*
