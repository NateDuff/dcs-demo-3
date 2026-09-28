---
name: site-forms
description: Use when adding or editing a managed form on a DCS customer site — `<DcsForm>` wiring, the site↔portal↔provision 3-way schema sync, form-field normalization, and the visual-editor managed-form affordance. Trigger for contact/intake/questionnaire forms or form submission issues.
metadata:
  docKind: skill
  docClass: guidance
  title: Site Forms
  status: Active
  owner: Nathan Duff
  created: 2026-05-31
  lastVerified: 2026-09-27
  stalenessSLA: 90
  relatedDocs:
    - .github/skills/site-content-editing/SKILL.md
    - .github/instructions/site-submodules.instructions.md
    - packages/site-forms/README.md
  codeRefs:
    - packages/site-forms/src/DcsForm.vue
    - packages/site-forms/src/resolvePublicApiBase.ts
    - packages/site-forms/src/composables/useFormSubmission.ts
    - .github/workflows/npm-publish.yml
    - packages/site-forms/src/schema/form-definition.schema.json
    - packages/cms/src/editor/editorBridge.ts
    - cli/provision/kept/PortalSiteForms.json
    - server/internal/handlers/public_site_forms.go
    - server/internal/services/captcha/captcha.go
    - cli/validate-site-onboarding.ps1
    - cli/lib/DcsFormSchema.ps1
    - cli/forms-fleet-lag.ps1
  updateTriggers:
    - Form schema or 3-way sync contract changes
    - Submission pipeline or spam-gate behavior changes
    - DcsForm API-base routing changes
    - A fleet lag apply lands (re-run the fleet lag check in the 3-way sync section)
    - A site-forms publish or a consumer bump (update §Fleet versions)
---
<!-- Delivered from the dcs-again monorepo by cli/ai-guidance/sync-site-guidance.ps1. Do not edit here; edit the canonical source in dcs-again/.github and re-run the sync. -->

# Site Forms

DCS manages customer site forms end-to-end so every submission lands in one portal inbox. Never wire a site form to a third-party provider (Formspree, Netlify Forms, etc.) — submissions must reach the DCS portal.

## The `<DcsForm>` Consumer

Render the managed form from `@duffcloudservices/site-forms` (current: **0.7.9**: the C-1828 contract plus C-1916, C-1885 and C-1886):

```html
<DcsForm form-id="contact" site-slug="<slug>" :forms-modules="dcsFormsModules" />
```

It posts to `POST {apiBase}/sites/<slug>/forms/<formId>/submissions` and surfaces in the portal Contact Inboxes view.

