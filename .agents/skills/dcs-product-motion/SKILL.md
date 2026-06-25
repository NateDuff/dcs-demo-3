---
name: dcs-product-motion
description: "Use when adding, auditing, or refining UI motion in DCS frontend and customer-site surfaces: transitions, animations, microinteractions, motion tokens, reduced-motion behavior, dropdowns, modals, panels, page/list-detail transitions, accordions, tabs, tooltips, badges, icon/text swaps, number changes, skeleton/loading reveals, success/error feedback, hover effects, or hardcoded duration/easing cleanup."
metadata:
  docKind: skill
  docClass: guidance
  title: DCS Product Motion
  status: Active
  owner: Nathan Duff
  created: 2026-06-25
  lastVerified: 2026-06-25
  stalenessSLA: 90
  relatedDocs:
    - .github/skills/dcs-ui-ux/SKILL.md
    - .github/skills/site-design-system/SKILL.md
    - .github/instructions/frontend-common.instructions.md
  codeRefs: []
  updateTriggers:
    - Frontend motion standards change
    - DCS design system tokens change
    - Customer-site guidance sync changes
---
<!-- Delivered from the dcs-again monorepo by cli/ai-guidance/sync-site-guidance.ps1. Do not edit here; edit the canonical source in dcs-again/.github and re-run the sync. -->

# DCS Product Motion

Use purposeful motion to make state changes legible. Keep it fast, tokenized, accessible, and native to the surface.

Inspired by the Transitions.dev catalog/review/apply/refine model, adapted for DCS Vue, Tailwind, shadcn-vue, and customer-site constraints.

## Load With

- Load `dcs-ui-ux` first for the surface brief and quality gates.
- Load `site-design-system` plus the site-local design skill for customer/prospect/demo sites.
- Use existing CSS, Tailwind utilities, Vue `<Transition>`, or local shadcn-vue patterns before adding a motion library.

## Verbs

- `motion reveal`: list the catalog below.
- `motion review`: read-only scan for ad-hoc `transition`, `animation`, `@keyframes`, hardcoded `ms`/`s`, Tailwind arbitrary durations, and missing reduced-motion handling. Group findings by file and suggest one catalog pattern per hit.
- `motion apply [pattern]`: choose the smallest fitting pattern, explain the one-line rationale, then edit only the needed files when the user asked for implementation. If the request came from a review suggestion, confirm before editing.
- `motion refine`: replace hardcoded timing/easing with existing motion tokens, or add narrow local tokens beside the existing design tokens when none exist.

## Catalog

| Pattern | Use for |
| --- | --- |
| Resize | Card, panel, or container size changes. |
| Number update | KPI/count/price digit changes. |
| Badge appear | Notification dots, status badges, small overlays. |
| Text swap | In-place label or status text changes. |
| Dropdown | Anchored menu/popover opening from a trigger. |
| Modal/sheet | Centered dialog or edge sheet open/close. |
| Panel reveal | Region-level drawer, inspector, or filter panel. |
| Page/list-detail | Step transitions, list-to-detail, back/forward. |
| Icon swap | Spinner-to-check, menu-to-close, theme icon changes. |
| Success | Completed save/payment/upload/checkmark moment. |
| Stack hover | Avatar/chip/card row with neighbor falloff. |
| Error shake | Invalid field/PIN feedback paired with text error. |
| Input clear | Search/filter clear with value dissolve. |
| Skeleton reveal | Placeholder to loaded content. |
| Shimmer/pulse | Temporary loading text or skeleton only. |
| Tabs/segmented | Moving active pill or underline. |
| Tooltip | Hover/focus hint, quick in and quick out. |
| Text reveal | Hero, empty-state, onboarding, or section intro rhythm. |
| Hover lift/tilt | Marketing/product cards; keep operational apps subtle. |
| Morph trigger | FAB/plus/button expands into its own menu. |
| Accordion | FAQ/filter/settings disclosure expand/collapse. |

When two patterns fit, choose the lighter one: dropdown before modal, resize before panel, icon swap before a success celebration.

## Token Baseline

Prefer existing tokens. If none exist, add only what the change needs:

- Durations: `--motion-duration-micro: 80ms`, `--motion-duration-quick: 150ms`, `--motion-duration-fast: 220ms`, `--motion-duration-medium: 320ms`, `--motion-duration-slow: 420ms`.
- Easings: `--motion-ease-out: cubic-bezier(0.22, 1, 0.36, 1)`, `--motion-ease-in-out: cubic-bezier(0.65, 0, 0.35, 1)`, `--motion-ease-linear: linear`.
- Distances: `--motion-distance-xs: 4px`, `--motion-distance-sm: 8px`, `--motion-distance-md: 12px`, `--motion-distance-lg: 24px`.

Map by usage, not numeric closeness. A modal close should use the modal-close token even if an old value is "close enough."

## Rules

- Animate `transform`, `opacity`, and `filter` by default. Avoid layout-heavy motion unless the pattern requires it, such as accordion grid rows.
- Never use `transition: all`; list exact properties.
- Keep most UI motion between 150-300ms. Use slower motion only for page/hero reveals or loading transitions.
- Add `@media (prefers-reduced-motion: reduce)` for every new animation. Reduced motion should preserve the state change without movement.
- Operational portal/admin/kiosk surfaces need quiet motion. Marketing/customer sites may use richer motion when it supports comprehension or conversion.
- Do not animate fake proof, invented metrics, or decorative loops. Shimmer/pulse must stop when real content arrives.
- State classes must clean up after close/replay. Force reflow only when needed to replay a CSS animation.
- Validate keyboard/focus behavior after motion changes; a pretty transition that traps focus is a bug.

## Apply Steps

1. Scan existing tokens, component patterns, and motion libraries.
2. Pick one catalog pattern and the smallest affected file set.
3. Implement with CSS state classes, Vue `<Transition>`, or existing library primitives.
4. Tokenize duration/easing/distance values.
5. Add reduced-motion handling and preserve accessibility states.
6. Verify desktop/mobile, hover/focus/active/disabled/loading/error/success as relevant, and report any skipped visual check.

## Avoid

- Global animation libraries for one interaction.
- Rewriting a component just to add a transition.
- Scroll-jacking, parallax by default, motion that delays input, or hidden content that appears only after animation.
- One-off raw cubic-beziers scattered through component CSS.

