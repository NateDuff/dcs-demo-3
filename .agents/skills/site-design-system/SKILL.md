---
name: site-design-system
description: Use when working on the visual design of a DCS customer site — brand tokens, CSS isolation, shadcn-vue components, and VitePress theming. Trigger for styling, theming, component adaptation, or brand-fidelity work on a site repo.
metadata:
  docKind: skill
  docClass: guidance
  title: Site Design System
  status: Active
  owner: Nathan Duff
  created: 2026-06-24
  lastVerified: 2026-06-25
  stalenessSLA: 90
  relatedDocs:
    - .github/skills/dcs-ui-ux/SKILL.md
    - .github/skills/dcs-product-motion/SKILL.md
    - .github/skills/site-content-editing/SKILL.md
    - .github/skills/dashboard-replication/SKILL.md
  codeRefs:
    - cli/ai-guidance/sync-site-guidance.ps1
  updateTriggers:
    - Customer-site design patterns change
    - Site guidance sync delivery changes
    - Frontend UI/UX standards change
---
<!-- Delivered from the dcs-again monorepo by cli/ai-guidance/sync-site-guidance.ps1. Do not edit here; edit the canonical source in dcs-again/.github and re-run the sync. -->

# Site Design System

DCS customer sites are Vue 3 + Tailwind + shadcn-vue, many on VitePress, managed by the portal CMS. This skill covers the shared mechanics; **each site also has a `source: site-local` design skill** (e.g. `coron8-design`, `kept-design`) that owns that site's specific brand decisions - read it first.

For general design craft (typography, color strategy, responsive UX, interaction states, and anti-template rules), apply `dcs-ui-ux` first. For transitions and animation, apply `dcs-product-motion`. This skill is the customer-site platform layer on top of that craft guidance.

## Design Brief

Before styling, resolve the `dcs-ui-ux` design brief with site-specific evidence:

- brand/source of truth: the site-local design skill, committed `.dcs/site.yaml`, and current screenshots;
- primary visitor action: call, book, quote, buy, read, subscribe, or contact;
- content ownership: what is CMS-managed vs hardcoded site chrome;
- hero/media strategy: real work/product/place imagery where inspection matters, not abstract decoration;
- anti-patterns: palette, typography, motion, or layout choices the site-local skill forbids.
- structure fingerprint: how this site avoids looking like a recolored generic landing page while preserving CMS/editor affordances.

Record durable brand decisions in the site-local design skill, not in shared DCS guidance.

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

## UI/UX Quality Gate

- Keep the brand/product/place obvious in the first viewport.
- Put CTAs near trust evidence: reviews, credentials, guarantees, location, service area, or work examples.
- Use site tokens for color, type, spacing, radius, and shadows; do not scatter raw colors through page components.
- Avoid one-note palettes, abstract gradient-only heroes, nested cards, and decorative motion that does not help the visitor act.
- Use `dcs-product-motion` for transitions; keep motion tokenized, reduced-motion safe, and aligned with the site's brand tempo.
- Validate mobile/tablet/desktop for no overlap, clipped text, horizontal scroll, or hidden fixed-bar content.

## Validation

- `pnpm build` from the site root must pass.
- Screenshot home/brand/blog pages in light + dark; confirm the brand matches the site-local design skill and framework chrome hasn't bled into the isolated subtree.
- Keep visual-editor markers intact (see `site-content-editing`).

