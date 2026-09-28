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
  lastVerified: 2026-07-01
  stalenessSLA: 90
  relatedDocs:
    - .github/skills/dcs-ui-ux/SKILL.md
    - .github/skills/site-design-system/SKILL.md
    - .github/instructions/frontend-common.instructions.md
  codeRefs:
    - packages/dcs-ui/src/styles/motion.css
    - packages/cms/src/plugins/motionTokens.ts
  updateTriggers:
    - Frontend motion standards change
    - DCS design system tokens change
    - Customer-site guidance sync changes
---
<!-- Delivered from the dcs-again monorepo by cli/ai-guidance/sync-site-guidance.ps1. Do not edit here; edit the canonical source in dcs-again/.github and re-run the sync. -->

# DCS Product Motion

Use purposeful motion to make state changes legible. Keep it fast, tokenized, accessible, and native to the surface.

The catalog, decision rules, and pitfalls below are adapted from the [transitions.dev](https://transitions.dev) motion catalog (21 transitions by Jakub Antalik) and its `reveal/review/apply/refine` workflow. DCS **absorbs the techniques and the token vocabulary** into our Vue 3 + Tailwind v4 + shadcn-vue/reka-ui idiom; we do **not** vendor its vanilla `t-*` snippets (they carry no explicit license and assume imperative DOM/JS). A developer who wants the literal reference snippets can install them locally with `npx skills add Jakubantalik/transitions.dev` — but ship DCS motion through the tokens and patterns here.

## Load With

- Load `dcs-ui-ux` first for the surface brief and quality gates.
- Load `site-design-system` plus the site-local design skill for customer/prospect/demo sites.
- Reach for existing CSS, Tailwind utilities (`tw-animate-css` is imported in every app), Vue `<Transition>`, or the reka-ui/shadcn-vue primitive's own `data-[state]` hooks before adding a motion library.

## Motion tokens (real, shared)

The `--motion-*` tokens are a **real global layer** now — not a "define if missing" suggestion:

- **Platform apps** (`portal`, `admin`, `web`, `kiosk`) import them once at the top of `src/index.css`: `@import "@dcs/ui/motion.css";` (source of truth: `packages/dcs-ui/src/styles/motion.css`).
- **Customer sites** receive the same `:root` block automatically, injected into `<head>` by the always-on cms `dcsContentPlugin` (`packages/cms/src/plugins/motionTokens.ts`). A site's own `:root` (theme `tailwind.css` / `style.css`) can still override any token for its brand tempo.

Reference them with `var(--…)`, e.g. `transition: transform var(--motion-duration-fast) var(--motion-ease-out);`. **Match a value to its USAGE, not the nearest number** — a 300ms modal close maps to `--motion-duration-quick` because it *is* a modal close.

**Durations**

| Token | Value | Usage |
| --- | --- | --- |
| `--motion-duration-stagger` | `40ms` | per-item stagger offset |
| `--motion-duration-micro` | `80ms` | tooltip/path delay, shake segment, hairline hovers |
| `--motion-duration-quick` | `150ms` | modal/dropdown close, text swap, tooltip appear |
| `--motion-duration-fast` | `250ms` | icon swap, dropdown/modal open, tabs slide, page slide |
| `--motion-duration-medium` | `350ms` | panel close, toast close |
| `--motion-duration-slow` | `400ms` | panel open, skeleton content reveal, input clear |
| `--motion-duration-very-slow` | `500ms` | emphasis: badge appear, text reveal, success check |

**Easings**

| Token | Value | Usage |
| --- | --- | --- |
| `--motion-ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | default: open/close/slide/resize/position change |
| `--motion-ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | symmetric: icon/text swap, skeleton reveal |
| `--motion-ease-linear` | `linear` | shimmer, skeleton pulse, spinner |
| `--motion-ease-bounce` | `cubic-bezier(0.34, 1.36, 0.64, 1)` | gentle overshoot: badge dot pop |
| `--motion-ease-bounce-strong` | `cubic-bezier(0.34, 3.85, 0.64, 1)` | springy return: avatar/chip hover-out |

**Distances** (`--motion-distance-xs 4px`, `-sm 8px`, `-md 12px`, `-lg 24px`) — enter/exit travel, settles to 0.
**Scales** (`--motion-scale-lg 0.96` modal, `-md 0.97` dropdown open, `-sm 0.98` tooltip, `-xs 0.99` dropdown close) — the non-resting scale a surface animates FROM, settles to 1.
**Blur** (`--motion-blur-sm 2px`, `-md 3px` page/text reveal, `-lg 8px` success) — non-resting blur, settles to 0. A small cross-blur makes a short travel read as a full open.

`motion.css` also ships a **global reduced-motion baseline** that collapses transitions/animations to instant and stops loops. It is the safety net — individual components should still add their own richer `prefers-reduced-motion` handling where a state needs more than "make it instant." (The cms site inject ships **tokens only**, no baseline, so nothing leaks into a site's isolated `.<slug>-page` subtree.)

## Verbs

- `motion reveal`: list the catalog below (name + one-line use + tokens).
- `motion review`: read-only scan for ad-hoc `transition`/`animation`/`@keyframes`, hardcoded `ms`/`s`, raw `cubic-bezier(...)`, Tailwind arbitrary durations, and missing reduced-motion. Group findings by file; suggest one catalog pattern + the token per hit.
- `motion apply [pattern]`: pick the smallest fitting pattern, give a one-line rationale, then edit only the needed files. If the request came from a review suggestion, confirm before editing.
- `motion refine`: replace hardcoded timing/easing/scale/blur with the `--motion-*` tokens whose **usage** matches (not the nearest number). Leave a value untouched if no token usage fits.

## Decision rules (match the element, then the verb)

- **Trigger + small dot floating on top** → badge appear.
- **Trigger + surface that grows from it** → dropdown (anchored, origin-aware) or modal/sheet (centered/edge, no anchor).
- **Surface sliding into a region of the page** → panel reveal.
- **Two screens, list ↔ detail or step 1 ↔ step 2** → page/list-detail.
- **Element changes width/height** → resize.
- **Element's text changes in place** → text swap. **A number updates** → number update.
- **Two icons in the same slot** → icon swap.
- **Confirmation / "done" moment** (payment, upload, save) → success. Pair with icon swap if going spinner→check.
- **Hovering an item in a horizontal stack** (avatars, chips, tags) → stack hover.
- **Form validation error / "this is wrong"** → error shake (always paired with a text error).
- **Clearing a text field** → input clear (heavy; marketing/search only).
- **Placeholder → real content** → skeleton reveal. **"Thinking"/streaming text** → shimmer/pulse.
- **Small set of mutually-exclusive options with a moving highlight** → tabs/segmented.
- **Hover/focus hint over a trigger** → tooltip.
- **Stacked headline + supporting line entering with rhythm** → text reveal.
- **Card/tile reacting in 3D to the pointer** → hover tilt (marketing only).
- **Circular trigger that becomes the surface it opens** → morph trigger. If the surface is a separate popover that merely grows from the trigger, use dropdown.
- **Header + collapsible body growing/shrinking in height** → accordion.

When two patterns fit, choose the lighter one: dropdown before modal, resize before panel, icon swap before a success celebration. **No clear match → run `motion reveal` and let the user pick; don't guess.**

## Catalog

Each pattern's "technique" is the DCS way to build it. `JS?` means orchestration beyond a class/attribute toggle is required.

| Pattern | Use for | Technique (DCS) | Tokens | JS? |
| --- | --- | --- | --- | --- |
| Resize | Card/panel/container size change | `transition: width/height`; toggle a state class | medium, ease-out | no |
| Number update | KPI/price/count digit change | per-digit `@keyframes` pop-in (blur+translate) with `data-stagger`; reflow to replay | very-slow, blur-sm, stagger | yes |
| Badge appear | Notification dot/status badge | animate the **dot** (scale/opacity/blur), never the trigger; bounce pop; `data-open` | very-slow, ease-bounce, blur-sm | no |
| Text swap | In-place label/status change | 3-phase: exit up+blur → swap text → enter-from-below (reflow between) | quick, distance-xs, blur-sm | yes |
| Dropdown | Anchored menu/popover | `transform-origin` at trigger; scale `-md`→1 + opacity; `.is-closing` cleanup. **Prefer reka `DropdownMenu`/`Popover` `data-[state]`** | fast/quick, scale-md/xs, ease-out | rarely |
| Modal/sheet | Centered dialog / edge sheet | scale `-lg`→1 + opacity; close dips + cleanup. **Prefer reka `Dialog`/`Sheet` `data-[state]`** | fast/quick, scale-lg, ease-out | rarely |
| Panel reveal | Drawer/inspector/filter region | translateY + opacity + cross-blur on one duration so a short travel reads full | slow/medium, distance-lg, blur-sm | no |
| Page/list-detail | Step / list↔detail / back-forward | two absolute pages, `data-page` flips; exit ± X + blur | fast, distance-sm, blur-md | yes |
| Icon swap | Spinner↔check, menu↔close, sun↔moon | stack both in one `inline-grid` cell (`grid-area:1/1`); cross-fade+blur+scale on `data-state` | fast, blur-sm, ease-in-out | no |
| Success | Save/payment/upload "done" | compose fade+rotate+Y-bob+SVG stroke-draw `@keyframes`; reflow to replay | very-slow, blur-lg, ease-out/bounce | yes |
| Stack hover | Avatar/chip/tag row w/ falloff | distance-falloff lift; set `transition-timing-function` inline **before** writing `--shift`/`--scale` (ease-in in, bounce-strong out) | (dur 320ms), ease-bounce-strong | yes |
| Error shake | Invalid field/PIN | per-segment `@keyframes` with per-stop `animation-timing-function`; `.is-error`/`.is-shaking` orthogonal; reflow to replay; auto-revert timer | micro, distance-sm, ease-out | yes |
| Input clear | Search/filter clear dissolve | per-frame rAF (mirror flies down+blur, placeholder falls in, per-word radial-gradient streak). Heavy — marketing/search only | slow, blur-sm | yes |
| Skeleton reveal | Placeholder → loaded content | stack skeleton+content; cross-fade+cross-blur on `.is-revealed`; pulse the children, not the wrapper | slow, blur-sm, ease-in-out/linear | yes |
| Shimmer/pulse | Loading/"thinking" text only | `::before` gradient masked to glyphs via `background-clip:text`, animate `background-position`. **Must stop when real content arrives** | (2000ms), ease-linear | no |
| Tabs/segmented | View switcher / filter segments | measure active tab `offsetLeft/Width` onto a pill; first paint + resize **without** transition. **reka `Tabs`** for a11y | fast, ease-out | yes |
| Tooltip | Hover/focus hint | asymmetric: delay in, instant out (delay only in the hover rule); wrap is the hover target. **reka `Tooltip`** | quick/micro, scale-sm, ease-out | no |
| Text reveal | Hero/empty-state/onboarding intro | staggered blurred rise via per-line `transition-delay`; decoupled quiet fade-out (no reverse) | very-slow, distance-md, blur-md, stagger | rarely |
| Hover lift/tilt | Marketing/product cards | 3D `rotateX/Y` from pointer on a **flat outer wrapper**; cursor glare radial-gradients (screen blend); pointer-only, flatten on reduced-motion | (return 1000ms), ease-out | yes |
| Morph trigger | FAB/+ grows into its own menu | box grows w/h + radius into a panel; plus cross-fades/rotates out, menu slides in; open/close use different eases; `overflow:hidden` | (350/250ms), scale-md, blur-sm | yes |
| Accordion | FAQ/filter/settings disclosure | `grid-template-rows: 0fr↔1fr` (no JS height measuring); inner clips overflow + owns padding; chevron `scaleY(-1)`. **reka `Accordion`** | fast, ease-out, blur-sm | minimal |

## Adapting to DCS Vue / Tailwind / shadcn-vue

- **Use the reka-ui/shadcn-vue primitive first.** `Dialog`, `Sheet`, `DropdownMenu`, `Popover`, `Accordion`, `Tabs`, `Tooltip`, `HoverCard` already own focus trapping, ARIA, and Escape/outside-click. They expose `data-[state=open|closed]` (and `data-side`) — drive motion off those states with token-based transitions or `tw-animate-css` utilities. **Do not rebuild a primitive just to animate it**, and don't reimplement the open/close-cleanup dance the reference snippets need — reka manages presence for you.
- **For your own enter/leave, use Vue `<Transition>` / `<TransitionGroup>`** with token-driven `*-enter-active`/`*-leave-active` + `*-enter-from`/`*-leave-to` classes. Vue owns the lifecycle, so you avoid the manual reflow/`setTimeout` cleanup the vanilla snippets use.
- **For measure / rAF / pointer effects** (tabs pill, number pop-in, tilt, input clear), use a small composable + template `ref`s; read tokens with `getComputedStyle(el).getPropertyValue('--motion-…')` so JS timing tracks the CSS values.
- **Animate `transform`, `opacity`, `filter`** by default; add `will-change` for the animated properties; enumerate exact properties — **never `transition: all`**.
- **Operational surfaces** (portal/admin/kiosk) stay quiet and quick. **Marketing/customer sites** may use the richer patterns (tilt, glare, morph, text reveal) when they aid comprehension or conversion.

## Rules

- Keep most UI motion in the quick→fast band (150–250ms). Use slower tiers only for panels, page/hero reveals, loading, and earned success moments.
- Every new animation respects reduced motion: the global baseline makes it instant; add a per-component `prefers-reduced-motion` block when "instant" isn't enough (e.g. also hide a decorative layer). Reduced motion must still complete the state change.
- Do not animate fake proof, invented metrics, or decorative loops. Shimmer/pulse must stop when real content arrives; infinite marquees must stop under reduced motion.
- State classes/attributes must clean up after close/replay. Force a reflow (`void el.offsetWidth`) only when replaying a CSS animation from a visible state.
- Validate keyboard/focus after motion changes — a pretty transition that traps focus or hides content until it finishes is a bug.

## Apply steps

1. Scan for the existing reka/shadcn primitive, the `--motion-*` tokens, and any local pattern before writing new CSS.
2. Pick one catalog pattern and the smallest affected file set.
3. Implement with the primitive's `data-[state]`, Vue `<Transition>`, or token-driven CSS state classes.
4. Reference `--motion-*` tokens for duration/easing/distance/scale/blur — no raw `cubic-bezier`/`ms` in component CSS.
5. Confirm reduced-motion behavior and preserve accessibility states (focus, ARIA, labels).
6. Verify desktop/mobile and the relevant interaction states (hover/focus/active/disabled/loading/error/success); report any skipped visual check.

## Common pitfalls

- **Forgetting the reflow** on replay (text swap, number update, success replay, error shake) — `void el.offsetWidth` between removing and re-adding the state class is what restarts a CSS animation. (Vue `<Transition>` avoids this; hand-rolled classes don't.)
- **Skipping the close-state cleanup** on a hand-rolled dropdown/modal — without removing `.is-closing` after the close duration, the next open jumps from the closing scale. (Use the reka primitive and this disappears.)
- **Animating the container instead of the inner piece** — for a badge animate the dot, not the trigger; for page slide animate the page sections, not the wrapper.
- **`transition: all`** — always enumerate exact properties so unrelated style changes don't ride in for free.
- **Hardcoding the success check `stroke-dasharray`** — set it from `path.getTotalLength()` (rounded up by 1) or the stroke pre-reveals/over-draws.
- **Stack-hover timing** — set `transition-timing-function` inline *before* writing `--shift`/`--scale`, so ease-in plays on the way up and `--motion-ease-bounce-strong` on the return, without a second class.
- **Input-clear glow in dark mode** — flip `mix-blend-mode: multiply` → `screen` and paint white gradients, or it vanishes on a dark surface.
- **Tabs pill first paint/resize** — write the pill's `transform`+`width` with `transition: none` (reflow, restore) or it animates in from `translateX(0)`/`width:0`.
- **Card tilt hit area** — bind `pointermove` to the flat outer wrapper, not the tilting element, or the rotating edges slip under the cursor and hover flickers.
- **Accordion** — put padding on the inner element, never the `0fr` grid track (a residual strip stops it fully closing); flip the chevron with `scaleY(-1)` + `vector-effect: non-scaling-stroke`, not a CSS `d:` path morph (Chromium-only).

## Avoid

- Global animation libraries for one interaction.
- Rewriting a component (or a reka primitive) just to add a transition.
- Scroll-jacking, parallax by default, motion that delays input, or content hidden until an animation finishes.
- One-off raw `cubic-bezier`/`ms` values scattered through component CSS instead of the `--motion-*` tokens.

