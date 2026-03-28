# Kraken

**Kraken** is a personal publishing platform for staying connected with friends through regular life updates. Share daily notes, weekly letters, or monthly check-ins—your friends receive them predictably via email or feed, without algorithms deciding who sees what. It's social media made calmer, more personal, and more like staying in touch than performing for an audience.

## Stack

- Next.js 16 App Router
- Better Auth
- Neon serverless Postgres with Drizzle
- Tailwind CSS v4 with Base UI primitives
- Resend for email delivery
- Vercel Domains API for custom domain management

## Getting Started

```bash
pnpm install
cp .env.example .env.local # or create .env.local manually if you keep secrets elsewhere
pnpm dev
```

Open `http://localhost:3000` to view the app.

## Local Workflow

- `pnpm dev` runs the app.
- `pnpm build` creates a production build.
- `pnpm lint` runs Biome checks.
- `pnpm format` formats the codebase with Biome.
- `pnpm db:generate`, `pnpm db:migrate`, `pnpm db:push`, and `pnpm db:check` manage Drizzle schema workflows.
- `pnpm db:seed` seeds sample publications and issues from `scripts/seed.ts`; it expects at least one real user to already exist.
- `pnpm email:test` sends test emails from `scripts/email-test.ts` and requires `TEST_EMAIL_TO`.

## Main Routes

-  - `/@username` for the profile-style public view.
-  - `/~username` for the publication-style view with subscription controls.
-  - `/~username/[editionNumber]` for the publication-style issue view.

For a compact route map and notes on the public/domain routing split, see [docs/routes.md](docs/routes.md).

## Architecture Notes

- Root layout and global fonts live in `src/app/layout.tsx`.
- App routing lives in `src/app/**`.
- Better Auth is configured in `auth.ts`, with the API handler in `src/app/api/auth/[...all]/route.ts`.
- Drizzle schema is split between `auth-schema.ts` and `src/db/schema.ts`.
- The Drizzle client lives in `src/lib/db.ts` and loads `.env.local` directly.
- Server actions live in `src/actions/**`.
- Editorial UI lives in `src/components/editorial/**`.
- Auth UI lives in `src/components/auth/**`.
- Email templates live in `src/emails/**`.
- Custom domain resolution happens in `proxy.ts` and `src/app/api/internal/domain-lookup/route.ts`.

## Environment Variables

The code currently expects some combination of the following values:

- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `NEXT_PUBLIC_APP_URL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `VERCEL_API_TOKEN`
- `VERCEL_PROJECT_ID`
- `VERCEL_TEAM_ID`
- `TEST_EMAIL_TO`

Some email and domain paths intentionally no-op or degrade gracefully when configuration is missing. Check the implementation before changing those behaviors.

## Contributing Notes

- Read `AGENTS.md` first. It is the repo guidance source of truth.
- The codebase is intentionally light-mode only and leans into a paper/editorial aesthetic.
- When changing auth, routing, subscriptions, or editor behavior, inspect both the page layer and the matching server-action/helper layer.
- When changing public pages or issue rendering, check the `@` and `~` route families together.
- When changing the landing page, auth flows, or other visible surfaces, browser verification is worth doing before merging.

## Product Summary

Kraken is built for recurring writing. It is meant for people who want a calmer way to publish updates, keep an archive, and let readers follow by email or on the web.
