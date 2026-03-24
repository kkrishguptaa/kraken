# Kraken News — Full Build Prompt

## What We're Building
A newspaper-aesthetic newsletter platform where anyone can create their own publication ("Kraken News"), write issues in a rich markdown editor, and distribute them via web and email. Think Substack meets a broadsheet newspaper, self-hosted on your own domain.

---

## Platform Domain & Routing

The platform lives at `kraken.krishg.com`. Routing works as follows:

- `kraken.krishg.com` — marketing page if logged out, writer dashboard if logged in (handled in middleware, no separate `/dashboard` route)
- `kraken.krishg.com/@username` — a writer's publication page
- `kraken.krishg.com/@username/issue/[edition-number]` — a single issue
- `kraken.krishg.com/@username/subscribe` — subscribe to a publication
- Custom domains (e.g. `news.krishg.com`) map to `kraken.krishg.com/@username` via Vercel Domains API — the full publication including individual issue pages must work on the custom domain too

---

## Tech Stack

| Concern | Choice |
|---|---|
| Framework | Next.js (App Router) |
| Auth | Clerk |
| Database | Drizzle ORM + Neon (serverless Postgres) |
| Email | Loops |
| Styling | Tailwind CSS |
| Components | Radix UI (headless) |
| Custom Domains | Vercel Domains API |
| Formatting | Biome.js |
| CI | GitHub Actions |
| Deployment | Vercel |

---

## Design System

**Vibe:** Modern editorial — clean, magazine-like, but unmistakably papery. Think The Atlantic or Monocle online, not The Guardian.

- **Typography:** Serif for all headings and issue body content (`Playfair Display` or `Lora` from Google Fonts). Sans-serif (`Inter`) for UI chrome only (nav, buttons, metadata).
- **Color palette:** Off-white `#F9F6F0` backgrounds, near-black `#1A1A1A` text, muted ink-grey `#6B6B6B` for secondary text, thin `1px` borders in `#D4CCBC`.
- **Layout:** Generous whitespace. Wide single-column for issue reading. Multi-column masonry-style grid on publication homepages. A thick horizontal rule under every masthead.
- **Issue header:** Masthead with publication name large and centered, edition number and date in small caps below it, a horizontal rule, then the issue title.
- No rounded corners anywhere. Flat, ink-on-paper feel. Subtle paper texture via CSS on body.

---

## Database Schema (Drizzle)

```ts
// users — synced from Clerk webhooks
users {
  id: text (primary key, matches Clerk userId)
  username: text (unique)
  email: text
  createdAt: timestamp
}

// publications — one per user
publications {
  id: uuid
  userId: text (FK → users)
  name: text
  description: text
  slug: text (unique, matches username, used for @username routing)
  customDomain: text (nullable, unique)
  customDomainVerified: boolean
  vercelDomainId: text (nullable)
  createdAt: timestamp
}

// issues
issues {
  id: uuid
  publicationId: uuid (FK → publications)
  title: text
  editionNumber: integer
  content: text (raw markdown)
  status: enum('draft', 'published')
  publishedAt: timestamp (nullable)
  createdAt: timestamp
  updatedAt: timestamp
}

// templates
templates {
  id: uuid
  publicationId: uuid (FK → publications)
  name: text
  content: text (raw markdown)
  createdAt: timestamp
}

// subscribers — no account required
subscribers {
  id: uuid
  publicationId: uuid (FK → publications)
  email: text
  emailNotificationsEnabled: boolean (default true)
  token: text (unique, for unsubscribe links)
  loopsContactId: text (nullable)
  createdAt: timestamp
}

// follows — logged-in users
follows {
  followerId: text (FK → users)
  publicationId: uuid (FK → publications)
  emailNotificationsEnabled: boolean (default true)
  createdAt: timestamp
}

// likes
likes {
  userId: text (FK → users)
  issueId: uuid (FK → issues)
  createdAt: timestamp
}

// comments
comments {
  id: uuid
  issueId: uuid (FK → issues)
  userId: text (FK → users)
  content: text
  createdAt: timestamp
}
```

---

## PR Checkpoints

Work in this order. Each PR closes the listed issues. Do not move to the next PR until the current one is merged.

---

### PR 1 — `feat/foundation`
**Closes:** Initialise Next.js project · CI pipeline · Drizzle schema · Clerk setup

