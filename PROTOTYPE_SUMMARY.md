# TakuraBid — Prototype Summary

**Live:** https://takura-bid-six.vercel.app/ | **Stack:** Next.js 16 · TypeScript · Supabase · Tailwind CSS

---

## What It Is

A freight marketplace for Zimbabwe. Clients post loads, drivers bid, the client hires a driver, and the driver accepts the job. Both parties can message throughout the job.

---

## Pages

### Client
| Page | Purpose |
|:-----|:--------|
| `/client/dashboard` | Overview of active loads, recent bids, spending summary |
| `/client/post-load` | Form to create a new load posting |
| `/client/loads` | View all posted loads; review and accept bids; find drivers |
| `/client/chat` | Job-scoped messaging + direct messages with drivers |
| `/client/analytics` | Shipping cost trends, cargo breakdown, load frequency |
| `/client/profile` | Edit name, company, city, contact details |

### Driver
| Page | Purpose |
|:-----|:--------|
| `/driver/dashboard` | Active jobs, available loads, earnings snapshot |
| `/driver/loads` | Browse available loads and submit bids |
| `/driver/jobs` | Job timeline, route details, progress tracking |
| `/driver/chat` | Job-scoped messaging + direct messages with clients |
| `/driver/analytics` | Earnings, kilometres driven, acceptance rate, ranking |
| `/driver/profile` | Edit title, bio, specialisation, availability |

### Shared
- `/auth/login` — Email + password sign-in
- `/auth/signup` — Role selection (Client / Driver) + registration
- `/` — Public landing page

---

## Core Features

- **Load posting** — Title, cargo type, weight, route, budget, pickup/delivery dates, urgency, trip type
- **Bidding** — Drivers bid with a price and message; clients see all bids per load
- **Hire flow** — Client accepts a bid → job created (Pending) → driver accepts → job Active
- **Messaging** — Job-scoped chat between client and driver; direct messages between any two users
- **Driver marketplace** — Clients can browse all drivers by specialisation and rating
- **Analytics** — Separate dashboards for clients (cost analytics) and drivers (earnings analytics)
- **Notifications** — In-database notification rows created on bid, acceptance, and job events
- **Profile management** — Both roles can edit their public profile

---

## Database (Supabase PostgreSQL)

8 tables, RLS disabled, anon key access via explicit GRANTs.

| Table | Key Columns |
|:------|:------------|
| `users` | `role`, `email`, `name`, `availability`, `skill_tags`, `driver_ranking`, `total_earnings_usd` |
| `loads` | `status`, `cargo_type`, `trip_type`, `urgency`, `requirements[]`, `assigned_driver_id` |
| `bids` | `amount_usd`, `status` (Pending / Accepted / Rejected) |
| `jobs` | `status`, `progress_pct`, `rate_usd`, `started_at`, `completed_at` |
| `messages` | `job_id`, `sender_id`, `content` |
| `direct_messages` | `sender_id`, `recipient_id`, `content`, `read` |
| `notifications` | `user_id`, `title`, `body`, `type`, `read` |
| `reviews` | `job_id`, `reviewer_id`, `reviewee_id`, `rating` (0–5) |

Primary keys: `LOAD${Date.now()}` for loads, `JOB${Date.now()}` for jobs, `crypto.randomUUID()` for users.

---

## ML Pricing Model

- **Endpoint:** `POST /api/pricing/estimate`
- **Model:** GradientBoosting regression hosted on an external FastAPI service
- **Input:** origin city, destination city, cargo type, weight (tons), urgency
- **Output:** estimated fair price in USD
- **Purpose:** shown to drivers as a suggested bid amount when viewing a load
- **Fallback:** static distance lookup table (`src/lib/routes.ts`) covering 8 Zimbabwean cities

---

## Authentication

Custom cookie-based sessions — no Supabase Auth, no JWT. On login/signup, `user_id` is stored in `localStorage` and a `takura_user` cookie is set for server-side route handlers to read.

---

## Sample Data (pre-seeded)

- 10 drivers · 10 clients · 26 loads · 30 bids · 16 jobs · 20 reviews · messages · notifications
- All accounts use password `password123`
