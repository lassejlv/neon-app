# neon-app

Auth + Postgres on the edge. A [TanStack Start](https://tanstack.com/start) app with
[Neon Auth](https://neon.com/docs/auth/overview) for sign-in/sessions,
[Neon Postgres](https://neon.com/docs) as the database, and
[Cloudflare Workers](https://developers.cloudflare.com/workers/) as the runtime.

Sign up with email or Google, get a session cookie, and see your live
`neon_auth.user` row on the dashboard — no boilerplate to delete.

## Features

- **Neon Auth built in** — sign-in, sign-up, password reset, and Google OAuth via
  `@neondatabase/auth-ui`; sessions sync automatically with the router.
- **Postgres out of the box** — every user lands in `neon_auth.user`, queried from
  a TanStack server function with `@neondatabase/serverless`.
- **Edge-ready** — renders on Cloudflare Workers; deploys with `vite build` +
  `wrangler`.
- **UI kit** — Tailwind CSS v4 plus a full set of Base UI components in
  `src/components/ui`.

## Getting started

Prerequisites: [Bun](https://bun.sh) and a Neon project with Auth enabled
([quick-start for TanStack Router](https://neon.com/docs/auth/quick-start/tanstack-router)).

```bash
cp .env.example .env.local
bun install
bun --bun run dev
```

| Variable             | Where it's used                         | Notes                                              |
| -------------------- | --------------------------------------- | -------------------------------------------------- |
| `VITE_NEON_AUTH_URL` | Auth client (`src/lib/auth.ts`)         | Public; also set under `vars` in `wrangler.jsonc`. |
| `DATABASE_URL`       | Server function (`src/lib/get-user.ts`) | Secret — server-side only, never `VITE_` prefixed. |

`DATABASE_URL` must be visible to the Worker runtime (e.g. `.dev.vars` for local
dev, a secret/var on the deployed Worker). The app throws a clear error at
startup when a variable is missing.

## Scripts

| Command                    | What it does                           |
| -------------------------- | -------------------------------------- |
| `bun --bun run dev`        | Start the dev server on port 3000      |
| `bun --bun run build`      | Production build                       |
| `bun --bun run preview`    | Preview the production build locally   |
| `bun --bun run deploy`     | Build and deploy to Cloudflare Workers |
| `bun --bun run cf-typegen` | Regenerate `worker-configuration.d.ts` |
| `bun --bun run test`       | Run the Vitest suite                   |
| `bun --bun run lint`       | Lint with Oxlint                       |
| `bun --bun run fmt`        | Format with Oxfmt                      |
| `bun --bun run check`      | Lint + format check                    |

## How it works

- `src/lib/auth.ts` creates the auth client from `VITE_NEON_AUTH_URL`.
- `src/components/auth-provider.tsx` wraps the app in `NeonAuthUIProvider`
  (base path `/auth`, Google provider, password reset).
- `src/routes/auth.$pathname.tsx` and `src/routes/account.$pathname.tsx` render
  `AuthView` / `AccountView`; use `SignedIn`, `SignedOut`, `AuthLoading`, and
  `UserButton` for auth-aware UI.
- `src/lib/get-user.ts` is a `createServerFn` handler that reads the
  `neon_auth.user` row with `neon(DATABASE_URL)` — all DB access stays
  server-side. `src/components/user-profile.tsx` shows the session next to the
  database row.

## Project structure

```text
src/
  routes/        # File-based routes (`__root.tsx`, `index.tsx`, `auth.$pathname.tsx`, `account.$pathname.tsx`)
  lib/           # Auth client, server functions, utilities (`#/` import alias)
  components/    # `auth-provider.tsx`, `site-header.tsx`, `user-profile.tsx`, `ui/` kit
  styles.css     # Tailwind v4 + `@neondatabase/auth-ui/tailwind`
```

## Deploy

```bash
bun --bun run deploy
```

This builds the app and deploys it with Wrangler. After changing bindings or
vars, run `bun --bun run cf-typegen` to refresh `worker-configuration.d.ts`.

## Lint & format

[Oxlint](https://oxc.rs/docs/guide/usage/linter) and
[Oxfmt](https://oxc.rs/docs/guide/usage/formatter) are configured in
`oxlint.config.ts` and `oxfmt.config.ts` (tabs, double quotes).

## Learn more

- [Neon Auth overview](https://neon.com/docs/auth/overview)
- [Managed Better Auth + Data API SDK (`@neondatabase/neon-js`)](https://neon.com/docs/reference/javascript-sdk)
- [Neon serverless driver](https://neon.com/docs/serverless/serverless-driver)
- [TanStack Start](https://tanstack.com/start) · [TanStack Router](https://tanstack.com/router)
