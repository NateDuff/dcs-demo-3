---
name: dcs-seo
description: Use when auditing or improving SEO/GEO/AEO on a DCS customer site — crawlability, metadata, structured data (JSON-LD), local SEO/NAP, AI discovery (llms.txt + AI-bot robots), sitemap/robots/links, GEO citable-content, and Core Web Vitals. Audits the BUILT dist HTML (what crawlers see) and emits fixes THROUGH the cms SEO factory + `.dcs/seo.yaml` — never hand-edited markup. Supersedes the per-site local-business-schema / local-seo / *-seo-audit skills.
---
<!-- Delivered from the dcs-again monorepo by cli/ai-guidance/sync-site-guidance.ps1. Do not edit here; edit the canonical source in dcs-again/.github and re-run the sync. -->

# DCS SEO (canonical, factory-aware)

The one cross-cutting SEO/GEO/AEO skill for the DCS customer-site fleet. Customer sites are **local-service businesses** on **Vue-SPA** (`vite-ssg` prerender) or **VitePress** (SSG), served behind Front Door / Azure SWA, all sharing one **cms SEO factory**. That factory (`dcsSeoPlugin` → `emitStaticHtml` for SPA, `transformPageData` for VitePress) **bakes per-page title / description / canonical / OG / Twitter / JSON-LD into crawler-visible static HTML at build time**.

Two consequences define how this skill works:

1. **Audit the built `dist/` HTML, not the source.** That is exactly what a crawler sees. `pnpm dev` does NOT run the factory (and `dcsCdnImagePlugin` is off in dev), so source-only or dev-only audits lie.
2. **Emit fixes through the factory + `.dcs/` metadata, never hand-edited markup.** A fix is a change to `seo.yaml` / `content.yaml` / `site.yaml` / blog frontmatter, or to the shared cms factory. A hand-edited `<meta>`/`<script type="application/ld+json">` in a `.vue`/`.md` is a regression — the next build overwrites it or it drifts from the single source of truth.

> **The recurring false-positive this skill exists to kill:** "empty-shell SPA / no JSON-LD in static HTML / consider prerendering" (or for VitePress "this site does NOT inject SEO yet"). That was true before cms 0.6.0; **`emitStaticHtml`/`transformPageData` made it false.** A *sparse per-page `seo.yaml` is NOT missing SEO* — the factory bakes per-page meta even with thin overrides. **Curl the built page before claiming SEO is absent.** (See Verifier pass.)

Do NOT edit `packages/cms` from this skill — another workflow owns the factory code. This skill *asserts the factory contract*, *wires/configures the factory per site*, and *emits content/metadata fixes*. When a gap is genuinely a factory capability gap (a missing emitter), file it as a platform finding, don't hand-patch markup.

---

## Rule constants (DATED — re-verify when stale)

`RULES_REVIEWED = 2026-06-19`. **Freshness gate: if today is more than 90 days after `RULES_REVIEWED` (i.e. after 2026-09-17), STOP and re-verify every constant below against current Google/Bing/AI-engine guidance before reporting findings, then bump `RULES_REVIEWED` in this file.** Search-engine and AI-engine rules move faster than skills; an unverified rule is how the 7 stale site-local skills shipped a false "no JSON-LD" claim for months.

| Constant | Value @ 2026-06-19 | Implication for the audit |
|----------|--------------------|---------------------------|
| `FAQ_RICH_RESULT` | Google FAQ rich result **removed for most sites 2023-08 / fully deprecated 2026-05-07** | Still emit `FAQPage` (AI engines + Bing parse it) but do NOT promise a Google rich-result; only from REAL on-page Q&A. |
| `HOWTO_RICH_RESULT` | **dead since 2023-09** | Do not recommend `HowTo` schema for rich results. |
| `CWV_INTERACTION` | **INP replaced FID 2024-03** | Field metric is INP. In the lab use **TBT as the INP proxy** (no synthetic INP). |
| `AI_CRAWLERS_NO_JS` | AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, OAI-SearchBot, Applebot-Extended) **do not execute JS** | SEO/JSON-LD MUST be in the baked static HTML, not injected at runtime. This is the whole reason `emitStaticHtml` matters. |
| `SUPPORTED_LD_TYPES` | Organization, WebSite, LocalBusiness (+subtypes), Service, BreadcrumbList, BlogPosting/Article, Person, FAQPage, Review, AggregateRating, RealEstateAgent, LegalService, MedicalBusiness, HomeAndConstructionBusiness, BeautySalon | JSON-LD of any *other* `@type` is a finding (unsupported / hallucinated type). |
| `GEO_CITATION_LEVERS` | Princeton GEO study: **statistics ~+40%, cite-sources ~+40%, quotations ~+28%** citation uplift; keyword-stuffing ≈ negative | The GEO lint rewards answer-first + stats + cited sources, not keyword density. |
| `TITLE_BUDGET` / `DESC_BUDGET` | title ≤ 60 chars, description 50–155 chars | Matches `cli/seo-coverage-audit.mjs` defaults. |

