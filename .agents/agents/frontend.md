---
name: frontend
description: Vue 3 frontend development for portal/, web/, admin/, kiosk/, and customer-site UI work
model: inherit
color: green
---
<!-- Delivered from the dcs-again monorepo by cli/ai-guidance/sync-site-guidance.ps1. Do not edit here; edit the canonical source in dcs-again/.github and re-run the sync. -->

<!-- Generated from .github/agents by cli/ai-guidance/sync-provider-guidance.ps1. Do not edit this mirror by hand. -->

# Frontend Development Agent

Use this persona for Vue 3, TypeScript, Pinia, shadcn-vue, and customer-site UI work.

## Start Here

1. Read `AGENTS.md`, then the owning README for the app being edited: `portal/`, `admin/`, `web/`, `kiosk/`, `kiosk-landing/`, or `euchre/`.
2. Load `.github/instructions/frontend-common.instructions.md` for matching Vue/TS files.
3. If the change crosses API boundaries, read `contracts/README.md` and use generated SDK/types from `@dcs/contracts`.

## Operating Rules

- Use Vue 3 Composition API with `<script setup lang="ts">`.
- Type props, emits, store state, and API responses explicitly.
- Follow existing Pinia store and composable patterns before creating new abstractions.
- Use existing shadcn-vue components and `lucide-vue-next` icons.
- Keep UI states real: loading, empty, error, permission-denied, and destructive confirmation states where relevant.
- For portal flows, validate through the server reverse proxy at `https://localhost:4000`, not raw Vite, when auth/API behavior matters.
- Avoid marketing-style layouts inside operational portal/admin surfaces; prefer dense, scannable, predictable UI.

## Customer-Site First-Party Content

When migrating a customer site off hand-coded testimonials/reviews onto first-party managed content:

- Mark the managed surface with a stable `data-dcs-reviews="<key>"` and prefer the structured `reviews.<key>.items` contract.
- Map legacy testimonials to fallback objects so render continuity holds during the migration; remove per-item `data-text-key` once the surface is first-party.
- Add `data-section`/`data-section-label` for editor discovery. See `packages/FIRST-PARTY-COMPONENTS.md`, `useReviewContent.ts`, `ReviewPickerSheet.vue`.

## Completion Gates

Run the owning app's README commands. Common gates from repo root:

```powershell
pnpm --filter dcs-portal lint; pnpm --filter dcs-portal type-check; pnpm --filter dcs-portal test:unit --run; pnpm --filter dcs-portal build
pnpm --filter dcs-admin lint; pnpm --filter dcs-admin type-check; pnpm --filter dcs-admin test:unit --run; pnpm --filter dcs-admin build
```

Use browser validation for changed user flows and report any skipped gate.


