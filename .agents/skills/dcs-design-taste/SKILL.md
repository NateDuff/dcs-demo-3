---
name: dcs-design-taste
description: Use when designing, building, or redesigning a customer-facing marketing/landing surface in DCS — the marketing site (web/), customer/prospect/demo sites, nateduff.com, kiosk-landing, game landing/learn pages, blog/portfolio pages, or portal login/onboarding moments. Trigger for design direction, hero/section composition, "make it look less AI/templated", anti-slop review, taste, premium polish, or any greenfield page or redesign. Product UI (portal/admin views, dashboards, forms-heavy workflows) stays with dcs-ui-ux; this owns the taste layer for pages that sell or persuade.
metadata:
  docKind: skill
  docClass: guidance
  title: DCS Design Taste (Anti-Slop Frontend)
  status: Active
  owner: Nathan Duff
  created: 2026-07-04
  lastVerified: 2026-07-04
  stalenessSLA: 90
  relatedDocs:
    - .github/skills/dcs-ui-ux/SKILL.md
    - .github/skills/dcs-product-motion/SKILL.md
    - .github/skills/site-design-system/SKILL.md
    - .github/skills/site-experience-review/SKILL.md
    - .github/skills/dcs-seo/SKILL.md
    - .github/skills/dcs-design-taste/references/tasteskill-v2-upstream.md
  codeRefs: []
  updateTriggers:
    - Upstream taste-skill releases v2.0.0 stable (re-diff against the pinned ref in references/tasteskill-v2-upstream.md)
    - DCS frontend stack or design-token system changes
    - New customer-facing surface class added to the platform
---
<!-- Delivered from the dcs-again monorepo by cli/ai-guidance/sync-site-guidance.ps1. Do not edit here; edit the canonical source in dcs-again/.github and re-run the sync. -->

# DCS Design Taste (Anti-Slop Frontend)

Adapted for DCS from the MIT-licensed `Leonxlnx/taste-skill` v2 (`design-taste-frontend`), pinned at upstream commit `b17742737e796305d829b3ad39eda3add0d79060` (2026-07-05). The upstream text is **not vendored here** — `references/tasteskill-v2-upstream.md` is a pointer carrying the attribution, the pinned ref, and two retrieval commands (upstream raw URL, or `git show` of the last commit that held the full 88,088 B copy). **Upstream is React/Next.js-centric; on any conflict, this file and the DCS stack win.**

> Scope: landing pages, marketing sites, portfolios, blogs, customer-site pages, redesigns. NOT dashboards, data tables, or multi-step product UI — those belong to `dcs-ui-ux`, `dashboard-replication`, and `portal-admin-list-detail`. Every rule below is **contextual**: read the brief first, then pull only what fits.

## Load Order

