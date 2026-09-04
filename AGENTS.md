# AGENTS.md

## Commands

- `bun --bun run dev` — run the development task
- `bun --bun run build` — build the project
- `bun --bun run test` — run the full test suite
- `bun --bun run lint` — run the lint task

## Code Map

- `src` — application source

## Conventions

- Use ESM `import`/`export` syntax.
- Write `#/` imports with explicit `.ts`/`.tsx` extensions.

## Neon stack

- Neon Auth (Managed Better Auth) holds users/sessions in the `neon_auth` schema. The client lives in `src/lib/auth.ts` (`createAuthClient` from `@neondatabase/neon-js/auth` with the `BetterAuthReactAdapter`), using `VITE_NEON_AUTH_URL` from `wrangler.jsonc`. Docs: [Auth overview](https://neon.com/docs/auth/overview), [TanStack Router quick-start](https://neon.com/docs/auth/quick-start/tanstack-router).
- Auth UI (`@neondatabase/auth-ui`) provides `NeonAuthUIProvider`, `AuthView`, `AccountView`, `SignedIn`/`SignedOut`/`AuthLoading`, and `UserButton`. Wired in `src/components/auth-provider.tsx` (base path `/auth`, Google social login, password reset) with routes at `src/routes/auth.$pathname.tsx` and `src/routes/account.$pathname.tsx`; `src/styles.css` imports `@neondatabase/auth-ui/tailwind`. Docs: [auth-ui package README](https://github.com/neondatabase/neon-js/blob/main/packages/auth-ui/README.md).
- Postgres is queried with the serverless driver (`neon` from `@neondatabase/serverless`) as tagged-template SQL over HTTP, which works in Cloudflare Workers. See `src/lib/get-user.ts`, which reads `neon_auth."user"` using `DATABASE_URL` from `cloudflare:workers` env. Docs: [serverless driver](https://neon.com/docs/serverless/serverless-driver), [JS SDK reference](https://neon.com/docs/reference/javascript-sdk).
- Server functions here are TanStack `createServerFn` handlers (see `src/lib/get-user.ts`), not Neon Functions — keep all DB access and secrets server-side. [Neon Functions](https://neon.com/docs/compute/functions/overview) is a separate primitive and is not used in this repo.
- Neon Object Storage (S3-compatible) is not used in this repo — no bucket/storage code exists under `src`. Keep large binaries there with only reference keys in Postgres if added later. Docs: [Object Storage overview](https://neon.com/docs/storage/overview).
