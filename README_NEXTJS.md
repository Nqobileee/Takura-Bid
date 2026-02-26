# TakuraBid — Next.js Developer Reference

**Production:** [https://takura-bid-six.vercel.app/](https://takura-bid-six.vercel.app/)
**Repository:** [https://github.com/Nqobileee/Takura-Bid](https://github.com/Nqobileee/Takura-Bid)

This file is a developer-focused reference for working with the Next.js 16 App Router codebase. For full project documentation, see [README.md](README.md) and [DOCUMENTATION.md](DOCUMENTATION.md).

---

## Tech Stack

| Layer | Technology | Version |
|:------|:-----------|:--------|
| Framework | Next.js App Router | 16.1.4 |
| UI Runtime | React | 19.2.3 |
| Language | TypeScript | 5.9.3 |
| Styling | Tailwind CSS | 3.4.19 |
| Database | Supabase PostgreSQL | Latest |
| Database Client | Supabase JS SDK | 2.97.0 |
| Deployment | Vercel | — |

---

## Quick Start

```bash
git clone https://github.com/Nqobileee/Takura-Bid.git
cd Takura-Bid
npm install
npm run dev
# Open http://localhost:3000
```

Copy `.env.local.example` to `.env.local` and populate with your Supabase project URL and anon key before running.

---

## Available Scripts

| Command | Description |
|:--------|:------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Compile and bundle for production |
| `npm run start` | Run the compiled production build locally |
| `npm run lint` | Run ESLint with Next.js rule configuration |
| `npm run type-check` | Run TypeScript compiler in check-only mode |

---

## Project Structure

```
src/
├── app/
│   ├── api/                         # All Route Handlers (server-only)
│   │   ├── analytics/client/        # Client KPI aggregation
│   │   ├── analytics/driver/        # Driver earnings and performance
│   │   ├── bids/                    # Bid submission + acceptance
│   │   ├── conversations/           # Job message threads
│   │   ├── direct-messages/         # User-to-user DMs
│   │   ├── job-offers/              # Direct job offer (bypasses bidding)
│   │   ├── jobs/                    # Job management + confirmation
│   │   ├── loads/                   # Load posting + listing
│   │   ├── messages/                # Job-scoped message posting
│   │   └── users/profile/           # Profile read and update
│   │
│   ├── auth/                        # Login and signup pages
│   ├── client/                      # CLIENT-role pages
│   │   ├── analytics/               # Shipping cost analytics dashboard
│   │   ├── chat/                    # Messaging hub
│   │   ├── dashboard/               # Client overview
│   │   ├── loads/                   # Load management + Find Drivers
│   │   ├── post-load/               # Load creation form
│   │   └── profile/                 # Profile editor
│   │
│   ├── driver/                      # DRIVER-role pages
│   │   ├── analytics/               # Earnings and performance dashboard
│   │   ├── chat/                    # Messaging hub
│   │   ├── dashboard/               # Driver overview
│   │   ├── jobs/                    # Job timeline + route optimisation
│   │   ├── loads/                   # Load board + bid submission
│   │   └── profile/                 # Profile editor
│   │
│   ├── layout.tsx                   # Root layout — AuthProvider injection
│   └── page.tsx                     # Landing page
│
├── components/
│   ├── layout/DashboardLayout.tsx   # Role-aware sidebar + header shell
│   └── providers/AuthProvider.tsx   # Global auth context
│
├── lib/
│   ├── queries/auth.ts              # getCurrentUser(req) — cookie resolution
│   ├── queries/loads.ts             # Parameterised load/job/message queries
│   ├── supabase/client.ts           # Browser-side Supabase singleton
│   ├── supabase/server.ts           # Server-side Supabase factory
│   └── types/database.ts            # TypeScript type definitions for all entities
│
├── middleware.ts                     # Edge Middleware — auth cookie enforcement
└── styles/globals.css               # Tailwind base + custom component utilities
```

---

## Authentication Architecture

TakuraBid uses **custom cookie-based session management** — no Supabase Auth, no JWT.

- On sign-in, `user_id` is persisted in `localStorage` and a `SameSite=Lax` cookie named `takura_user`.
- `middleware.ts` reads `request.cookies.get('takura_user')` on every request and returns HTTP 401 (API) or HTTP 302 to `/auth/login` (pages) if absent.
- Route Handlers read `req.cookies.get('takura_user')?.value` directly from `NextRequest` — **not** `cookies()` from `next/headers`, which is unreliable in Next.js 16 Route Handler context.
- `getCurrentUser(req?: NextRequest)` in `src/lib/queries/auth.ts` resolves the cookie to a full user record.

```typescript
// Correct pattern for all Route Handlers:
export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req)  // always pass req
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  // ...
}
```

- `AuthProvider` re-hydrates `document.cookie` from `localStorage` on every page mount to keep the server-readable cookie current after navigation.
- Client pages must wait for `authLoading === false` before fetching protected APIs to avoid race conditions where the cookie is not yet set.

---

## Key Data Patterns

### Primary Key Generation

| Table | PK Type | Generation |
|:------|:--------|:-----------|
| `loads` | `TEXT` | `LOAD${Date.now()}` — generated in application before INSERT |
| `jobs` | `TEXT` | `JOB${Date.now()}` — generated in application before INSERT |
| `users` | `UUID` | `crypto.randomUUID()` — generated in application before INSERT |
| `bids` | `UUID` | `crypto.randomUUID()` in application (DB also has `DEFAULT gen_random_uuid()`) |
| All others | `UUID` | `DEFAULT gen_random_uuid()` in database |

### Supabase FK Ambiguity on `loads`

The `loads` table has two FK references to `users` (`client_id` and `assigned_driver_id`). Supabase embedded joins fail due to ambiguity. **Always use separate queries and manual map merging** instead of embedded join syntax.

### Fire-and-Forget Inserts

Supabase `insert()` without `.select()` returns `PromiseLike<void>` — no `.catch()` available. Use the following pattern for best-effort inserts (e.g., notifications):

```typescript
void Promise.resolve(
  supabase.from('notifications').insert({ ... })
).catch(() => {})
```

---

## Database Schema (Summary)

Eight tables with FK constraints. RLS is **disabled** on all tables — access control is application-layer only.

| Table | Key Fields |
|:------|:-----------|
| `users` | `role`, `title`, `bio`, `availability_status`, `skill_tags[]`, `total_earnings`, `payment_verified`, `driver_ranking` |
| `loads` | `status`, `trip_type`, `urgency`, `description`, `requirements[]`, `assigned_driver_id` |
| `bids` | `amount_usd`, `status` (`Pending`/`Accepted`/`Rejected`), UNIQUE(load_id, driver_id) |
| `jobs` | `status`, `progress_percent`, `agreed_rate_usd`, `started_at`, `completed_at` |
| `messages` | `job_id` (FK), `sender_id`, `content` |
| `direct_messages` | `sender_id`, `recipient_id`, `content`, `read` |
| `notifications` | `user_id`, `title`, `body`, `type`, `read`, `reference_id` |
| `reviews` | `job_id`, `reviewer_id`, `reviewee_id`, `rating` (1–5), `comment` |

Run `supabase_schema.sql` in the Supabase SQL Editor to provision all tables, indexes, and sample data.

---

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## Deployment

The application deploys automatically to Vercel on push to `main`. No additional configuration is required beyond setting the environment variables in the Vercel project dashboard.

| URL | Purpose |
|:----|:--------|
| [https://takura-bid-six.vercel.app/](https://takura-bid-six.vercel.app/) | Production landing page |
| [https://takura-bid-six.vercel.app/client](https://takura-bid-six.vercel.app/client) | Client portal |
| [https://takura-bid-six.vercel.app/driver](https://takura-bid-six.vercel.app/driver) | Driver portal |
