---
name: site-design-system
description: Use when working on the visual design of a DCS customer site — brand tokens, CSS isolation, shadcn-vue components, and VitePress theming. Trigger for styling, theming, component adaptation, or brand-fidelity work on a site repo.
---
<!-- Delivered from the dcs-again monorepo by cli/ai-guidance/sync-site-guidance.ps1. Do not edit here; edit the canonical source in dcs-again/.github and re-run the sync. -->

# Site Design System

DCS customer sites are Vue 3 + Tailwind + shadcn-vue, many on VitePress, managed by the portal CMS. This skill covers the shared mechanics; **each site also has a `source: site-local` design skill** (e.g. `coron8-design`, `kept-design`) that owns that site's specific brand decisions — read it first.

For general design craft (typography, color strategy, anti-"AI-slop" rules), use the installable external `frontend-design` skill. This skill is the DCS-specific layer on top of it.

## CSS Isolation (the point)

Marketing/design pages root on a site-specific class (e.g. `.c8-page`, `.kt-page`, `.kd-page`) so the design CSS wins there and framework base resets stay off that subtree. Do **not** remove the isolation prefix or the `postcssIsolateStyles` plugin. Brand tokens live in the theme's `tailwind.css`; framework chrome wiring lives in `style.css`.

## VitePress Theming

- `@import` (not `@reference`) for token CSS.
- Remap `--vp-c-*` brand tokens in both base `:root` and `html.dark`; add an SSR `:root:not([data-theme])` fallback.
- Ship **one approved theme** — remove any theme-picker.
- Use `@source` directives so Tailwind generates the shadcn utility classes the components need.
- Author blog posts as plain `doc` markdown so `vp-doc` prose renders them; don't wrap posts in the isolated `.<slug>-page` subtree.
- Respect mobile breakpoint gates.

## shadcn-vue Conventions

- Vue 3 Composition API, TypeScript, explicit props/emits. Prefer existing local component patterns over the shadcn-vue CLI, which can conflict with non-standard workspace/tsconfig setups.
- Treat shadcn components as starting points: adapt variants to the site's brand tokens, keep API shapes stable, and drive visuals from the local token system rather than hard-coding palette decisions across many files.
- Confirm the actual primitive package (reka-ui / Radix) before copying example code, especially for form controls and popovers.

## Charts & Dashboards

For any analytics/dashboard surface on a site, follow the `dashboard-replication` skill (KPI cards, chart wrappers, `var(--chart-N)` tokens).

## Validation

- `pnpm build` from the site root must pass.
- Screenshot home/brand/blog pages in light + dark; confirm the brand matches the site-local design skill and framework chrome hasn't bled into the isolated subtree.
- Keep visual-editor markers intact (see `site-content-editing`).