1. Owning area README (`web/`, the site repo's local guidance, or the portal area README for marketing-adjacent portal surfaces).
2. `site-design-system` + the site-local design skill for customer/prospect/demo sites (brand tokens win).
3. This skill for design direction, composition, and the anti-slop gate.
4. `dcs-product-motion` for motion implementation (tokens, reduced-motion, catalog). `dcs-product-sound` if sound is in scope.
5. `dcs-seo` before restructuring any page that already ranks.

Division of labor with `dcs-ui-ux`: that skill is the cross-app craft layer for product UI (hierarchy, a11y, states, forms, navigation). This skill is the taste layer for pages that sell, present, or persuade. The universal locks below (contrast, consistency locks, AI tells, copy audit) apply everywhere; the composition rules (hero, sections, bento, marquee) apply to marketing-class surfaces.

---

## 0. Brief Inference (Read the Room Before Anything Else)

Before touching code or dials, infer what is actually wanted. Most LLM design output is bad because the model jumps to a default aesthetic instead of reading the room.

**Read these signals first:**
1. **Page kind** — landing (SaaS / local-business / agency / event), portfolio, redesign (preserve vs overhaul), editorial/blog, game landing.
2. **Vibe words** used — "minimalist", "calm", "Linear-style", "premium", "playful", "serious B2B", "editorial", "flat and calm" (the DCS marketing-site house vibe).
3. **Reference signals** — URLs linked, screenshots pasted, competitors named.
4. **Audience** — the audience picks the aesthetic, not your taste. A HIPAA-adjacent local business needs trust-first; a game landing page can be playful.
5. **Brand assets that already exist** — for DCS surfaces these are NOT optional input: the DCS brand kit (web/), the site repo's brand tokens + `.dcs` metadata (customer sites), the nateduff.com personal brand kit. Extract before designing.
6. **Quiet constraints** — accessibility-first audiences, regulated industries (health, legal), trust-first commerce. These OVERRIDE aesthetic preference.

**Output a one-line Design Read before generating:** *"Reading this as: \<page kind> for \<audience>, with a \<vibe> language, leaning toward \<aesthetic family>."*

If the design read genuinely diverges, ask exactly **one** clarifying question — never a multi-question dump. If you can confidently infer, declare the read and proceed.

**Anti-default discipline:** do not default to AI-purple gradients, centered hero over dark mesh, three equal feature cards, glassmorphism on everything, infinite micro-animations, Inter + slate-900. These are the LLM defaults. Reach past them deliberately.

---

## 1. The Three Dials

After the design read, set three dials. Every layout, motion, and density decision below is gated by these. State them explicitly; never silently use the baseline.

* `DESIGN_VARIANCE` — 1 = perfect symmetry, 10 = artsy chaos
* `MOTION_INTENSITY` — 1 = static, 10 = cinematic/physics
* `VISUAL_DENSITY` — 1 = art gallery/airy, 10 = cockpit/packed

| DCS surface / signal | VARIANCE | MOTION | DENSITY |
|---|---|---|---|
| DCS marketing site (`web/`, "flat and calm") | 5-6 | 3-4 | 3-4 |
| Customer local-business site (trust-first) | 4-5 | 2-3 | 4 |
| Customer site, design-forward brand | 7-8 | 5-7 | 3-4 |
| Portfolio / nateduff.com | 6-7 | 4-6 | 3-4 |
| Game landing / learn page (euchre) | 7-8 | 6-8 | 3-4 |
| Editorial / blog | 6 | 3-4 | 3 |
| "minimalist / clean / calm / Linear-style" | 5-6 | 3-4 | 2-3 |
| "premium / luxury / brand" | 7-8 | 5-7 | 3-4 |
| Redesign — preserve | match existing | +1 | match existing |
| Redesign — overhaul | +2 | +2 | match existing |

Mobile override: for VARIANCE 4-10, asymmetric layouts MUST collapse to strict single-column (`w-full px-4`) below 768px, declared explicitly per section.

---

## 2. DCS Stack Mapping (replaces upstream's React/Next.js defaults)

The upstream skill assumes React/Next.js + Motion + GSAP. DCS surfaces do not. Use the house stack; never introduce upstream's stack because the reference code shows it.

* **Framework:** Vue 3 + Vite (VitePress for customer sites where already in place). No React, no Next.js.
* **Styling:** Tailwind v4 utilities + design tokens. Customer sites: brand tokens through `site-design-system` (CSS isolation rules apply). Shared components from `@dcs/ui`.
* **Components:** shadcn-vue where a component library is warranted — **never in default state**; customize radii, colors, shadows, typography to the project aesthetic. One system per project.
* **Icons:** `lucide-vue-next` is the DCS standard (upstream discourages Lucide; its own "project already depends on it" override applies — we do, everywhere). Keep the transferable rules: **one icon family per project, standardized `stroke-width`, never hand-roll SVG icon paths.**
* **Motion:** `--motion-*` tokens via `@dcs/ui/motion.css`, Vue `<Transition>`/`<TransitionGroup>`, CSS scroll-driven animations, IntersectionObserver reveals. Load `dcs-product-motion` for implementation. GSAP/Three.js only with explicit justification for a scrolltelling brief, isolated in a leaf component with cleanup, and reduced-motion gated. **Never `window.addEventListener('scroll')`; never rAF loops that touch reactive state** — use CSS, observers, or a `requestAnimationFrame` loop writing to `style` refs only.
* **Fonts:** self-host with `@font-face` + `font-display: swap`. Never link Google Fonts via `<link>` in production. Brand-kit fonts win over aesthetic preference.
* **Images:** customer sites use CDN-managed images (ManagedImage / `content.yaml`, WebP) — new imagery goes through that pipeline, not raw asset drops. `https://picsum.photos/seed/{descriptive-seed}/{w}/{h}` is for local mockups only, never shipped.
* **Emoji policy:** discouraged in markup and visible text; use icon-library glyphs. Allowed only for an explicitly playful/social brief, sparingly.
* **Layout mechanics:** standard Tailwind breakpoints; contain pages with `max-w-7xl mx-auto` (or ~1400px); `min-h-[100dvh]` never `h-screen` for full-height heroes; CSS Grid over flexbox percentage math.
* **Dependency verification:** before importing any 3rd-party library, check `package.json`. If missing, surface the install first — and check `cost-awareness` instincts: prefer zero-dependency CSS solutions.

---

## 3. Design Engineering Directives (Bias Correction)

### 3.1 Typography
* Display: `text-4xl md:text-6xl tracking-tighter leading-none` as a starting point; body `text-base leading-relaxed max-w-[65ch]`.
* **Serif discipline:** serif is very discouraged as a default. Acceptable only when the brand kit names one, or the aesthetic is genuinely editorial/luxury/heritage AND you can articulate why this serif fits this brand. `Fraunces` and `Instrument Serif` are banned as defaults (the two LLM-favorite serifs). Emphasis inside a headline = italic or bold of the SAME family, never a serif word injected into a sans headline.
* **Italic descender clearance:** italic display words containing `y g j p q` clip under `leading-none`. Use `leading-[1.1]` minimum + `pb-1` reserve. Audit every italic display word.
* Brand kits win: DCS brand fonts on DCS surfaces, site tokens on customer sites.

### 3.2 Color
* Max 1 accent color; saturation < 80% by default. Neutral bases (zinc/slate/stone family already in the tokens) with one high-contrast accent.
* **The LILA rule:** AI-purple/blue-glow aesthetic banned as default. If the brand genuinely is purple, execute with intent — consistent palette, restrained gradients.
* **Color consistency lock:** one accent, locked, used identically across the WHOLE page. No blue CTA appearing in section 7 of a warm-grey site.
* **Premium-consumer palette ban:** for premium/artisan/wellness briefs, the beige+brass+oxblood+espresso "warm craft" palette is the AI default and banned as a reach. Rotate real alternatives (cold luxury, forest+bone+amber, black-and-tan, cobalt+cream, terracotta+slate, monochrome+one pop). Override only when the brand explicitly names those colors.
* One palette per project — no warm/cool gray mixing.
* No pure `#000000` / pure `#ffffff` — off-black and off-white; both modes designed from the start with WCAG AA (body) contrast; brand color stays recognisable in dark mode.

### 3.3 Layout
* **Anti-center bias:** centered hero avoided when VARIANCE > 4 — use split, left-content/right-asset, asymmetric whitespace. Centered is fine for editorial/manifesto briefs.
* **Hero discipline (hard rules):**
  - Hero fits the initial viewport: headline ≤ 2 lines desktop, subtext ≤ 20 words and ≤ 4 lines, CTA visible without scroll.
  - Font scale planned with the asset: `text-4xl md:text-5xl lg:text-6xl` for most heroes; `text-7xl+` only for 3-5-word headlines. A 4-line hero headline is a font-size error.
  - Top padding cap `pt-24` desktop.
  - Max 4 text elements: (eyebrow OR brand strip OR neither) + headline + subtext + CTAs (1 primary + max 1 secondary). No tagline under CTAs, no trust micro-strip, no pricing teaser inside the hero.
  - Logo wall / "trusted by" lives UNDER the hero, never inside it.
  - Hero needs a real visual. Text + gradient blob is a placeholder, not a hero.
* **Navigation:** single line at desktop, height ≤ 80px (default 64-72px).
* **Section-layout repetition ban:** a layout family (3-col cards, full-width quote, split text/image) appears at most ONCE per page; a page with 8 sections uses ≥ 4 different families.
* **Zigzag cap:** max 2 consecutive image+text split sections; the 3rd is a fail. Break with full-width, vertical stack, bento, or marquee.
* **Eyebrow restraint (the #1 violated rule):** small uppercase tracking labels above headlines — max 1 per 3 sections, hero counts. Mechanical check: count `uppercase tracking` instances; count ≤ ceil(sections / 3). Default fix: drop the eyebrow; the headline is enough.
* **Split-header ban:** "left big headline + right small floating explainer" as a section header is banned as default. Stack vertically, max-width 65ch.
* **Bento rules:** exactly N cells for N items (no filler tiles); rhythm not repetition; 2-3 cells need real visual variation (image, brand-appropriate gradient, pattern) — not all white-on-white text cards.
* **Shape consistency lock:** ONE corner-radius system per page (all-sharp, all-soft 12-16px, or all-pill for interactive), or a documented mixed rule followed everywhere.
* **Cards:** only when elevation communicates hierarchy; otherwise `border-t`, `divide-y`, or negative space. Shadows tinted to background hue, never pure black on light.

### 3.4 Interactive States (applies to ALL surfaces, product UI included)
* Full cycles always: loading (skeletons matching final layout, not spinners), empty (composed, shows how to populate), error (inline for forms, toasts only for transient), tactile `:active` (`scale-[0.98]` / `-translate-y-[1px]`).
* **Button contrast check:** every CTA readable against its background — WCAG AA 4.5:1 (3:1 for 18px+). Ghost buttons over photos need a scrim, backdrop, or stroke.
* **CTA wrap ban:** button labels fit one line at desktop; primary CTAs ≤ 3 words.
* **No duplicate CTA intent:** one label per intent per page. "Get in touch" + "Let's talk" + "Start a project" = three contact CTAs = fail. Pick one, use it in nav, hero, and footer.
* **Form contrast check:** inputs, placeholders, focus rings, helper and error text all pass AA against the section background. Label above input; no placeholder-as-label, ever.

### 3.5 Images & Visual Assets
* Landing pages are visual products. Text-only pages with fake-screenshot divs are slop; pure-text "minimalism" is incomplete work — even restrained pages need 2-3 real images.
* Priority: (1) image-gen tool if available in the session, at the section's aspect ratio; (2) real photography / the site's CDN-managed images; (3) clearly-labeled placeholder slots (`<!-- TODO: hero product photo, 1600x1200 -->`) + tell the user what is needed. Never fill with hand-rolled SVG illustration.
* **Div-based fake screenshots are banned** — fake task lists, fake dashboards, fake terminals built from styled divs. For DCS product previews use a REAL screenshot of the actual portal/product (we own it — screenshot it), a real embedded mini-component, or editorial photography.
* Logo walls: real SVG logos (Simple Icons / actual brand assets), rendering in both modes; logos only — no category labels under each logo.

### 3.6 Content Density & Copy
* Default section shape: headline ≤ 8 words + sub ≤ 25 words + one visual OR one CTA. Cut ruthlessly.
* No data-dump sections: top 3-5 highlights + "view all" link; > 5 items needs a better component than `<ul>` + `divide-y` (grouped chunks, card grid, tabs/accordion, scroll-snap pills, carousel, marquee). A 10-row spec list with a hairline under every row is the worst default.
* **Copy self-audit (mandatory before ship):** re-read every visible string. Flag and rewrite anything grammatically broken, unclear-referent, cute-but-wrong wordplay, or mock-poetic AI voice. Plain functional copy beats AI-clever copy.
* One copy register per page. Founder/DCS content is confident and capability-forward, not confessional.
* **Proof integrity (DCS house rule, non-negotiable):** never fabricate testimonials, customer quotes, client logos, team members, usage stats, or precision metrics on any DCS or customer surface. Numbers come from real data or are explicitly labeled mock in mockups that will not ship. Fake-precise specs (`4.1×`, `48k users`) invented for aesthetics are banned. Uptime/quality claims must be substantiated (legal-readiness rule).
* **No home-infrastructure names in public content** (SpartanMini etc.) — ever.
* Quotes/testimonials (when real ones exist): ≤ 3 lines of body, attribution = name + role (+ company), real typographic quotes or none.

### 3.7 Page Theme Lock
One theme per page. If dark, ALL sections are dark; no warm-paper section sandwiched mid-scroll. Section tints within the family are fine (`bg-zinc-950` next to `bg-zinc-900`); flipping to `bg-amber-50` is broken. Deliberate one-time "color block story" allowed only when the brief calls for it. Set the theme once at the page root; test both modes before finishing (customer sites: remember `localStorage.theme` + `.dark` gotcha when screenshotting).

---

## 4. Motion & Performance Guardrails

Implementation belongs to `dcs-product-motion` (tokens, catalog, review workflow). This skill enforces the taste gates:

* **Motion must be motivated:** every animation justifiable in one sentence — hierarchy, storytelling, feedback, or state transition. "It looked cool" is not a reason. If you cannot ship working motion in scope, drop the dial to 3 and ship clean static; never half-build motion.
* **Motion claimed = motion shown:** if MOTION_INTENSITY > 4, the page actually moves (hero entry, scroll reveals, CTA hover) — and everything above intensity 3 honors `prefers-reduced-motion`, collapsing loops/parallax/scroll-hijack to static. Customer sites embed in the portal editor iframe — the reduced-motion + iOS gating rules in the iframe gotcha apply.
* **Marquee max one per page.** Not every card needs an infinite loop; informational sections stay still.
* Animate `transform` and `opacity` only; `will-change` sparingly; grain/noise overlays only on fixed `pointer-events-none` elements; z-index only for systemic layers.
* Core Web Vitals before declaring done: LCP < 2.5s (hero image preloaded), INP < 200ms, CLS < 0.1 (space reserved for images/fonts). `site-performance-audit` measures live.

---

## 5. AI Tells (Forbidden Patterns)

The signatures of "trying to look designed." Hard bans unless the brief explicitly asks.

**Visual/CSS:** no neon/outer glows by default; no pure `#000`; no oversaturated accents; no gradient text on large headers; no custom cursors.

**Typography:** Inter-as-default avoided (fine for deliberately neutral/Linear-style or a11y-first briefs); no oversized screaming H1s — hierarchy via weight + color, not raw scale.

**Layout:** no three-equal-feature-cards row; no mathematically dead-even padding everywhere.

**Content ("Jane Doe" effect):** no generic names/avatars; no fake-perfect numbers (`99.99%`, `1234567`); no startup-slop brand names (Acme, Nexus, SmartFlow); no filler verbs (Elevate, Seamless, Unleash, Next-Gen, Revolutionize).

**Hero & sections:** no version labels in hero (`V0.6`, `BETA`, `EARLY ACCESS`) outside genuine launch briefs; no `Brand · No. 01` micro-meta; no section-number eyebrows (`001 · Capabilities`, `06 · how it works`); no `01 / 4` pagination labels on tiles; no scroll cues (`Scroll to explore`, animated mouse icons) — none.

**Separators & dots:** middle-dot (`·`) rationed to max 1 per metadata line, never the default separator for everything; zero decorative status dots — a colored dot only for real semantic state (live server status), max one per section.

**Typography flourishes:** no `<br>`-broken-and-italicized headline splits as a default move; no vertical rotated text; no crosshair/hairline grid lines as pure decoration.

**Marketing copy:** no "Quietly in use at" (use "Trusted by" / "Used at" or nothing); no performative-craftsman labels ("From the field", "On our desks", "Loose plates") — plain functional labels; no mock-humble asides; no weather/locale/time strips ("LIS 14:23 · 18°C") unless the brief is genuinely place- or timezone-centric; no micro-meta sentences under eyebrows; no generic step labels ("Stage 1 / Step 2 / Phase 03") — the verb IS the label ("Install", "Configure", "Ship").

**Pills & stamps:** no tag pills overlaid on images; no fake photo-credit captions (`Field study no. 12 · Ines Caetano`) — credit only real photographers; no version footers (`v1.4.2`, `Build 0048`) on marketing pages; no fake live-stock counters; no decoration text strips at hero bottom (`DESIGN · BUILD · SHIP`); no floating top-right corner paragraphs in section headers.

**Lists:** no `border-t` + `border-b` hairlines on every row; no filled-track progress bars as landing-page comparison visuals.

### 5.1 Em-dash ban (rendered page copy)

**The em-dash (`—`) is completely banned in user-visible page text** — headlines, eyebrows, pills, body copy, quotes, attribution, captions, button labels, alt text. It is the #1 LLM stylistic tell. No "sparingly" allowance: zero. Restructure with a period, comma, colon, or parentheses; ranges use a hyphen (`2018-2026`, `$40-80k`); attribution uses ` - ` or a line break. The en-dash (`–`) as separator is banned too. Scope: this governs **rendered site copy**, not code comments, commit messages, or internal docs.

---

## 6. Redesign Protocol

Misclassifying the mode is the biggest source of bad redesign output. Detect first: **greenfield**, **redesign-preserve** (modernize without breaking the brand), or **redesign-overhaul** (new visual language, content and IA preserved). If ambiguous, ask once.

**Audit before touching** (pair with `site-experience-review` for live evidence): brand tokens, IA + conversion paths, content blocks (working vs filler), patterns to preserve, patterns to retire, dial reading of the existing site (that's your starting point, not the baseline), and the **SEO baseline** — ranking pages, meta, structured data (`dcs-seo`; SEO migration is the #1 redesign risk).

**Preservation rules:** keep slugs, anchor IDs, and primary nav labels stable; extract brand colors before applying §3.2 (a purple brand stays purple); preserve copy voice unless a rewrite was asked; never regress a11y wins; never rename buttons/form fields/section IDs that analytics depend on. Customer-site form fields also have the 3-way schema sync (`site-forms`) — renames break more than analytics.

**Modernisation levers, in order — stop when the brief is satisfied:** 1) typography refresh, 2) spacing & rhythm, 3) color recalibration, 4) motion layer, 5) hero/key-section recomposition, 6) full block replacement (only when unsalvageable). IA/content/SEO sound → targeted evolution (levers 1-4) is ~70% of value at ~40% of risk.

