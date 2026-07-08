# Crown Vic Auto Sales Dealer Platform

Next.js dealership platform for Crown Vic Auto Sales with a public inventory site, AI chat, Supabase data, and Clerk-protected staff workspace.

## Stack

- Next.js App Router
- Clerk authentication for staff/admin routes
- Supabase for inventory, leads, appointments, chat history, analytics, and media storage
- Groq OpenAI-compatible API for the dealership assistant
- Vercel for deployment

## Environment

Create `.env.local` locally and add the same values to Vercel:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GROQ_API_KEY=
GROQ_MODEL=llama-3.3-70b-versatile
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/admin
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/admin
```

Keep `SUPABASE_SERVICE_ROLE_KEY` and `CLERK_SECRET_KEY` server-only.

## Supabase Setup

Run `supabase/schema.sql` in the Supabase SQL editor. It creates:

- vehicles, vehicle media, and vehicle specs
- leads, lead events, and appointments
- chat sessions and messages
- staff profiles linked to Clerk user IDs
- dealership settings and analytics events
- storage buckets for vehicle media, site media, and documents

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verification

```bash
npm run lint
npm run build
```

## Key Routes

- `/` public showroom
- `/inventory` searchable inventory
- `/inventory/[slug]` vehicle detail page with lead CTAs
- `/contact` lead form
- `/admin` Clerk-protected dashboard
- `/admin/inventory` inventory manager
- `/admin/leads` CRM pipeline
- `/admin/chat` AI chat inbox
- `/admin/analytics` conversion analytics
