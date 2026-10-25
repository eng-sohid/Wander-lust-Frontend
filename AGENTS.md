<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Commands

- Dev: `npm run dev` (Turbopack). Build: `npm run build`. Lint: `npm run lint`.
- No test framework. To verify changes: `npm run lint` then `npm run build` (build also typechecks). Standalone typecheck: `npx tsc --noEmit`.

## Stack quirks

- Next.js 16.4.3 + React 19.3, App Router only (`src/app`). `next.config.ts` enables `cacheComponents` + `partialPrefetching`: dynamic data must be wrapped in `<Suspense>` and uses the new cache APIs. Do not remove the Turbopack CSS loader rule — it is how Tailwind is wired in.
- Tailwind v4, CSS-first: no `tailwind.config.js`. Design tokens are CSS variables in `src/app/globals.css` (`@theme inline` block); dark mode is the `.dark` class via `@custom-variant`.
- Single route (`src/app/page.tsx`) for a travel landing page (marketing assets in `public/images/`). Page/layout props are generated typed helpers (`LayoutProps<"/">`, `PageProps`) — don't write prop types by hand.

## shadcn/ui (this differs from what you know)

- Style is **base-nova**: primitives come from **`@base-ui/react`** (e.g. `@base-ui/react/button`), **not Radix**. Check `src/components/ui/*.tsx` for the real import paths and API before writing components.
- `cn` is re-exported from the `cn` npm package via `src/lib/utils.ts` — import it as `@/lib/utils`.
- Primitive sources vary: most components import from `@base-ui/react/*`, some from `@shadcn/react/*` (e.g. `questionnaire`, `message-scroller`). Check the existing file for the same component before choosing an import path.
- Path alias: `@/*` → `src/*`. `components.json` at the repo root is the shadcn CLI config (style, aliases, registry).

## Git

- Very young repo (one create-next-app commit). There is no CI workflow — CI expectations and branch rules are currently undefined.
