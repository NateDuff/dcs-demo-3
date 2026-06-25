---
name: dcs-ui-ux
description: Use when designing, refactoring, reviewing, or polishing UI/UX across DCS portal, admin, web, kiosk, and customer-site surfaces. Trigger for visual hierarchy, layout, responsive behavior, accessibility, interaction states, forms, navigation, dashboards, component styling, color/typography decisions, or any UI that feels unclear, generic, unprofessional, inaccessible, or hard to use.
metadata:
  docKind: skill
  docClass: guidance
  title: DCS UI/UX Craft
  status: Active
  owner: Nathan Duff
  created: 2026-06-24
  lastVerified: 2026-06-25
  stalenessSLA: 90
  relatedDocs:
    - .github/instructions/frontend-common.instructions.md
    - .github/skills/dashboard-replication/SKILL.md
    - .github/skills/site-design-system/SKILL.md
    - .github/skills/dcs-product-motion/SKILL.md
  codeRefs: []
  updateTriggers:
    - Frontend UI/UX standards change
    - DCS design system patterns change
    - Customer-site guidance changes
---
<!-- Delivered from the dcs-again monorepo by cli/ai-guidance/sync-site-guidance.ps1. Do not edit here; edit the canonical source in dcs-again/.github and re-run the sync. -->

# DCS UI/UX Craft

Use this as the cross-app craft layer before changing how a DCS interface looks, feels, moves, or is used. It complements the owning README and path instructions; it does not replace them.

Inspired by the MIT-licensed `nextlevelbuilder/ui-ux-pro-max-skill` reasoning flow and Hallmark-style anti-template craft checks, adapted for DCS constraints and product surfaces.

## Load Order

