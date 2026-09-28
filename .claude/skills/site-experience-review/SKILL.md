---
name: site-experience-review
description: "Use when holistically reviewing a DCS customer site for quality, conversion, credibility, accessibility, brand fidelity, and — critically — platform-capability gaps and site-owner-value ideas: every recurring site need becomes a DCS feature finding. Pairs with `site-performance-audit` (CWV) and `dcs-seo` (SEO); reads repo `.dcs` metadata + LIVE evidence (screenshots/console/network), and owns the rules for any browser session on a live customer site. Emits findings in the `.docs/plans/<topic>/index.html` standard."
metadata:
  docKind: skill
  docClass: guidance
  title: Site Experience Review
  status: Active
  owner: Nathan Duff
  created: 2026-06-24
  lastVerified: 2026-09-27
  stalenessSLA: 90
  relatedDocs:
    - .github/skills/dcs-ui-ux/SKILL.md
    - .github/skills/site-performance-audit/SKILL.md
    - .github/skills/dcs-seo/SKILL.md
  codeRefs:
    - cli/browser/no-write-guard.mjs
    - cli/live-site/guarded-session.mjs
    - cli/check-browser-launch-sites.mjs
  updateTriggers:
    - Customer-site review process changes
    - Platform capability lens changes
    - Frontend UI/UX standards change
---
<!-- Delivered from the dcs-again monorepo by cli/ai-guidance/sync-site-guidance.ps1. Do not edit here; edit the canonical source in dcs-again/.github and re-run the sync. -->

# DCS Customer-Site Experience Review (holistic, platform-aware)

The cross-cutting **holistic** review skill. Where `site-performance-audit` measures speed, `dcs-seo` measures discoverability, and `dcs-ui-ux` provides the general craft ladder, this skill judges whether the site **earns trust, converts visitors, and serves its owner** - and whether the things it needs should become **DCS platform features** instead of one-off site code.

> **The point of view that makes this valuable:** these sites are not bespoke one-offs — they are tenants of one platform (portal + server + cms). So a gap on one site is almost always a gap on all of them. When you find a need, ask first: *"Should the platform do this for every site?"* A recurring need is a **platform finding** (high leverage); a truly site-specific need is a **site-local finding**. Tag every recommendation accordingly.

---

## What these sites share (read before judging)

- **Managed content** via `.dcs/content.yaml` + the portal **visual editor** (text keys, managed images, managed forms). Edits flow site → portal CMS → preview → deploy; never hand-edit what the CMS owns.
- **DCS server APIs**: `site-auth/session` (visitor session), `revenue/config` (experience mode), `sites/{slug}/announcements/active` (announcements/specials), managed-form `POST` → Contact inbox, GA4 + App Insights analytics.
- **Identity** from committed `.dcs/site.yaml` (`site_slug`, `production_url`, NAP).
- **Two stacks**: Vue-SPA (`vite-ssg` prerender) or VitePress (SSG). Both behind Front Door / Azure SWA.
- **Preview/deploy**: push `release/**` → SWA preview env at `preview.duffcloudservices.com/{slug}/`; master/main → prod.

Knowing this, a reviewer can tell a *real* gap ("no way to capture a booking") from a *false* one ("no JSON-LD" — the cms factory bakes it; see `dcs-seo`).

## Live-site browser sessions (the no-write guard)

These rules govern every browser session that loads a live customer site: a review, contrast audit, screenshot, smoke or perf check, or judge re-measure. The module's API and stated limits: `cli/browser/README.md`. The `cli/` paths in this section are in the dcs-again monorepo; from a site clone, run them there.