**Never changes silently:** URL structure, primary nav labels, form field names/order, logo/wordmark, legal/consent copy.

---

## 7. Pre-Flight Check

Run before delivering. Not optional; any failed box means not done.

- [ ] Design Read declared; dial values explicit and reasoned (not silent baseline)?
- [ ] Brand tokens / brand kit extracted and used (site tokens, DCS kit, or nateduff kit)?
- [ ] ZERO em-dashes (`—`/`–`) in rendered page copy?
- [ ] Page theme lock: one theme, no mid-page inversion; both modes tested?
- [ ] Color consistency lock: one accent, identical across all sections?
- [ ] Shape consistency lock: one radius system?
- [ ] Every CTA and form element passes WCAG AA contrast; no CTA label wraps at desktop; no duplicate CTA intent?
- [ ] Serif only with explicit justification (never Fraunces/Instrument Serif by default); italic descenders cleared?
- [ ] Premium-consumer brief: palette is NOT the beige+brass+espresso family?
- [ ] Hero: ≤ 2-line headline, ≤ 20-word subtext, CTA above fold, ≤ 4 text elements, `pt-24` cap, real visual, logo wall below it?
- [ ] Nav single line, ≤ 80px?
- [ ] Eyebrow count ≤ ceil(sections/3); no section-number eyebrows; no split-header pattern; zigzag ≤ 2 consecutive; ≥ 4 layout families per 8 sections?
- [ ] Bento: exact cell count, background diversity?
- [ ] Long lists use a real component, not `<ul>` + `divide-y`; content density sane (≤ 25-word subs)?
- [ ] Real images (gen tool → CDN/real assets → labeled placeholders); NO div-based fake screenshots; NO hand-rolled decorative SVGs; product previews are REAL DCS screenshots?
- [ ] No AI tells from §5 (dots, pills-on-images, photo-credit decoration, version footers, locale strips, scroll cues, step labels, "Quietly in use at")?
- [ ] Copy self-audit done; proof integrity: zero fabricated testimonials/logos/stats/metrics; no home-infra names?
- [ ] Motion motivated, claimed = shown, marquee ≤ 1, reduced-motion honored, `transform`/`opacity` only, no scroll listeners?
- [ ] Empty/loading/error states provided; icons from `lucide-vue-next` only, one family, standardized stroke?
- [ ] `min-h-[100dvh]` not `h-screen`; mobile collapse explicit per multi-column section?
- [ ] One design system per project; shadcn-vue never in default state?
- [ ] CWV plausibly hit (LCP < 2.5s, INP < 200ms, CLS < 0.1)?
- [ ] Vue/Tailwind house stack only — no React/Next/Motion/GSAP imports introduced from upstream reference code?

---

## 8. Out of Scope → Route Instead

* Dashboards / analytics → `dashboard-replication` + `dcs-ui-ux`
* Portal/admin list-detail product UI → `portal-admin-list-detail` + `dcs-ui-ux`
* Data tables, multi-step wizards, editors → `dcs-ui-ux` (this skill won't make them better)
* Motion implementation details → `dcs-product-motion`; sound → `dcs-product-sound`
* SEO mechanics → `dcs-seo`; performance measurement → `site-performance-audit`

If the brief is one of the above, say so explicitly and apply only this skill's universal locks (§3.4, §5, copy audit) to those surfaces.