If you cannot confirm a constant is current, treat it as **stale** and flag it rather than enforcing it silently.

---

## Inputs this skill reads (the `.dcs` metadata + build output)

| Source | Owns | Used for |
|--------|------|----------|
| `dist/` (or `docs/.vitepress/dist/`) built HTML | the bytes crawlers see | the audit target — **build first**, then read |
| `.dcs/site.yaml` | tenant identity, production `siteUrl`, NAP root | canonical NAP, absolute sitemap/canonical/OG URLs, LocalBusiness subtype |
| `.dcs/content.yaml` | editable text keys, NAP copy, reviews | NAP byte-match, REAL reviews for Review/AggregateRating, llms.txt facts |
| `.dcs/seo.yaml` | per-page SEO overrides | per-page title/description/OG; **sparse ≠ missing** |
| `.dcs/pages.yaml` (SPA) / `docs/**/*.md` (VitePress) | route manifest | sitemap enumeration, orphan/link-depth, BreadcrumbList hierarchy |
| blog frontmatter | post author/date/title | BlogPosting + author Person + visible `dateModified` |
| `.dcs/ai-guidance.json` | which shared skills this repo loaded | confirm `dcs-seo` is registered so agents load it |

**Fixes write back into these same files** (and only these) — mirroring how `site-content-editing` / `site-preview-deploy` stay metadata-aware.

---

## How to run an audit (always build first)

```powershell
# 1. Build so the factory bakes the static HTML (dev does NOT run it).
pnpm build                       # SPA: vite-ssg prerender → dist/ ; VitePress → docs/.vitepress/dist/

# 2. Run the existing per-route coverage gate over the BUILT dist.
node cli/seo-coverage-audit.mjs <siteDir> --verbose            # title + JSON-LD + og:title + route-diff + length budgets
node cli/seo-coverage-audit.mjs <siteDir> --json --strict-lengths   # machine-readable, length budgets HARD-fail

# 3. Curl the built page (no JS) to confirm what a non-JS AI crawler actually receives.
#    (Do this against dist/ locally, or the live prod URL after deploy.)
```

`cli/seo-coverage-audit.mjs` already asserts per-route: non-default/non-duplicated `<title>` (FAIL), ≥1 parseable JSON-LD (FAIL), present non-default `og:title` (FAIL), configured-but-unemitted route diff (FAIL), orphan emissions (WARN), and SERP length budgets (WARN, or FAIL with `--strict-lengths`). **This skill extends that tool's checklist into the eight areas below.** When a check is missing from the tool, add it to `cli/seo-coverage-audit.mjs` rather than re-implementing ad hoc.

---

## The eight areas (one checklist each)

### 1. seo-ci-gate — the contract enforcer (build-fail evidence gate)

Assert on the **built `dist/` HTML, curl'd without JS execution**:

- [ ] **Factory is wired.** SPA: `dcsSeoPlugin({ emitStaticHtml: true, ... })` present AND the prerender ran. VitePress: `transformPageData` wired in `.vitepress/config`. A plugin registered with no options / `emitStaticHtml:false` / no `transformPageData` is **present-but-unwired** — the silent coron8 (zero JSON-LD) and lamphere (zero baked meta) failure class. FAIL.
- [ ] Every emitted route has a `<title>` that is non-default and unique across routes.
- [ ] Every route has a **self-referential `<link rel="canonical">`** at the absolute production URL (from `site.yaml siteUrl`).
- [ ] Every route has **≥1 JSON-LD block present in the static HTML without JS**.
- [ ] `robots.txt`, `sitemap.xml`, `llms.txt` **exist and are real** — not the SWA `navigationFallback` SPA shell. A `200 text/html` SPA index at `/robots.txt` is **worse than a 404** (crawler gets HTML where it expects directives). FAIL.
- [ ] JSON-LD is **valid**: parses; `@context` is exactly `https://schema.org` (the literal `@@context` double-@ bug k9 shipped is a hard FAIL); only `SUPPORTED_LD_TYPES`; no placeholder values (`(248) 555-0199`, `example.com`, `Lorem`, `YOUR_`, empty required fields).
- [ ] **Single `<h1>` per page** (hidden VitePress `search-content` divs can introduce a duplicate h1 — that is a FAIL).
- [ ] Every `<img>` has a non-empty `alt`; OG + Twitter card tags complete; OG image is an **absolute** URL (relative OG images are rejected by social scrapers).
- [ ] **0–100 GEO score ≥ threshold** (default `GEO_FAIL_BELOW = 60`). Score = weighted roll-up of areas 2–8 (schema depth, NAP match, AI-discovery files, citable-content levers, CWV budget). Below threshold = build-fail/SARIF, mirroring geo-optimizer-style gates. **(PLANNED — the score engine is not yet built in code; see the area-8 status note.)**