Set up the entire project skeleton. After this PR, the following must be true:
- `biome check`, `tsc --noEmit`, and `drizzle-kit check` all pass in CI
- Clerk is installed, ClerkProvider wraps the app, the webhook syncs users to Neon
- The full Drizzle schema is migrated against Neon
- A dev seed script exists

---

### PR 2 — `feat/middleware`
**Closes:** Middleware: auth-split on / · custom domain rewriting

After this PR:
- `/` renders the marketing page for logged-out users and the (stubbed) dashboard for logged-in users — no redirect, URL stays `/`
- Any verified custom domain rewrites to `/@slug/...` internally
- Clerk auth works on custom domains

---

### PR 3 — `feat/design-system`
**Closes:** Global design system · Marketing homepage

After this PR:
- Tailwind config has all design tokens (fonts, colors, borders)
- Paper texture is on body
- Masthead, HorizontalRule, IssueCard, PageWrapper components exist and are documented
- The logged-out `/` marketing page is complete and looks like a newspaper front page

---

### PR 4 — `feat/auth-and-onboarding`
**Closes:** Onboarding flow

After this PR:
- A new user who signs in for the first time is redirected to `/onboarding`
- Onboarding creates the publication row and redirects to `/`
- Username uniqueness is validated

---

### PR 5 — `feat/editor`
**Closes:** TipTap rich markdown editor · Embed support · Issue metadata bar · Draft autosave

After this PR:
- `/editor` and `/editor/[issueId]` are fully functional
- Split-pane editor with live preview works
- All toolbar actions work
- Twitter/X, YouTube, Substack URLs auto-embed in the editor
- Metadata bar (title, edition number, date) is wired to the database
- Autosave runs every 30 seconds, manual save works

---

### PR 6 — `feat/issues-and-publications`
**Closes:** Issue publish flow · Issue reading page · Publication page · Writer dashboard

After this PR:
- Writers can publish an issue (email send is stubbed with a TODO, wired in PR 8)
- `/@username/issue/[editionNumber]` renders correctly with full masthead and markdown body
- `/@username` renders the publication grid
- Logged-in `/` renders the full dashboard with drafts, published issues, and followed publications

---

### PR 7 — `feat/social`
**Closes:** Likes · Comments · Follow/unfollow · Guest subscribe flow

After this PR:
- Likes work with optimistic UI
- Comments can be posted and read
- Follow/unfollow and per-publication email toggle work
- Guest subscribe creates a subscriber row and sends a confirmation (Loops wired here)
- Unsubscribe via token works

---

### PR 8 — `feat/email`
**Closes:** Loops integration · New issue email broadcast

After this PR:
- All three transactional emails exist in Loops and are triggered correctly
- Contact tagging on subscribe/follow/unsubscribe/unfollow is correct
- Publishing an issue sends the full issue email to all tagged contacts with email on

---

### PR 9 — `feat/custom-domains`
**Closes:** Custom domain setup UI and Vercel API integration

After this PR:
- Writer can enter a domain in settings
- App calls Vercel Domains API, shows DNS records, verifies on demand
- Middleware correctly routes verified custom domains

---

### PR 10 — `feat/templates-and-share`
**Closes:** Issue templates · Slack/Discord share

After this PR:
- Templates can be saved, listed, applied, and deleted
- Copy for Slack/Discord converts the full issue to Slack markdown and copies to clipboard with a toast

---

### PR 11 — `feat/polish`
**Closes:** Accessibility audit · Mobile responsive layout · SEO and OG metadata

After this PR:
- All interactive elements are keyboard accessible
- The app is fully usable on mobile
- Every publication and issue page has correct OG tags
- Custom domain pages serve correct OG metadata

---

## Middleware (`middleware.ts`)

The middleware handles two concerns and must be composed carefully with Clerk:

1. **Auth-based root split:** If the request is for `/` and the user is logged in, serve the dashboard component. If logged out, serve the marketing page. This is a render decision, not a redirect — URL stays `/`.
2. **Custom domain rewriting:** If hostname is not `kraken.krishg.com`, look up in `publications` where `customDomain` matches and `customDomainVerified = true`. If found, rewrite to `/@slug/...` internally. Clerk must remain functional on custom domains — use `clerkMiddleware` as the outer wrapper.

---

## Features & Pages

