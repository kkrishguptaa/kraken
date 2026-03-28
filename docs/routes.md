# Route Map

This page is a quick reference for the route structure that exists in the current codebase.

## Core App Routes

- `/` is the landing page. Signed-in users are redirected to `/feed`.
- `/home` shows the same landing experience for signed-in users who want to return to the marketing page.
- `/feed` is the reader feed of recent published issues.
- `/editorial` is the writer workspace.
- There is not currently a separate `/editorial/[id]` page in the checked-in app; article editing happens inside the editorial workspace UI.
- `/settings` manages the profile name, publication title, and custom domains.
- `/subscriptions` manages reader subscriptions and inbox preferences.

## Auth Routes

- `/auth/sign-in`
- `/auth/sign-up`
- `/auth/email`
- `/auth/verify-email`
- `/auth/onboarding`
- `/auth/unauthenticated`
- `/auth/unauthorized`

## Public Publication Routes

The app currently exposes both `@` and `~` route families.

- `/@username` is the profile-style public view.
- `/@username/[editionNumber]` is the profile-style public issue view.
- `/~username` is the publication-style view with subscription controls.
- `/~username/[editionNumber]` is the publication-style issue view.

When adding links or docs, follow the current implementation rather than older notes that describe only one of these families.

## Custom Domains

Custom domains are resolved through `proxy.ts`, which asks `src/app/api/internal/domain-lookup/route.ts` whether the hostname belongs to a verified publication.

If the lookup succeeds, the request is rewritten to the matching publication route. If it does not, the app falls back to the normal Next.js route handling.

## Notes for Contributors

- Prefer updating both the page component and its matching helper/action when changing route behavior.
- The public route families are intentionally separate in the current codebase, so be careful when simplifying links or labels.
- If a route change is proposed, update the README and this map together so the docs stay aligned.