- **Props:** `form-id` (required); `forms-modules` (required in real sites: your own `import.meta.glob('../../.dcs/forms/*.yaml', { eager: true, import: 'default' })`, because the internal glob resolves against the Vite root, not the repo root); `site-slug` (pass it; preview hosts need it); `api-base` (optional, §API Base Routing); `captcha-token`; `initial-values` (hidden-field page context; an undeclared key throws at setup); `definition-override` (portal preview iframe only). Emits `submit-success` / `submit-error` / `validation-error`. Full table: `packages/site-forms/README.md` §Props.
- **Pre-hydration rule — never add your own `method="post"` or `action` to the host form.** The package renders `<form … method="post">` and keeps its default Send button `disabled` until mount, so a click on a prerendered page before hydration cannot become a GET with the visitor's values in the URL (W100 F-1). `action` is deliberately unset: a native POST to the API would skip the receipt check and captcha and land the visitor on a raw API response; with no `action` it gets the static host's 405 and carries no values. The form may mount outside `<ClientOnly>` (kduff-homes does); the gate covers it.
- **Own button → bind `hydrated`.** The `actions` slot exposes `{ isFirstStep, isLastStep, submitting, hydrated, prev, next }`. A site that replaces the button binds `:disabled="hydrated === false || submitting"` — `=== false`, so an older package where `hydrated` is `undefined` does not leave it stuck disabled (resume-blog's pattern).
- **Stylesheet — pick ONE, never both.** Either `import '@duffcloudservices/site-forms/style.css'` once in the entry / theme `index.ts` (resolves to `dist/site-forms.css` from 0.7.8; `dist/index.js` does not inject it), or restyle the `dcs-form*` classes in the site's own tokens and import nothing. Both layers means two rule sets fighting over one class list. resume-blog, kduff-homes, bryan-duff-homes and bryanduff-com all restyle and import nothing. A restyling site must cover the 0.7.8 classes `.dcs-form__submit-error-message` and `.dcs-form__submit-error-detail`. From 0.7.9 it must also give `.dcs-form--success:focus-visible` an indicator that passes 3:1 against the surrounding background. The browser default ring is fine; `outline: none` is not. The package itself uses `outline: 2px solid currentColor; outline-offset: 4px`. The sr-only labels need no site rule because their declarations ride inline. Do not override `position`, `clip` or `width` on them with `!important`.
- **Error line (0.7.8):** a non-2xx renders exactly `Submission failed (<status>)` in `.dcs-form__submit-error-message` (`role="alert"`). A short server reason (JSON `error`/`message`/`detail`/`title`, or clipped plain text, ≤200 chars, never an HTML page) travels as `DcsFormSubmitError.detail` and renders behind a `<details class="dcs-form__submit-error-detail">` toggle; the body (≤500 chars) goes to `console.error` with the status and URL. Do not reintroduce the body into the message, and do not clamp the alert's height (the details toggle has to open). A 5xx that is still failing after its retry reads the same `Submission failed (<status>)`; before 0.7.9 it read `Server error <status>`.
- **Transport failure (0.7.9, C-1886):** a rejected fetch (offline, DNS, CORS, abort, timeout, a refused redirect) emits `submit-error` with `status` undefined and the RAW exception in `error`, which is for telemetry. The page shows `We could not send your message. Check your connection and try again.` in the same `.dcs-form__submit-error-message`, never `Failed to fetch`. Values stay and Send stays enabled; pressing Send again is the retry.
- **Success state (0.7.9, C-1916):** `div.dcs-form--success` is `role="status"`, `aria-live="polite"` and `tabindex="-1"`, and it takes focus on the swap unless the visitor moved focus elsewhere. A custom `success` slot renders inside it.
- **Group labels (0.7.9, C-1885):** the radio and checkbox-group legends and the single checkbox wrapper label are `class="sr-only"` plus inline visually-hidden declarations, so an unstyled site prints each label once.
- **Rendering these states on a live site:** by DOM edit, in a guarded session under `site-experience-review` §Live-site browser sessions.

## API Base Routing (CRITICAL)

- `<DcsForm>` must POST to the ABSOLUTE app-API host `https://api.duffcloudservices.com/api/v1` (customer origins are CORS-allow-listed). Same-origin bases 405: a customer apex only Front-Door-routes `/api/v1/content|pages/*` to the content CA — `/api/v1/sites/{slug}/*` falls through to the SWA.
- **`resolvePublicApiBase` order (W80, C-1564):** `api-base` prop → `VITE_DCS_PUBLIC_API` (workspace-source consumers ONLY) → `''` under Node (SSR/prerender posts nothing) → relative `/api/v1` on localhost → the package default `config.publicApiBase` (`https://api.duffcloudservices.com/api/v1`). That default is the documented production contract, not a fallback: no fleet site passes `api-base` or sets the env, and a production build (`process.env.NODE_ENV === 'production'`, replaced by the consumer's bundler) resolves it silently. A non-production build on a non-localhost host warns once per page load, because a form under test there posts to production.
- **Env vars do nothing for an npm consumer.** The library build erases `import.meta.env`, so the published dist reads neither `VITE_DCS_PUBLIC_API` nor `VITE_DCS_SITE_SLUG` — do not add them to a workflow or `.env` to "fix" a form. Use the props. A site-owned resolver (kept's `getFormsApiBase()`) is fine; it is not required.
- **Self-healing fallback (site-forms ≥0.5.0, server ≥1.4.295):** an unset `api-base` defaults to `https://api.duffcloudservices.com/api/v1` (relative `/api/v1` on localhost), and an empty slug (no `site-slug` prop) posts to the slug-free `POST /api/v1/forms/{formId}/submissions`, where `SiteContextWithOriginFallback` resolves the site from the request Host, then `Origin`, then `Referer` (`PortalSites` domain lookup) — a misconfigured build degrades to a working origin-inferred submission instead of a 405. Previews still need the slug: preview hosts don't domain-resolve, so pass `site-slug` explicitly. Verify the rail with an empty-body POST — a form-level `Missing required fields: ...` 400 proves site + form resolved without storing or emailing anything.

## Consumer Onboarding Checklist (a site taking site-forms, or bumping it)

1. **Lockfile from the registry.** `pnpm update @duffcloudservices/site-forms` (or `pnpm add @duffcloudservices/site-forms@<ver>`) after the version is visible (`npm view @duffcloudservices/site-forms version`). The committed lockfile must resolve the registry tarball with an integrity hash — zero `file:` / `link:` / local-path entries. A `pnpm pack` + `file:` install is fine for a scratch build proof, never for a commit.
2. **Build env.** Set whatever the SITE's own build needs; the package needs none. kduff-homes' `fetch-properties.ts` refuses to build without `VITE_API_BASE_URL` (CI writes it into `.env`), so a local build there is `VITE_API_BASE_URL=https://api.duffcloudservices.com pnpm build`; a bare `pnpm build` exiting 1 is by design, not a site-forms failure.
3. **Wiring:** `forms-modules` from the site loader, `site-slug`, no host `method`/`action`, own button bound to `hydrated`, ONE stylesheet choice (§The `<DcsForm>` Consumer).
4. **Dist check before merge:** the prerendered contact page (`dist/contact.html` or the site's equivalent) carries `<form class="dcs-form" … method="post" …>` and a Send `<button … type="submit" … disabled …>`.
   - **Pre-render note (C-1842):** a site on the cms body pre-render (the headless-Chromium capture after mount — kept, mi-handyman, boogie-babies; not the VitePress SSG sites) needs `@duffcloudservices/cms` **>= 0.13.9**, or the Send button ships ENABLED: the capture runs after `hydrated` flips, and only 0.13.9+ re-applies `disabled` to `form.dcs-form button[type=submit]` before writing.
5. **Live check after deploy** (`curl -s "https://<domain>/contact?cb=<nonce>"`): the same `method="post"` + disabled Send in the served HTML, and the served CSS asset carries the form classes — the site's own rules (e.g. `.dcs-form-field__label`, `.dcs-form__submit-error-detail`) if it restyles, or the package's if it imports `style.css`. A restyling site's CSS proves its rules are served, not that the package file is.
6. Then the P0 path: a TEST MODE submission (below) through the page; a 400 reads `Submission failed (400)` with the reason behind Details.

## Fleet Versions (2026-09-26)

| site | site-forms | note |
|---|---|---|
| resume-blog (nateduff.com) | 0.7.9 (8dd1752, 2026-09-27) | own Send button bound to `hydrated`; restyles classes. The shadcn base `* { outline-ring/50 }` faded the default ring to 1.85:1, so `ContactPage.vue` draws `2px solid currentColor`, offset 4px: 19.68:1 light, 18.32:1 dark. No guarded live session: the theme chunk ships Prism's `new Worker` (WS46). Capture guarded (0.5.1, C-1946): the post-deploy snapshot script launches through `@duffcloudservices/cli/guard` (one guarded context in place of a context per page) with content host `images.pexels.com`; it only loads /contact, never touches the form (cfcf1d0, run 36411044253: 0 listed writes, 16 pages / 82 sections / 131 files, www.googletagmanager.com 16 refused) (W255) CLI 0.5.2 (C-1966): 95360be, run 36429161051: guard blob 2d6d539224d9, 0 listed writes, but 16 pages / 76 sections / 125 files (was 82 / 131): /blogs rendered blank in CI (900px, 0 sections vs 6), while the local 0.5.2 GET-only run captured it with 6 - a C-1966 STOP, not a guard refusal (W260). |
| kimduff-homes (kimduffhomes.com) | 0.7.9 (acbe0e5 + 1ca8db8, 2026-09-27) | mounts outside `<ClientOnly>`, default actions slot; restyles classes; UA ring 18.25:1 light, 17.08:1 dark. At 1440 the focused message sat under the 64 px fixed nav (0/5 points visible), so `html:has(.contact-form-shell .dcs-form--success)` sets `scroll-padding-top`; `scroll-margin-top` does not help when the element is already inside the viewport (WS46). Capture guarded (0.5.1, C-1946): the post-deploy snapshot script (`scripts/capture-snapshots.mjs`, the deploy one; `review-capture*.mjs` are local review tools) launches through `@duffcloudservices/cli/guard` with content hosts `images.pexels.com` + `img.youtube.com`; the GA4 tag stays refused (f0a5aa6, run 36409138979: 0 listed writes, 59 pages / 79 sections / 257 files, www.googletagmanager.com 59 refused) (W255) CLI 0.5.2 (C-1966): 78469d8, run 36428667087: guard blob 2d6d539224d9, 0 listed writes, 59 pages / 79 sections / 257 files = previous (W260). |
| bryan-duff-homes, bryanduff-com | 0.7.9 (fdc03db / b7599a3, 2026-09-27) | restyles classes incl. the 0.7.8 error parts (Details summary pointer + underline, 8/6px gaps); VitePress pre-renders a bare `disabled` (not `disabled=""`) - F-1 closed live. `FormBlock.vue`'s success stopgap (its own `role="status"`, `tabindex`, focus call) is gone, so one status node; the global `:focus-visible` ring is 4.45:1 on the panel (WS46). Capture guarded (0.5.1, C-1946): both `scripts/capture-snapshots.mjs` launch through `@duffcloudservices/cli/guard` with no content hosts, against the SWA default host (pre-launch `production_url`); playwright 1.63.0 needs the `--enable-automation` launch shim (bryan-duff-homes ed39117, run 36413694310: 0 listed writes, 38 pages / 178 sections / 292 files; bryanduff-com 36da9dd, run 36414762232: 0 listed writes, 5 pages / 18 sections / 34 files; refused none) (W257) CLI 0.5.2, launch shim removed (C-1966; launchGuarded adds the flag): bryan-duff-homes 33152cb, run 36429769160 (38 / 178 / 292); bryanduff-com 145b1d3, run 36429986806 (5 / 18 / 34); guard blob 2d6d539224d9, 0 listed writes, counts = previous, playwright 1.63.0 launches unshimmed (W260). |
| iron-oak-contractors | 0.7.9 | **ON 0.7.9 since 2026-09-28** (Q-976 = A; W263 62c94ac, Site Deployment 36435265095, guard blob 2d6d5392, 0 listed writes, 21/99/163; JP20 PASS - live contrast Send focus rings 2.26 / 1.97 -> 8.78 / 7.47, hover text 3.78 -> 5.42, dark-mode rings 8.17-9.28; method="post" live, F-1 closed; C-1917: the failed-submit alert shows a fixed sentence, the raw body only in console.debug). The site-owned `#actions` Send pre-renders `disabled=""` (JS28). Capture guarded (C-1946/C-1966). |
| kept (kineticenergypt.com) | 0.7.9 (59e0012 + a54ccc4, 2026-09-27) | restyles classes; footer form on 19 routes + /contact. Success-state scroll-padding rule (C-1940): `html:has(.dcs-form--success) { scroll-padding-top: 7rem }` replaced 59e0012's `scroll-margin-top`, which missed a message already inside the viewport under the 94 px fixed nav (form top 0-93 px at 390: 0/5 points on /contact, 18-98 of 112 px on the footer forms; W211, W213). UA ring: top/bottom >= 4.97:1; the full-bleed footer clips its sides at the viewport edge (1.49-1.60:1) (WS47). Capture guarded (0.5.0, C-1946): the post-deploy snapshot script launches through `@duffcloudservices/cli/guard` (a31589a); live-capture pageViews 55-59 per deploy to 0 (W236) CLI 0.5.0 -> 0.5.2 (C-1966): a390653, run 36426414025: guard blob 2d6d539224d9, 0 listed writes (1 unlisted write refused, as at c5f376a), 58 pages / 293 sections / 408 files = previous (W260). |
| mi-handyman (mihandymanservices.com) | 0.7.9 (64afb49, 2026-09-27) | restyles classes; passes `site-slug="mi-handyman"` from 0.7.9 (C-1888); UA ring 16.7:1 on the success fill (WS47). Capture guarded (0.5.1, C-1946): the post-deploy snapshot script launches through `@duffcloudservices/cli/guard` with no content hosts (9a12923, run 36406141123: 0 listed writes, 13 pages / 64 sections / 91 files) (W254) CLI 0.5.2 (C-1966): 4cdfae6, run 36427879461: guard blob 2d6d539224d9, 0 listed writes, 13 / 64 / 91 = previous (W260). |
| bryans-handyman-solutions (bryanshandymansolutions.com) | none | unaffected: no `<DcsForm>`, no `.dcs/forms/`. Capture guarded (0.5.1, C-1946): the one-page snapshot script launches through `@duffcloudservices/cli/guard` with no content hosts; the site's playwright 1.61.1 needs a launch shim that adds `--enable-automation` back, or the guard exits 6 (b5786f9, run 36405046158: 0 listed writes, 1 page / 7 sections / 11 files) (W254) CLI 0.5.2, launch shim removed (C-1966; launchGuarded adds the flag): ac84878, run 36427651828: guard blob 2d6d539224d9, 0 listed writes, 1 / 7 / 11 = previous, playwright 1.61.1 launches unshimmed (W260). |
| boogie-babies | 0.7.9 (8ccaec5, 2026-09-27) | restyles classes; UA ring 16.0:1. No guarded live session: HomeView ships canvas-confetti's blob `new Worker` (WS47). Capture guarded (0.5.1, C-1946): the post-deploy `site/scripts/capture-snapshots.mjs` launches through `@duffcloudservices/cli/guard` with no content hosts (the Google Maps embed stays refused; the guarded capture of / ran clean) (158cb4a, run 36402533836: 0 listed writes, 12 pages / 66 sections / 103 files) (W253) CLI 0.5.2 (C-1966): a5f7291, run 36427443454: guard blob 2d6d539224d9, 0 listed writes, 12 / 66 / 103 = previous (W260). |
| coron8 | 0.7.7 (lock, W91) | unaffected: no `<DcsForm>` mount, no `.dcs/forms/`; dependency looks unused. Capture guarded (0.5.1, C-1946): `scripts/capture-snapshots.mjs` launches through `@duffcloudservices/cli/guard` with no content hosts; playwright 1.60.0 already needs the `--enable-automation` shim (the guard exits 6 without it) (4423a2e, run 36415686941: 0 listed writes, 10 pages / 28 sections / 59 files, refused none) (W257) CLI 0.5.2, launch shim removed (C-1966; launchGuarded adds the flag): c1f4ede, run 36430250936: guard blob 2d6d539224d9, 0 listed writes, 10 / 28 / 59 = previous, playwright 1.60.0 launches unshimmed (W260). |
| ktbraunlaw | `^0.5.0` | unaffected: prospect CLOSED 2026-08-09 |
| kduff-c191-seo | `^0.1.3` | unaffected: legacy snapshot |

Evidence: `.workboard/answers/2026-09-25-laneP-W106-C-1828.md` §Consumers, `…-W108-C-1828-consumers.md`, `2026-09-24-laneP-W91-fleet-bump-resumed.md`. kept, mi-handyman, boogie-babies: `2026-09-27-laneS-WS47-fleet-079.md`, on cms 0.13.9 (C-1842); each live /contact Send is `disabled=""`. resume-blog, kimduff-homes, bryan-duff-homes, bryanduff-com: `2026-09-27-laneS-WS46-fleet-079.md`.

## Publishing (package side)

- **A bump mode bumps all nine.** `npm-publish.yml` (`workflow_dispatch`, `version_bump` patch|minor|major|skip) runs `npm version` in ALL 9 `PACKAGES` (cms-core, cms, cms-react, cms-astro, cms-angular, cli, site-forms, telemetry, kit) and commits `chore: bump package versions (<type>)`. A site-forms patch in bump mode is a patch of all nine; to ship one package, use the next bullet.
- **One-package patch (cms 0.13.9, W147/WS3; site-forms 0.7.9, WS37):** set that package.json version in the fix train on main, then dispatch with `version_bump=skip`. Skip mode publishes only versions npm lacks, so first check that the other eight all match `npm view`.
- **Hold every other push until the bot's bump commit lands** on main (a push in between races the bump), then pull it.
- **Registry lag is ~18 minutes** after the workflow goes green — poll `npm view … version` before touching a consumer lockfile.
- Rolling the new version across sites follows the cms-fleet-bump train (canary one Vite SPA site and one VitePress site before fanning out).

## Submission Testing Traps

- The contact pipeline (formKind `contact`/`revenue-contractor`) requires `message` ≥ 10 chars even if the form marks it optional — a blank or short message is **400**, not 500 (`public_site_forms.go:347-360`, C-137: `errors.Is(err, contact.ErrInvalidSubmission)` classifies the whole normalizer class as a client error). Full hard-required set: §Validation Gates #5.
- The spam gate soft-accepts flagged submissions and does NOT store them, so a swallowed test looks like success — §Captcha & Spam-Filter Assertions has the per-endpoint markers that prove delivery.
- Prefer a single `name` field with `role: contact-name`; the server composes split first/last name fields, but a fully name-less mapping is **400** (same `ErrInvalidSubmission` class, `contact/service.go:865`).
- Never mark fields `phi: true` on non-medical sites — PHI flags drop the field from the spam screen and pull submissions into medical redaction paths.

## Testing forms without emailing the owner (TEST MODE, W19-F1)

Run it with `node cli/live-site/site-forms-test-mode.mjs` (guarded, exactly one POST, local-only unless `--live`; W214, C-1927); the manual recipe below is unguarded and admits every POST.

A real submission once emailed the real site owner. Authenticated **TEST MODE** runs the full pipeline (lookup, captcha, required-field validation, spam, storage) but routes the notification email to the platform global-admin address ONLY — never the company/owner recipients — and skips the CRM/prospect sync, lead capture, in-app owner notification, and any owner webhook. The stored row is flagged `IsTestSubmission=true` (additive property on both `SiteContactSubmissions` and `PortalSiteFormSubmissions`). `[TEST] ` is prefixed to the admin email subject/headline.

Opt in with a request header on either public submission endpoint (`POST /api/v1/sites/{slug}/contact` and `POST /api/v1/sites/{slug}/forms/{formId}/submissions`):

- **Header:** `X-DCS-Test-Submission: 1`. Any non-empty value engages the gate — a typo'd value can never fall through as a real owner-emailing submission; it either authorizes or 403s.
- **Server flag:** `DCS_FORM_TEST_MODE_ENABLED` must be `true`. It defaults to false **in code** (`config/server.go`) but is `=true` in `server/.env.production.defaults` and on the prod server CA (confirm with an ARM env query if in doubt). **No flip is required and none should be requested.** The only thing you still need is a global-admin session — the flag is not the gate you will hit.
- **Auth:** a valid portal session whose user is a DCS **global admin** (`auth.IsAdmin`). Both public routers already run `OptionalPortalSessionMiddleware`, so an admin browser session (cookie) or admin bearer token is honored.
- **Loud failure:** header present but flag off OR caller not a global admin ⇒ **403**, single generic body `Test submissions are not authorized` (the specific deny reason — disabled vs not-admin — is logged server-side only, never in the response, to avoid a config/admin oracle on a public endpoint). A test request NEVER silently proceeds as a real submission. The gate (`resolveFormTestMode`) covers **every public submission entry point**: site contact and the bare marketing `POST /api/v1/contact`, managed forms, leads, careers/resume, and visitor revenue estimates; a build guard in `server.go` refuses a public submission handler registered without it. **Do not conclude test mode is unavailable on careers or estimate forms and submit for real** — that is the owner-emailing accident this gate exists to prevent.

Playwright recipe (drive the real form UI, then re-issue the submit with the marker header + your portal session):

```js
// Precondition: logged into the portal as a global admin in this browser context
// (so the session cookie rides along), and DCS_FORM_TEST_MODE_ENABLED=true on the server.
await page.route('**/api/v1/sites/*/{contact,forms/*/submissions}', async (route) => {
  const req = route.request();
  const headers = { ...req.headers(), 'x-dcs-test-submission': '1' };
  await route.continue({ headers }); // credentials (cookies) are preserved on continue
});
await page.getByLabel('Name').fill('QA Test');
await page.getByLabel('Email').fill('qa@dcs.test');
await page.getByLabel('Message').fill('End-to-end test submission — do not action.');
await page.getByRole('button', { name: /send|submit/i }).click();
// Expect 201/202; verify the PortalSiteFormSubmissions/SiteContactSubmissions row
// carries IsTestSubmission=true and NO owner email/notification fired.
```

For CI without a browser session, a global-admin Azure AD bearer on `Authorization` satisfies the same optional-session middleware. A portal "send test submission" button and a dedicated CI bearer are recommended platform follow-ups.

## Three-Way Schema Sync (all must agree)

A form only flows submissions when these three stay in sync:

1. **`.dcs/forms/<formId>.yaml`** — site-side schema (validated against `contracts/dist/form-definition.schema.json`).
2. **`cli/provision/<slug>/PortalSiteForms.json`** (in the DCS monorepo) — the same schema serialized as `SchemaJSON`.
3. **`cli/provision/<slug>/PortalSites.json`** (in the DCS monorepo) — `Features` must include the form's feature flag (e.g. `contactForm`).

Author the form in the portal Form Manager (through `https://localhost:4000`, not raw Vite), then snapshot the canonical YAML into the site repo.

**Seed lint R10 checks legs 1 and 2 on every push** (`e2e/cli/seed_form_schema_lint_test.go`). CI has no site checkouts, so there it reads leg 1 from the committed snapshot `e2e/configs/site-forms-snapshot/<slug>/` + `manifest.json`. On a workstation with the sibling checkouts it reads the checkout and fails when the snapshot differs from it (file bytes, or `formsSha` != the checkout's last forms commit). **When a site's `.dcs/forms` changes, run `pwsh cli/forms-fleet-lag.ps1 -RefreshSnapshot` (no az; the forms dir must be committed) and commit the snapshot with the seed sync.** Never hand-edit the snapshot: every file is checked against its manifest sha256. In CI an R10 skip is a failure.

### The FOURTH artifact nobody counted: the LIVE `PortalSiteForms` row

The three files above are all *repo* artifacts. The thing that actually serves is a **live Table Storage row**, and **nothing in a repo sync touches it**:

| leg | artifact | who moves it | when it goes live |
|---|---|---|---|
| 1 | `<site repo>/.dcs/forms/<id>.yaml` | a site-repo commit | on the site's next **deploy** — `<DcsForm>` renders from the YAML shipped in the site's own bundle |
| 2 | `cli/provision/<slug>/PortalSiteForms.json` | a DCS-monorepo commit | **never on its own** — it is only an input to an apply |
| 3 | the live `PortalSiteForms` row in `sgdcs` | a provision **apply**, or a re-save in the portal Form Manager | immediately, for the portal UI, the visual-editor affordance, and the server's required-field validation on `POST /sites/{slug}/forms/{formId}/submissions` |

So a site-repo form change goes live the moment the site deploys, while the portal keeps serving the **old** schema indefinitely — with every repo gate green.

**Measure it, don't assume it** — `pwsh cli/forms-fleet-lag.ps1` compares every fleet site's live row against the YAML on its *production branch* (read-only; `-JsonOut` for machine output, `-OnlySlug` for one site). Apply runbook: `.docs/analysis/form-fleet-lag-2026-07-27.md`.

**An apply is not always the fix.** It pushes leg 2 over leg 3, destroying anything present *only* in the live row — e.g. a `phi: true` flag set live that exists in neither the seed nor the site YAML, which an apply would silently strip, sending those field values to the AI spam classifier. Read the lag report's per-form `seedNote` (does the seed match the site YAML?) before applying, and treat "the live row is ahead" as an owner decision.

**Reading live rows:** Table REST endpoint with an AAD bearer. Mint and use it in ONE call so the token never reaches stdout (the harness spools it): `$t = az account get-access-token --resource https://storage.azure.com/ --query accessToken -o tsv`, then `Invoke-RestMethod -Headers @{ Authorization = "Bearer $t" }`. A bare `get-access-token` prints the token into the transcript — see agent-orchestration §Accepted structural exposure. **Not** `az storage entity query -o json` — on Windows it re-encodes output to the console codepage, so every em dash in a form's copy returns as an invalid byte and a faithful comparison invents drift. Both `cli/forms-fleet-lag.ps1` and the validator's `CONTACTFORM-LIVE-SYNC` use the REST path.

## Form-Field Normalization (portal field editor)

When a field's `type` changes, normalize the `PortalFormField` payload: seed/drop `options`, set `html` ownership, `validation.accept`, the `defaultValue` shape, and clear layout-only stale props. Keep the nested detail-sheet index in sync on reorder/remove/add. Rename a field id through the store action (kebab-case, dedupe, and repair `steps[].fieldIds` + any `visibleIf.fieldId`).

## Visual-Editor Managed-Form Affordance

The managed surface is marked with `[data-form-key]`. The "edit this form" affordance lives in the shared `editorBridge.ts` and emits a `dcs:managed-form-click` event; portal forwarding stays thin, and every entry point (preview, toolbar, context menu) converges on one destination. Same first-party pattern as managed reviews (`data-dcs-reviews`) — runtime markers → shared bridge → one portal workflow → durable truth (the portal record, not the preview DOM).

## Validation Gates (run for every form change)

1. **Package tests** — `pnpm --filter @duffcloudservices/site-forms test` (vitest, incl. `missing-form-error-surfacing.test.ts`). Portal Form Manager changes additionally need `pnpm --filter dcs-portal type-check && pnpm --filter dcs-portal test:unit --run`.
2. **3-way sync consistency** — run `cli/validate-site-onboarding.ps1` **with `-RepoPath <site repo>`** (or `-SiteFormsDir`). Without it the site YAML leg cannot run.
   ```powershell
   pwsh cli/validate-site-onboarding.ps1 -Slug <slug> -RepoPath <site repo root> -Offline
   ```
   - `CONTACTFORM-SCHEMA` proves **leg 1 == leg 2**: the C-182 id/slug consistency (`SchemaJSON` parses, `formId` == `RowKey` == `FormID`, `fields[]` non-empty, `SiteSlug` == slug) **plus** a field-level deep-compare of the seed against `.dcs/forms/<formId>.yaml`, plus the denormalized columns the server filters on without decoding the JSON (`FormKind`, `SubmissionKind`, `FieldCount`, `Version`).
   - `CONTACTFORM-LIVE-SYNC` (live layer, skipped by `-Offline`) proves **leg 3**: the live `PortalSiteForms` row against the same site YAML.
   - **`CONTACTFORM-SCHEMA` reports WARN "3-way sync UNPROVEN" — never PASS — when no site YAML is reachable.** A check that cannot read the site YAML cannot prove the third leg of the sync. **A green here that you did not pass `-RepoPath` to is not a green.**
   - Comparison rule if you hand-roll it: portal-owned keys (`title`, `description`, `createdAt`, `updatedAt`, `version` — presentation + row provenance) are set aside **only when the site YAML does not declare them**; five fleet YAMLs do declare some, and ignoring a key the site states is its own small vacuous green. Everything else deep-compares, arrays **by index** (field order is render order). `ConvertFrom-Json` silently coerces ISO-8601 strings to `[DateTime]`, so normalize timestamps on both sides or identical values compare unequal.
   - Shared implementation: `cli/lib/DcsFormSchema.ps1` (also used by `cli/forms-fleet-lag.ps1`, so gate and fleet query can never disagree). Its strict YAML subset **throws** on block scalars/anchors/aliases/tags/merge keys/tabs/`yes|no` booleans and the caller renders that as FAIL — an unreadable YAML must never surface as "no differences found".
   - **Kill-test any change to this gate.** `pwsh cli/validate-site-onboarding.ps1 -SelfTest` replays the C-337 drift shape and requires a FAIL that *names* the dropped field, a PASS on the synced pair, and WARN for the no-site-repo case. A gate that cannot fail is not a gate.
3. **Site YAML validates** against `contracts/dist/form-definition.schema.json`. Trap: the client validator (`packages/site-forms/src/schema/validate.ts`) only `console.warn`s in DEV — an invalid YAML ships silently in prod builds, so validate at authoring time.
4. **404 surfacing (C-155 contract)** — a missing/unprovisioned server form (`ErrSiteNotFound` / `ErrFormNotFound` / `ErrFormFeatureDisabled` in `server/internal/handlers/public_site_forms.go` all map to 404 "Form not found") must surface LOUDLY in the client: one POST (no 4xx retry), a rendered `.dcs-form__submit-error` with `role="alert"` whose `.dcs-form__submit-error-message` is exactly "Submission failed (404)" (no response body — a static host's 404 HTML must never reach the alert), `submit-error` emitted, NO success flip, field values retained. A missing local YAML must render the `.dcs-form--missing` "is not configured" state, not an empty form.
5. **Required-field behavior** — the server skips `section-heading`/`html-block`/`hidden` types and 400s with `Missing required fields: <ids>`; contact-normalizer failures (`ErrInvalidSubmission`) are 400s, not 500s (C-137). Contact-kind forms hard-require name + email + subject + `message` ≥ 10 chars server-side regardless of the YAML's `required` flags.
6. **Field normalization** — on any field `type` change, apply §Form-Field Normalization above (options/html/validation.accept/defaultValue/stale layout props).
7. **End-to-end smoke** — submit against the preview slot (use TEST MODE above to avoid emailing the owner); confirm the `PortalSiteFormSubmissions` row and portal notification. Owner-email expectations differ by config: `kind=email` destinations get values inlined ONLY on non-medical sites with no `isSensitive`/PHI flags — medical sites and `IsSensitive` forms get a redacted/link-only notice, and `lead`/`webhook` destinations send no notification email at all.

## PHI-Log Grep Gate

Forms can carry PHI on medical customer sites (e.g. KEPT). Before shipping any change to the submission path, grep the logging call sites and assert NO field values are logged:

```
grep -rn "slog\.\(String\|Any\)" server/internal/handlers/public_site_forms.go \
  server/internal/handlers/contact_form.go server/internal/handlers/form_test_mode.go \
  server/internal/services/contact/service.go server/internal/services/portal/forms.go
```

Pass criteria: every logged attribute is a slug, id, row/partition key, count, error string, or a **redacted/derived** email (`redactEmail` / `logging.RedactEmail` / `extractEmailDomain` / `submissionEmailDomain`) — never `payload.Values`, `input.Message`, a raw email, name, or phone. Normalizer error strings are static ("name is required") and safe. Client side, `packages/site-forms` console output is: the missing-definition `console.warn` (formId only), the non-production api-base `console.warn`, the DEV-only schema `console.warn`, and `console.error` lines carrying the SERVER RESPONSE (a 4xx body trimmed to 500 chars in `useFormSubmission.ts`; ≤200 bytes of a non-receipt 2xx in `readExpectedJson.ts`) — never the submitted values. So a server error body must never echo field values: it would reach the visitor's console and, via `detail`, the Details toggle.

How PHI is actually handled (so you know what to preserve):

**The site-level PHI signal is `portal.Service.SiteHandlesPHI` and nothing else.** Its authoritative input is `SiteAgentConfigs/{slug}/default.HipaaMode` — the same admin-pinned, audited row driving `handlers.siteContactShouldMinimize` and `contact.submissionCarriesPHI`. A `medical`/`phi-safe`/`hipaa` token in the site's `Features` column is a SUBORDINATE legacy alias kept only so a hand-written row fails safe; no live row carries one and no product surface offers one. Fails CLOSED: an unresolvable HipaaMode signal is treated as PHI. A new PHI input gets OR'd into `SiteHandlesPHI` — never a second predicate in a caller.

- `phi: true` on a field ⇒ excluded from the spam screen (`shouldSkipSpamField`) so PHI never egresses to the AI classifier. **Site-independent** (`managedFormDeclaresPHI` → `ContainsPHI` → `submissionCarriesPHI`). Save-time validation ALLOWS `phi: true` on any site (refusing the flag would forbid the field's only reliable protection); it still requires `submission.kind: lead`. Cost to know: a `phi: true` field also skips AI spam classification for that form.
- `SiteHandlesPHI` true ⇒ `RecordSubmission` replaces `phi: true` field values with `RedactedPlaceholder` in storage (non-PHI fields stay raw — the portal is the authenticated surface), and `RenderSubmissionEmail` sends a deep-link-only email (logging only a `form submission email redacted for PHI compliance` marker).
- `IsSensitive` on the form row ⇒ link-only notification email regardless of the site signal.
- **Webhooks (Q-274=B, delivery-time redaction):** `deliverFormWebhook` redacts the delivered `values` via `portal.RedactSubmissionValuesForWebhook` BEFORE the body is HMAC-signed, so `X-DCS-Signature` always matches the delivered (redacted) bytes. The site verdict is resolved ONCE by the dispatching handler and passed in as a boolean. PHI-handling sites ⇒ `phi: true` values become `RedactedPlaceholder` (mirrors `RecordSubmission`); `IsSensitive` forms ⇒ EVERY value redacted regardless of the site signal (parallel to its link-only email). Receivers still get `siteSlug`/`formId`/`submissionId`/field keys, so a webhook on a PHI form stays usable as a "new submission" signal with a deep-link id — raw content never egresses.
- **Visitor-facing PHI guidance (C-415, Q-393(b) = platform default-ON).** `<DcsForm>` GETs `/api/v1/sites/{slug}/forms/compliance` on mount (memoized per site+base; slug-free `/api/v1/forms/compliance` when the build has no baked slug) and renders a guidance line — *"Please don't include personal health details. A general description of what you need is enough — we'll go over anything specific with you directly."* — immediately above the first free-text field when `siteHandlesPhi` is true. The endpoint is a boolean projection of `SiteHandlesPHI` and nothing else. **Do not read `hipaaMode` off `/agent/config` instead:** it 404s unless the `aiAgent` feature, the per-site toggle and the global kill switch are all on, so a HIPAA-mode tenant without the chat widget would get no guidance — a fail-OPEN gate behind an unrelated flag. **Do not add a YAML flag or prop to force it either way** — a site-local switch can disagree with the tenant's real posture, the class C-352 fixed. Copy lives in `PHI_GUIDANCE_COPY` (`packages/site-forms/src/composables/useSitePhiPosture.ts`), never in the API response. Client fail direction `false` (server-side redaction is the actual control); server fail direction CLOSED. Probe hooks: `[data-form-phi-guidance]` / `.dcs-form__phi-guidance` — the copy deliberately carries no "HIPAA"/"protected health information" legalese, so a probe grepping those reports absent; grep `/personal health details/i`.
- Regression rails: `server/internal/services/portal/forms_phi_gate_test.go` (live-Features encoding kill-test, the HipaaMode-alone regression, the non-divergence invariant, fail-closed, and value-level absence in email + at rest + webhook); `packages/site-forms/src/__tests__/phi-guidance.test.ts` (both directions + an explicit vacuity test); `server/internal/handlers/public_site_form_compliance_test.go` (route not shadowed by `{formId}`, fail-safe, wire-field name).

> **Any mount of `<DcsForm>` issues one GET before any submission.** Tests that stub global `fetch` and assert `toHaveBeenCalledTimes(1)` must filter to `method === 'POST'`, and a stub that `mockResolvedValue`s a single `Response` instance will have its body consumed by the GET (`mockImplementation(async () => new Response(...))` instead).

## Captcha & Spam-Filter Assertions

**Captcha (real mechanism):** `server/internal/services/captcha` supports Cloudflare Turnstile + Google reCAPTCHA, gated by `DCS_CAPTCHA_PROVIDER` + `DCS_CAPTCHA_SECRET` on the server. Unset (the current default — no infra template sets it) ⇒ Verify is a no-op success and the token is ignored. Provider/transport outage ⇒ fails OPEN (submission accepted, `Warn` logged). Definitive provider rejection OR empty token while enabled ⇒ 400 "Captcha verification failed". Client: `<DcsForm :captcha-token>` is an optional prop appended as `captchaToken`. The gate is therefore CONDITIONAL — check the server Container App env first: captcha enabled ⇒ the form MUST wire a widget and pass a non-empty token (an enabled verifier definitively rejects empty ones); disabled ⇒ do not assert token presence. A stale comment in `public_site_forms.go` still says the token is "accepted-and-ignored" — the verification code below it is authoritative.

**Distinguishing silently-dropped spam from delivered submissions.** The spam gate soft-accepts flagged submissions with a success-shaped response and does NOT store them, so a swallowed test looks like success — assert the per-endpoint marker:

| Endpoint | Genuine | Spam soft-accept | Reliable check |
|---|---|---|---|
| `POST /api/v1/sites/{slug}/forms/{formId}/submissions` | 202 with `id` (+ `contactMessageId` for contact kinds, `notificationQueued`) | 202 `{"status":"ok"}` — NO `id` | require `id` in the response |
| `POST /api/v1/sites/{slug}/contact` | 201 `ContactFormResponse` | 200 `{"status":"ok"}` | require status 201 |
| bare `POST /api/v1/contact` (marketing — hardcodes site `dcs-marketing`) | 201 `ContactFormResponse`, random UUID `Id` | ALSO 201 `ContactFormResponse` with a random UUID — indistinguishable from success in the response | only the stored row / portal inbox proves delivery (the response `Id` is a throwaway UUID, not the row key); server log line is `Marketing contact submission rejected` |

The gate itself: `contact.CheckObviousSpam` (deterministic junk check) then the AI `SpamChecker` (Azure OpenAI, only when a key is configured) over NON-PHI fields; it only runs when the composed spam message is non-empty. During testing use genuine-looking data + TEST MODE, and treat any response missing its `id`/201 marker as a spam-swallowed submission, not a pass.