### Auth (Clerk)
- Clerk hosted UI for sign up / sign in
- After first sign-in, redirect to `/onboarding` if no publication exists
- `POST /api/webhooks/clerk` syncs user create/update/delete to `users` table

### Onboarding (`/onboarding`)
- Username, publication name, description
- Validates username uniqueness
- Creates publication row, redirects to `/`

### Root (`/`)
**Logged out:** Marketing page.
**Logged in:** Dashboard — New Issue button, drafts list, published issues list, followed publications with email toggles, settings link.

### Publication Page (`/@username`)
- Masthead, follow/subscribe CTAs, multi-column issue grid
- Owner sees New Issue and Settings buttons

### Issue Page (`/@username/issue/[editionNumber]`)
- Full masthead, rendered markdown, embeds, likes, comments, share bar

### Editor (`/editor`, `/editor/[issueId]`)
- TipTap with markdown, split-pane preview, toolbar, embeds, metadata bar, autosave, publish, templates

### Templates (`/settings/templates`)
- List, delete

### Settings (`/settings`)
- Edit publication name/description
- Custom domain: enter → Vercel API → DNS instructions → verify
- Danger zone: delete publication (requires typing the publication name to confirm)

### Subscribe (`/@username/subscribe`)
- Email + optional name, no account required
- Creates subscriber, syncs to Loops, sends confirmation

### Unsubscribe
- `GET /unsubscribe?token=` sets email off, removes Loops tag, shows confirmation page

---

## Email (Loops)

Three transactional emails, triggered via Loops API:

| Trigger | Email |
|---|---|
| Guest subscribes | Subscription confirmation + unsubscribe link |
| Logged-in user follows with email on | Follow confirmation |
| Issue published | Full issue email to all tagged contacts with email on |

Contact tagging: every publication uses tag `subscribed-[slug]`. Add on subscribe/follow-with-email. Remove on unsubscribe/email-off.

New issue email content: publication masthead, issue title, edition number, date, full issue HTML (embeds as plain links), footer with unsubscribe link pointing to `GET /unsubscribe?token=[token]`.

---

## Slack/Discord Share (client-side only)

```
🔗 Read on Kraken News: https://kraken.krishg.com/@username/issue/[N]

📰 *[Publication Name] — Edition #[N]*
_[Issue Title] · [Date]_

---

[Full issue content in Slack/Discord markdown]
```

Embeds → plain links. Headings → `*bold*`. Blockquotes → `>`. Lists and code blocks unchanged. Copy to clipboard + toast.

---

## API Routes

```
POST   /api/webhooks/clerk
POST   /api/publications
PATCH  /api/publications/[id]
POST   /api/domains
POST   /api/domains/verify
POST   /api/issues
PATCH  /api/issues/[id]
POST   /api/issues/[id]/publish
POST   /api/issues/[id]/like
POST   /api/issues/[id]/comments
GET    /api/issues/[id]/comments
POST   /api/subscribe
GET    /api/unsubscribe
POST   /api/follow
PATCH  /api/follow/[publicationId]
POST   /api/templates
DELETE /api/templates/[id]
```

---

## CI (GitHub Actions)

On every push/PR: `biome check`, `tsc --noEmit`, `drizzle-kit check`. Vercel deploys on merge to main via GitHub integration.

---

## Environment Variables

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=
DATABASE_URL=
LOOPS_API_KEY=
VERCEL_API_TOKEN=
VERCEL_PROJECT_ID=
VERCEL_TEAM_ID=
NEXT_PUBLIC_APP_URL=https://kraken.krishg.com
```

---

## Agent Notes

- **Before writing any code, search `.agent/skills/`.** These are skill documents that define how to approach specific tasks for this project. Follow them precisely where relevant. If a skill conflicts with something in this prompt, the skill takes precedence — it is more specific. After figuring out the skills, invoke the ones that you'll need in different places.
- Make sure to modularize components and follow DRY principles.
- Commit often and make PRs often. You can make PRs to branches that eventually become PRs. The more the merrier.
- Build and merge PRs strictly in order — later PRs depend on earlier ones
- TipTap is the hardest piece — stub the publish email in PR 5/6, wire it properly in PR 8
- Compose `clerkMiddleware` carefully — auth must work on custom domains before PR 9 ships
- Loops tagging is the fan-out mechanism — get it right in PR 7 before PR 8 builds on it
- Edition numbers auto-increment from the publication's highest existing edition, but are always manually editable before publishing