Evidence required for every finding: the **file path / route / URL + the offending line or curl excerpt**. No vibes.

### 2. seo-schema — factory-aware structured data (audit the `@graph`, not hand markup)

Verify what the factory bakes, by `@type`:

- [ ] **`Organization`** + **`WebSite`** sitewide (every site is missing these by default today).
- [ ] **`LocalBusiness` with the correct subtype** for the trade: `MedicalBusiness` (PT/clinic), `HomeAndConstructionBusiness` (contractor/handyman), `BeautySalon` (esthetics), `LegalService` (law), `RealEstateAgent` (realty).
- [ ] **`BreadcrumbList`** from route/path depth (near-universally missing) — auto-derive from the route hierarchy.
- [ ] **`Service`** per service page; **`BlogPosting`/`Article`** + author `Person` from blog frontmatter on posts.
- [ ] **`FAQPage` from REAL on-page Q&A only** — never invent Q&A to manufacture schema. (Several sites already show Q&A copy on the page with no FAQPage node — that is the highest-leverage single fix.)
- [ ] **`Review`/`AggregateRating` only when real reviews exist** in `content.yaml` / on the page. Never fabricate rating counts (mi-handyman's hardcoded 5.0/47 is the anti-pattern).
- [ ] Nodes stitched into **one `@graph` with stable `@id` IRIs** (Organization → LocalBusiness → Service → Person → AggregateRating) so AI engines resolve entities.

If an emitter for a needed type does not exist in the factory, that is a **platform finding** (O2 schema-completeness pass), not a markup hand-edit.

### 3. seo-local — NAP / GBP entity match (highest ROI for a local-service fleet)

- [ ] LocalBusiness **name + telephone + streetAddress + addressLocality + postalCode** in the JSON-LD **byte-match** `site.yaml` / `content.yaml` and the on-page footer copy.
- [ ] Those values **match the Google Business Profile record** — flag any drift (NAP consistency is a top local-pack ranking factor).
- [ ] **Correct LocalBusiness subtype** (see area 2).
- [ ] `areaServed`, `openingHours`, and `geo` are complete (not region/country only).
- [ ] **Single canonical NAP**: footer copy, JSON-LD, and `llms.txt` all derive from the one `site.yaml`/`content.yaml` source — no second hardcoded copy. This also hardens against the multi-tenant **identity-leak landmine** (a stale value once leaked one tenant's NAP/banner onto another site; k9 shipped another tenant's URLs in its sitemap).

### 4. seo-ai-discovery — llms.txt + AI-bot robots tiers

- [ ] **`llms.txt`** (and optionally `llms-full.txt`) emitted at build: business name, NAP, services, and key URLs sourced from `content.yaml` — the answer-engine entry point.
- [ ] **`robots.txt` names the AI crawler tiers explicitly** with an allow policy: GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended, CCBot, plus a `Sitemap:` line. (kduff-homes is the proof-of-correct reference — it ships exactly this and scored A on GEO.)
- [ ] Remember `AI_CRAWLERS_NO_JS`: everything an answer engine needs must be in baked HTML + these static files, never JS-injected.

`llms.txt` is low-impact for *ranking* today, but the AI-bot policy + answer-engine entry point are cheap build-time insurance where local AI-Overview / local-pack visibility now converges.

### 5. seo-sitemap & seo-links

- [ ] **`sitemap.xml`** enumerated from the route manifest (`pages.yaml` for SPA, the VitePress page graph for docs): **absolute production URLs** from `site.yaml siteUrl`, `noindex` routes excluded, `lastmod` from content/git.
- [ ] The sitemap lists **this tenant's** URLs only (k9 shipping nicduff.com URLs is the cross-tenant bug to catch).
- [ ] **Orphan-page + link-depth report**: every indexable route reachable within a sane click depth; no orphan emissions; internal links resolve.
- [ ] **`BreadcrumbList` auto-derived** from the route hierarchy (ties to area 2).

### 6. seo-geo / seo-aeo — Princeton CITABLE-content lint

Lint page copy (built HTML) for the levers in `GEO_CITATION_LEVERS`:

- [ ] **Answer-first lead** — the page answers its core question in the opening sentences (RAG/extraction-friendly), not after three paragraphs of preamble.
- [ ] **Question-shaped H2/H3** that mirror how users ask (these become the FAQPage/AEO surface).
- [ ] **≥1 statistic and ≥1 cited source** per substantive page (the two ~+40% levers). A claim with a number and a citation gets cited back by answer engines.
- [ ] **Visible `dateModified`** on the page, wired to the schema's `dateModified` (freshness signal AI engines read).
- [ ] **Short, self-contained paragraphs** — RAG chunks cleanly. Reward quotable sentences (~+28% lever); penalize keyword-stuffing.

These are **content findings emitted through `content.yaml` / frontmatter**, surfaced for the content owner — schema cannot rescue thin content.

### 7. seo-cwv — Core Web Vitals budget

- [ ] Per-route **Lighthouse budget** (`budget.json`) on the existing Actions runner (free-tier safe — no new infra). Use **TBT as the lab INP proxy** (`CWV_INTERACTION`); pull field LCP/INP/CLS from CrUX/PageSpeed where available.
- [ ] **Image weight**: hero/headshot/OG assets are the recurring CWV liability (multi-MB headshots/heroes). Require WebP/AVIF + `srcset` + explicit dimensions via the existing `dcsCdnImagePlugin`/`ManagedImage` path — do not hand-author `<img>`.
- [ ] Surface the per-route budget result alongside the GEO score.

### 8. Reporting & the portal surface

- Roll the eight areas into the **0–100 GEO score** per page and per site.
- Where wired, surface that score in the portal `SiteSeoView.vue` so SEO standing is a first-class product surface (don't build new portal UI from this skill unless asked — note it as the integration point).

> **Status (2026-06-22): the 0-100 GEO score is PLANNED, not yet computed in code.** No script or service currently produces the weighted roll-up, and the portal does not display it. It is being built as a server-side live-fetch scorer in the Managed SEO Experience plan (ADO Feature #513 / story #520). Until it ships, treat the score as a target, not a shipped number — do not claim a site "scored X" from this skill unless you computed it yourself in the audit.

---

## Verifier pass (run BEFORE reporting — mandatory)

Popular agentic-SEO skills end with a Verifier; ours must, because the dominant historical error here is a *false* finding, not a missed one.

1. **De-dup + contradiction sweep.** Drop any finding contradicted by evidence. Specifically: **before asserting "no JSON-LD / empty shell / not injecting SEO," curl the BUILT page and grep for `application/ld+json` and a non-default `<title>`.** If they are present, the factory is working — suppress the false-positive and instead audit schema *depth* (area 2). This single check is what the 7 stale site-local skills lacked.
2. **Sparse ≠ missing.** A thin per-page `seo.yaml` is not a defect on its own — the factory supplies baked defaults. Only flag a page whose *built* meta is actually default/duplicated/absent.
3. **Evidence on every finding.** Each finding carries file/line/route/URL + the exact offending bytes (or a curl excerpt). Strip any finding you cannot back with evidence.
4. **Fix-path check.** Every recommended fix routes through `seo.yaml` / `content.yaml` / `site.yaml` / frontmatter / the shared factory — **reject any fix that hand-edits baked markup.**
5. **Freshness check.** Confirm `RULES_REVIEWED` is within 90 days; if not, re-verify constants first (see the freshness gate above).

---

## Anti-patterns

- **Claiming "no JSON-LD / empty-shell SPA / prerender needed"** without curling the built `dist` page — the #1 stale-skill false-positive; `emitStaticHtml`/`transformPageData` already bake it.
- **Treating a sparse `seo.yaml` as "missing SEO"** — the factory bakes per-page defaults; a sparse override is normal.
- **Auditing source files or `pnpm dev` output** — the factory and `dcsCdnImagePlugin` run only at build; audit `dist/`.
- **Hand-editing `<meta>`/JSON-LD/canonical in a `.vue` or `.md`** — drifts from the single source of truth; next build clobbers it. Emit through `.dcs` + the factory.
- **Inventing FAQPage Q&A, Review counts, or AggregateRating** to manufacture schema — REAL on-page content only; fabrication is an E-E-A-T and trust liability.
- **Letting `robots.txt`/`sitemap.xml`/`llms.txt` fall through to the SWA shell** — a 200 HTML response there is worse than a 404; assert a real file.
- **Editing `packages/cms`** from this skill — file factory capability gaps as platform findings; another workflow owns the factory.
- **Cross-tenant bleed** — verify the sitemap/NAP/schema reference *this* tenant only (the nicduff-in-k9-sitemap / leaked-NAP class of bug).