1. **Launch through `launchGuarded({ allowGetHosts: [...] })`** from `cli/browser/no-write-guard.mjs`. It proves the block on its own 127.0.0.1 server before any site page loads.
2. **`allowGetHosts` lists the site's own hosts plus `api.duffcloudservices.com`** (its GETs render client-side parts such as the PHI note) **and `files.duffcloudservices.com`** (the managed-image CDN and the agent-widget script). Add `fonts.googleapis.com` and `fonts.gstatic.com` when the site loads Google Fonts, and `portal.duffcloudservices.com` (the widget's config fallback) when the widget matters. A shorter list renders a page visitors never see (JS27 F2, JS36 F1, W199).
3. **Leave live forms untouched: no typing, no clicks.** Render POST-gated states (the success message, the error lines) by DOM edit, or fulfil the POST on a local server (JS29). A site-forms TEST MODE submission is a separate, deliberate write, never part of these sessions; its runner, `cli/live-site/site-forms-test-mode.mjs`, lets exactly one marked POST leave and refuses a non-loopback target without `--live`.
4. **End with `observer.assertNoWrites()`.**
5. **Workers are covered (C-1918 leg 3, WS48 2b2cbf62e, judged PASS by JP7 2026-09-27): the `new Worker` grep-and-STOP is lifted.** Dedicated, module, blob:, data:, nested and iframe-started workers are held and guarded in bursts of 25 (0 of 15,700 unguarded). Run headless only; `launchGuarded` refuses headed mode, because headed Chromium opens a FedCM write channel. What still leaves the page is GET-only: a speculation-rules prefetch to an unlisted host lands and is caught only afterwards by `assertNoWrites()`; GETs to listed hosts can carry data in the URL; method-override headers on a GET are not inspected. Reporting/NEL, worklets and `PaymentRequest` are not claimed. Import the guard from a pinned COMMITTED copy (`git show <sha>:cli/browser/no-write-guard.mjs`), never the working tree (JS39).
6. **Leave out `--disable-features=KeepAliveInBrowserMigration`**; the module refuses it. The in-page init script (L1) is the only guard for unload and beacon traffic.
7. **Contrast reads its backdrop from live pixels**, never from a colour in an earlier record. Judge every state (rest, hover, focus, error, success) at 390 and 1440, plus full-viewport scroll positions over fixed art.

`cli/contrast-audit.mjs`, `cli/site-perf-audit.mjs` and the portfolio `capture.mjs` launch through `launchGuarded` (C-1927, `cli/live-site/guarded-session.mjs`). They refuse to start unless `git status --short cli/browser/` is empty. Add a host with `--allow-get-host`. Their guard report counts refused third-party GETs without failing; exit 4 means the page tried a write to a listed host, 5 that a write got out. chrome-devtools-mcp and playwright-cli launch outside rule 1: point them at a local build.

The demo snapshot capture, `website-analyzer-v2`, the served-honesty probe's P1 and the lane-J audit launch the same way (C-1942). `capture-footage` and `app-review-recorder` type and click, so they refuse a non-local host (exit 6, `cli/local-target.mjs`); a walkthrough on a live site is a deliberate, owner-visible session, never a run of either. `node cli/check-browser-launch-sites.mjs` (Docs governance) fails any new raw browser launch outside this launcher; a local-only tool needs a census row with its reason (it also counts DevTools-port attach doors, C-1947).

The owner's manual-login browser (`node open-browser.js`, repo root) is owner-only. Its `BROWSER_CDP_PORT` opt-in is for local dev: it refuses a non-local start URL (exit 6), uses its own empty profile, and closes the browser (exit 6) on any non-local page. An agent never attaches to the owner's live-portal session.

---

## The seven review lenses (one checklist each)

Score each finding: **Impact** (revenue/trust/UX) × **Effort** (S/M/L) × **Scope** (`platform` | `site-local`).

### 1. Conversion & calls-to-action
- [ ] Is the **primary action** (book / call / quote / buy) obvious above the fold on mobile, and repeated at natural decision points?
- [ ] Phone number tap-to-call; address click-to-map; forms short and reachable.
- [ ] For service businesses: is there a **booking/lead path** at all, or only a contact form? (Recurring → platform booking finding.)
- [ ] Trust proximity: reviews / credentials / guarantees near the CTA, not buried.

### 2. Credibility & content
- [ ] Real reviews/testimonials (with names/sources) — not invented. Honest claims only (legal-sweep rule: no unverifiable superlatives).
- [ ] Clear "who/what/where/price-signal." Service-area and NAP consistent with `.dcs`.
- [ ] Photography quality and relevance (real work, not stock where it matters). Hi-res originals present for galleries.
- [ ] Freshness signals: recent dates, current offers via portal Announcements (not stale hardcoded copy).

