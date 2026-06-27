# ROVE Hire

Internal recruitment management tool for ROVE — built as a take-home assignment.

**Live URL:** `https://rove-hire-ashy.vercel.app`  
**Demo video:** *(add Loom link here)*

---

## Test credentials

```
Email:    hr@rovehire.com
Password: rovehire2024
```

The system is pre-populated with 3 job openings and 5 candidates across all pipeline states:

| Candidate | Status |
|---|---|
| Marcus Johnson | Applied |
| Priya Nair | Form Submitted |
| Daniel Osei | Interview Scheduled (with screening feedback) |
| Aisha Malik | Offer Sent (PDFs downloadable) |
| Tom Bergström | Rejected |

---

## How it is hosted

The Next.js application is deployed on **Vercel** (automatic deploy on push to `main`). The PostgreSQL database is hosted on **Supabase** (free tier, `ap-south-1` region). Resume and PDF files are stored in **Vercel Blob**.

---

## Tech stack and why

### Frontend & Backend — Next.js 15 (App Router)
Next.js App Router gives us React Server Components for data fetching, API Route Handlers for the backend, and automatic code splitting — all from a single codebase. No separate backend service to deploy or keep in sync. For an internal tool at this scale it is the right trade-off: less infrastructure surface, more time on the product.

### Database — Supabase PostgreSQL via Prisma ORM
PostgreSQL is the right choice for a recruitment tool because the data is inherently relational: candidates belong to jobs, interviews belong to candidates, timeline events reference candidates. Prisma provides full TypeScript type safety across every query with zero extra configuration. Supabase was chosen purely as a managed Postgres host — no Supabase SDK, no Supabase Auth, no Supabase Storage. It is just a connection string.

### File Storage — Vercel Blob
Resumes and generated PDFs need to be persisted and re-downloadable. Vercel Blob is a public object store that lives in the same Vercel project as the deployment — no additional credentials, no separate AWS account. Files are uploaded server-side from API routes and the URLs stored in the database. For production at scale, Cloudflare R2 would be a better choice (zero egress fees, global CDN).

### Authentication — Auth.js v5 (Credentials provider, JWT strategy)
HR users authenticate with email and password. Sessions are stored in a signed httpOnly JWT cookie — no session table needed in the database. The magic links for candidate application forms are a completely separate system (custom tokens in the `magic_links` table, validated in the `/api/apply` route) and do not touch Auth.js at all. This keeps the two auth surfaces cleanly separated.

### PDF Generation — @react-pdf/renderer
PDFs are defined as React components using `@react-pdf/renderer` primitives and rendered server-side via `renderToBuffer()` inside a Next.js API route. The approach was chosen because:

1. It runs in Node.js without a headless browser binary (unlike Puppeteer, which would be ~100 MB and cause cold-start issues on Vercel serverless).
2. Templates are React components — they live in version control, are easy to edit, and can be visually previewed.
3. No external service dependency — PDF generation is synchronous and self-contained.

**What I would change at scale:** Move PDF generation to a background job queue (Inngest or BullMQ). At high request volume, synchronous PDF rendering in a serverless function can exhaust memory or hit timeout limits. A queue would decouple the request from the render, allow retries, and keep API response times fast.

---

## What I would do next

If I had another two days:

1. **Rich text editor for job descriptions** — the description field currently stores markdown as plain text. Adding Tiptap or a simple MDX renderer would make job descriptions much more presentable.
2. **Email delivery for magic links** — the link is currently copy-pasted manually. Adding Resend or Postmark would make the candidate flow feel real end-to-end.
3. **Candidate search and filter on the Candidates page** — the dedicated Candidates list (`/candidates`) has no search or filter UI yet, only the dashboard pipeline does.
4. **Offer letter regeneration for seeded data** — the seeded "Offer Sent" candidate (Aisha Malik) has an offer document record but no actual PDF URLs because Vercel Blob is not available at seed time. The workaround is to open her profile after deployment and click "Generate Offer" once to create real PDFs.
5. **Resume preview inline** — currently resumes open in a new tab. An inline PDF viewer (react-pdf or an iframe) would be better UX.
6. **Bulk actions on the pipeline** — selecting multiple candidates to reject, or move to the next stage, would save time for high-volume hiring.

---

## What I would not put in production yet

**Magic link tokens stored plain** — tokens are stored as raw hex strings in the database. A production system would store them hashed (SHA-256) and compare hashes on validation, so a database read leak cannot be used to replay tokens. The window of risk is small (14-day expiry, one-time use), but it is a real gap.

**Single HR user with no roles** — the current system has one HR account. A production version would need role-based access (recruiter vs. hiring manager vs. admin) and the ability to create additional HR accounts without touching the database directly.

**Offer PDF seeding gap** — as noted above, the seeded "Offer Sent" candidate has null PDF URLs. This is fine for the demo if you regenerate through the app, but would need a proper solution for production (e.g., generate PDFs as part of the seed script using a pre-configured Blob token).

**No rate limiting on the public magic link endpoint** — `POST /api/apply/[token]` is fully public. In production it should be rate-limited (e.g., 5 requests/minute per IP) to prevent abuse.

**`AUTH_SECRET` must be rotated** — the demo uses a placeholder secret. Any deployment should generate a fresh secret with `openssl rand -base64 32` before going live.

**Synchronous PDF generation** — as noted in the tech stack section, blocking the API response on `renderToBuffer()` is acceptable for a demo but would need to move to a background queue for production.

---

## Local development setup

```bash
# 1. Clone and install
git clone https://github.com/charithanath/rove-hire.git
cd rove-hire
npm install

# 2. Set environment variables
cp .env.example .env.local
# Fill in DATABASE_URL, DIRECT_URL, AUTH_SECRET, BLOB_READ_WRITE_TOKEN

# 3. Push schema and seed
npm run db:push
npm run db:seed

# 4. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with `hr@rovehire.com` / `rovehire2024`.

---

## Environment variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Supabase Postgres connection (pooler, port 6543) |
| `DIRECT_URL` | Supabase Postgres direct connection (migrations, port 5432) |
| `AUTH_SECRET` | Auth.js JWT signing secret (`openssl rand -base64 32`) |
| `AUTH_URL` | App base URL (e.g. `https://rove-hire.vercel.app`) |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token for file storage |
| `NEXT_PUBLIC_APP_URL` | Used to construct magic link URLs |