1. Read the owning area README (`portal/`, `admin/`, `web/`, `kiosk/`, or the site repo's local guidance).
2. Load `.github/instructions/frontend-common.instructions.md` for Vue/TypeScript app code.
3. Apply this skill for visual/interaction decisions.
4. Add narrower skills as needed:
   - `portal-admin-list-detail` for portal admin list/detail workflows.
   - `dashboard-replication` for charts, KPIs, analytics, and reporting.
   - `dcs-product-motion` for transitions, animation audits, motion tokens, and reduced-motion behavior.
   - `site-design-system` plus the site-local design skill for customer/prospect/demo sites.
   - `site-experience-review` when auditing a live site rather than implementing a scoped change.
   - `site-performance-audit` / `dcs-seo` for CWV and discoverability.

## Design Brief First

Before editing, write or mentally resolve this brief:

| Decision | Required answer |
| --- | --- |
| Surface | Portal/admin operational app, kiosk touch flow, DCS marketing web, customer site, dashboard, form workflow, or content/editorial surface |
| Audience | Who uses it, how often, and under what pressure |
| Primary job | The one action or decision the screen must make easier |
| Density | Compact scan-and-act, guided flow, immersive marketing, or touch-first |
| Pattern | List/detail, command center, dashboard cockpit, wizard, settings matrix, conversion page, product/service showcase, or content hub |
| Structure fingerprint | What makes this layout shape different from a generic hero -> cards -> CTA page or a default CRUD table |
| Evidence | Existing component/page references, live screenshots, analytics/support signal, or repo guidance |
| Anti-patterns | What this surface must avoid because of audience, brand, compliance, or device constraints |
| Validation | Viewports, states, browser path, and command gates to run before calling it done |

If the brief is ambiguous, inspect the codebase and existing screens first. Ask the user only for brand/product decisions that cannot be discovered locally.

## Priority Ladder

Resolve UI work in this order. Lower-priority polish never excuses higher-priority breakage.

1. **Accessibility:** contrast, semantic headings, labels, focus order, keyboard reachability, screen-reader names, and color-independent meaning.
2. **Touch and interaction:** 44px+ targets, visible press/hover/focus/disabled/loading states, no hover-only actions, clear hit areas.
3. **Performance and stability:** reserve image/async space, avoid layout shift, lazy-load non-critical media, animate only transform/opacity.
4. **Information hierarchy:** one primary action per surface, clear grouping, important content first on mobile, readable empty/error/permission states.
5. **Responsive layout:** no horizontal scroll at 375px, stable grids at 768/1024/1440, safe fixed/sticky offsets, no text overflow or overlap.
6. **Typography and color:** use semantic tokens, 16px+ body text on mobile, 1.4-1.7 body line height, readable line lengths, tabular numbers for data.
7. **Motion:** 150-300ms micro-interactions, purposeful cause/effect, reduced-motion support, no decorative motion that blocks use.
8. **Forms and feedback:** visible labels, errors beside fields, helper text for hard choices, submit progress, success/error recovery, destructive confirmation.
9. **Navigation:** predictable back/close behavior, shallow labels in customer language, deep links where relevant, no overloaded sidebars or nav drawers.
10. **Charts and data:** correct chart type, legends/tooltips, accessible colors, tabular numbers, sort/filter affordances, and truthful mock data.

## Surface Rules

### Portal, Admin, And Operational Tools

- Design for repeated use: quiet, scannable, dense, and predictable.
- Avoid marketing heroes, oversized decorative sections, floating section cards, and ornamental backgrounds.
- Prefer explicit task surfaces: tables, filters, tabs, split panes, side sheets, timeline panels, and compact summary rows.
- Keep one obvious primary action; make secondary/destructive actions visually subordinate and confirmation-gated.
- Show real states for loading, empty, error, permission denied, stale data, optimistic mutation, and unsaved changes.
- Use existing `@dcs/ui` / shadcn-vue primitives and `lucide-vue-next` icons before making new controls.

### Customer Sites And Marketing Surfaces

- Start from the site-local design skill and `.dcs` metadata; keep managed content/editor affordances intact.
- Make the brand, service, product, or place obvious in the first viewport.
- Use real or generated bitmap media where the user needs to inspect the offer; avoid abstract gradient-only heroes.
- Put CTAs near trust evidence: reviews, credentials, guarantees, location, service area, or examples of work.
- Keep page sections unframed unless the content is truly a repeated card/list item.
- Do not let portal/global framework chrome bleed into isolated page subtrees.

### Dashboards And Analytics

- Pick the dashboard type before choosing charts: executive summary, operations monitor, drill-down analysis, comparison, forecasting, or revenue/sales cockpit.
- Put KPI cards before charts only when they answer the user's first question.
- Use `dashboard-replication` for chart wrappers, colors, KPI cards, and table patterns.
- Keep chart copy factual: chart title = what, description = why it matters, tooltip = exact value/context.
- Use tabular numbers, clear units, coherent totals, and accessible color mappings.

### Kiosk And Touch-First Flows

- Optimize for speed, reach, and recovery: large controls, minimal typing, obvious next/back, strong confirmation.
- Keep fixed bottom actions above safe areas and away from OS gesture zones.
- Prefer guided single-purpose screens over dense admin-style layouts.
- Provide offline/error states that tell staff exactly what to do next.

## Visual Quality Gates

- Pre-flight the existing design DNA before editing: tokens, fonts, spacing, component primitives, image style, motion stance, and section rhythm.
- For marketing and customer-site pages, choose a clear structure fingerprint. Avoid shipping the same hero + three cards + CTA rhythm with new colors.
- Preserve truthful content. Do not invent metrics, testimonials, logos, locations, certifications, or case-study outcomes to make a layout feel premium.
- Use a coherent token system for color, radius, shadow, spacing, and type; do not scatter raw hex values through components.
- Do not bypass the token system mid-file. If a value is needed more than once, name it as a semantic token first.
- Avoid one-note palettes. DCS interfaces should not collapse into all-purple, all-beige, all-slate, or all-orange themes.
- Use one icon family and consistent stroke/size. Use Lucide where available; do not use emojis as icons.
- Keep cards at 8px radius or less unless the existing design system says otherwise.
- Do not nest cards inside cards or make whole page sections into floating cards.
- Do not draw fake browser, device, IDE, or code-window chrome unless the product really is that chrome. Use real screenshots/media or omit the frame.
- Use stable dimensions for boards, grids, counters, tiles, toolbars, and chart areas so state changes do not resize the layout.
- Never scale font size with viewport width. Do not use negative letter spacing.
- Make compact panel headings compact; reserve hero-scale type for true heroes.
- Ensure text fits its container at mobile and desktop sizes; wrap before truncating, and provide a tooltip/expanded path when truncation is necessary.

## Interaction Gates

- Every clickable visual element must be a real button/link/control with an accessible name.
- Async actions disable or guard duplicate submissions and show progress within 300ms.
- Interactive components need explicit default, hover, focus-visible, active, disabled, loading, error, and success behavior when those states can occur.
- Destructive actions need confirmation, undo, or a clear recovery path.
- Modal/sheet close behavior must preserve unsaved work or warn before losing it.
- Keyboard focus moves into dialogs/sheets and returns to the trigger on close.
- Toasts do not steal focus; important feedback also appears near the affected control when practical.

## Pre-Delivery Checklist

- [ ] The design brief decisions are resolved or explicitly called out.
- [ ] Existing local components and patterns were reused before new abstractions were added.
- [ ] Loading, empty, error, permission, success, disabled, and destructive states are represented.
- [ ] The surface avoids generic template rhythm and does not rely on invented proof.
- [ ] Mobile, tablet, and desktop layouts have no overlap, horizontal scroll, clipped text, or hidden fixed-bar content.
- [ ] Contrast, labels, focus states, keyboard paths, and reduced-motion behavior are acceptable.
- [ ] Motion follows `dcs-product-motion`: purposeful, tokenized, reduced-motion safe, and mostly transform/opacity with 150-300ms timing.
- [ ] Visuals use semantic tokens, one icon language, and no accidental one-hue theme.
- [ ] Browser screenshots or live inspection were used for user-facing UI changes.
- [ ] The owning app/site validation commands from its README were run or the skip reason is reported.