### 3. UX & information architecture
- [ ] Nav is shallow and labeled in customer language; no dead/placeholder routes.
- [ ] Mobile nav works (no double-tap hamburger; brand link doesn't escape preview subpath — known SPA gotchas).
- [ ] Forms validate and confirm submission (managed-form silent-accept means the user must still see a success state).
- [ ] Empty/error/loading states are handled, not blank.
- [ ] Touch targets, focus states, heading order, and mobile layouts pass the `dcs-ui-ux` priority ladder.

### 4. Accessibility (WCAG-leaning, pragmatic)
- [ ] Color contrast on text/CTAs ≥ 4.5:1 — **measured with `node cli/contrast-audit.mjs <url> --theme both`, never with a hand-rolled sweep** (a live host: §Live-site browser sessions). The 2026-07 campaign recorded SEVEN false-positive mechanisms in contrast measurement, every one produced by an instrument rebuilt inside a review and thrown away. The durable rail validates itself against 5 colour controls + 2 recorded landmark ratios, refuses to run if they fail, reads the **leaf text node's** colour, and **ABSTAINS (never a ratio) on any colour it cannot resolve**. Kill-tests: `node cli/contrast-audit.mjs --self-test`.
  - An `ABSTAIN` row is not a pass and not a failure — it is the instrument declining to guess. Report abstentions as scope, never as clean.
  - Do **not** report a `1.00:1` finding without a screenshot: that value is only reachable when fg == bg, and it was fabricated three times by a resolver that silently defaulted to white (C-417).
- [ ] **Every DOM sweep MUST pierce shadow roots.** `querySelectorAll` and `createTreeWalker` stop dead at a shadow boundary, so a light-DOM-only sweep reports shadow content as *absent* — which is indistinguishable from *clean*. The DCS **agent/chat widget mounts into an open shadow root on every site that ships it** (`packages/agent-widget/src/mount.ts:40`), so an unpierced sweep silently biases every control inventory, touch-target count and accessible-name check on the fleet.
  - **Measured on live ironoakcontractors.com (2026-08-13):** naive sweep **43** interactive controls, piercing sweep **44** — the 44th being the widget's compliant 56×56 "Open Iron Oak Assistant" button. All three of the original probes (`[aria-label*="Assistant"]`, `[class*="dcs-chat"]`, and even `#dcs-agent-widget-host button`) returned **0**. Note the third: the host element *is* in the light DOM, so "the widget is missing" was wrong twice over.
  - **The technique** — recurse INTO every `.shadowRoot`, and when resolving ancestors walk back OUT through the boundary (`parentElement` is `null` at a root's top, which truncates the walk silently):
    ```js
    function collect(root, sel, out = []) {
      out.push(...root.querySelectorAll(sel))
      for (const el of root.querySelectorAll('*')) if (el.shadowRoot) collect(el.shadowRoot, sel, out)
      return out
    }
    const up = (n) => (n.parentNode?.nodeType === 11 && n.parentNode.host) || n.parentElement
    ```
  - `cli/contrast-audit.mjs` **already pierces** (C-418 residual 3) and prints `shadow roots pierced: N` every run. If that says `0` on a site you know ships the widget, the page had not settled — re-run with a longer `--settle`. axe-core also pierces open roots natively; a hand-rolled sweep does not.
  - **Closed roots (`mode: 'closed'`) are unreachable from any in-page script.** They cannot be swept — report them as scope, never as clean.
  - Quote the pierced/unpierced numbers in the doc. A count with no stated sweep method is not reproducible.
- [ ] Focus states visible; semantic headings (one h1, ordered).
- [ ] Images have meaningful `alt`; interactive elements are real buttons/links with names.
- [ ] Reduced-motion respected (parallax/motion gated on `prefers-reduced-motion` + not touch-only); the visual-editor iframe must not break it.
- [ ] Keyboard reachable; tap targets ≥ 44px on mobile.

### 5. Brand & design fidelity
- [ ] Consistent tokens (color/type/spacing), CSS isolation intact, no leaked portal/global styles.
- [ ] Logo/identity correct; favicons/social cards present; visual polish (no jank, parallax sane).
- [ ] Consistent component usage (shadcn-vue / cms components) rather than one-off markup.

### 6. Platform-capability gaps (the high-leverage lens)
For each site need, ask "should DCS provide this?" — but **first ask whether the platform already ships it and this tenant merely lacks it enabled.** Filing a shipped capability as a platform gap in a customer-facing deliverable is the failure mode this lens has.

**ALREADY SHIPPED — check the site's `Features` column in `PortalSites`, do NOT re-propose:**

- **Booking / scheduling** — `server/internal/handlers/revenue_bookings.go`, `revenue_schedule.go`.
- **Payments / deposits** — `portal_stripe_connect.go` + `portal_stripe_connect_webhooks.go`.
  (Both gate on the `revenueSite` / `revenueContractor` site feature, live on kept, boogie-babies, iron-oak, mi-handyman.)
- **Reviews ingestion** — the whole chain exists: `server/internal/services/portal/google_reviews.go` → portal ReviewPickerSheet → `.dcs/content.yaml` → `packages/cms/src/composables/useReviewContent.ts` → honest JSON-LD via `filterRealReviews` (`schemaGraph.ts:270-315`).
- **Multi-step forms + file upload** — `packages/site-forms/src/schema/form-definition.schema.json:39,42` (`attachmentPolicy`, `steps`).

**Genuine open gaps — these are still worth filing:**
- [ ] **E-signature** (see the esignatures plan).
- [ ] **Blog/content scheduling**, owner-facing analytics dashboards, A/B of CTAs, alt-text assist.
- [ ] **Image pipeline** (auto hi-res/responsive, alt-text assist).
File these as platform findings → `.docs/plans/seo-managed-experience/` (SEO/infra; successor to the archived seo-platform-elevation tracker) or `strategy-hub` (product/revenue) per the strategy-suite rule (a plan §2.1 change updates the hub in the same commit).

### 7. Owner value & "delight" ideas
- [ ] Quick wins that make the owner money or save time: click-to-call analytics, an offers banner via Announcements, a seasonal hero, an FAQ that doubles as GEO citable content.
- [ ] One or two **cool, concrete, shippable** ideas per site — perceived value, not vague "modernize." Tie each to an existing platform capability so it's near-free to ship.

---

## Method

1. **Read the repo** — `.dcs/site.yaml`/`content.yaml`/`pages.yaml`/`seo.yaml`, the route/page components, the site-local design skill. Know what the CMS owns vs hardcoded.
2. **Inspect LIVE** in a guarded session (§Live-site browser sessions), or from provided screenshots/console/network evidence, for mobile + desktop: above-the-fold, nav, primary CTA path, every form state, console errors. Don't review from source alone — the built/live site is the truth (cms factory + CDN images only exist in prod).
3. **Cross-check** with the perf (`site-performance-audit`) and SEO (`dcs-seo`) findings so a single issue isn't triple-counted, and so a perf win that's also a UX win is noted once with both angles.
4. **Apply `dcs-ui-ux`** to separate craft failures (contrast, hierarchy, interaction state, responsive breakage) from site-specific brand choices.
5. **Score & tag** every finding (Impact × Effort × `platform`/`site-local`).

---

## Output → HTML doc standard

Emit into the per-site `.docs/plans/<topic>/<slug>/index.html` (match `.docs/archive/plans/kept-web-performance/index.html` styling; Summary FIRST). Sections: **Summary** (top 3 moves) → **per-lens findings table** (Impact/Effort/Scope badges) → **platform findings** (rolled up separately so they're easy to lift into the hub) → **delight ideas**. Keep claims honest and evidence-backed (screenshot/console/file reference). Recommendations that touch managed content must go **through the CMS/`.dcs` metadata**, never hand-edited markup — consistent with `site-content-editing` and `dcs-seo`.

