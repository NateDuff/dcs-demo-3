---
name: site-preview-deploy
description: Use when building, previewing, or deploying a DCS customer site repo — local build, SpartanMini home-network preview, and Front Door verification. Trigger for preview/deploy issues or pre-push validation in a site repo.
metadata:
  docKind: skill
  docClass: guidance
  title: Site Preview & Deploy
  status: Active
  owner: Nathan Duff
  created: 2026-05-31
  lastVerified: 2026-07-03
  stalenessSLA: 90
  relatedDocs:
    - .github/skills/deployment-operations/SKILL.md
    - .github/skills/spartanmini-preview/SKILL.md
  codeRefs:
    - cli/preview/spartanmini-status.ps1
  updateTriggers:
    - Site build / preview / deploy flow changes
    - SpartanMini preview stack or Front Door verification changes
    - A new site-repo preview/deploy gotcha is verified
---
<!-- Delivered from the dcs-again monorepo by cli/ai-guidance/sync-site-guidance.ps1. Do not edit here; edit the canonical source in dcs-again/.github and re-run the sync. -->

# Site Preview & Deploy

Thin site-repo entry point. The deep operational detail lives in the monorepo `deployment-operations` and `spartanmini-preview` skills — this skill is the site-side checklist that points at them.

## Build Gate

- `pnpm build` from the site root must pass before any deploy or PR.
- Respect the site's assigned dev port and preview route (see the site README / `.dcs`).

## Preview (SpartanMini)

- Preview runs on the SpartanMini home-network stack behind a Cloudflare subdomain (e.g. `preview-<slug>.<domain>`). The public hostname is HTTPS; the gateway-to-Vite hop is plain HTTP under `DCS_PREVIEW=true`.
- Use the monorepo wrapper scripts (`cli/preview/spartanmini-*.ps1`) — do not hand-SSH. See the `spartanmini-preview` skill for status/sync/gateway/host-header troubleshooting.
- If a preview works on the primary host but not locally, compare the URL scheme (mkcert HTTPS locally vs plain HTTP on the gateway) before touching the editor bridge.
- `vite preview` binds IPv6 (`::1`) locally: plain `curl` (or `curl -6`) connects but `curl -4 localhost` FAILS — do not read that as a broken build. Keep `curl -4` for Front Door / live verification of `/api/*`, `/ws`, and the `portal.` / `admin.` / `kiosk.` hostnames — there `-4` IS required (`GeoBlockAPI` / `GeoBlockInternal`, `infrastructure/partner/front-door-waf.bicep:209-280`). **Customer-site HTML is NOT geo-restricted** (the template says so outright at `:214-217` — blocking crawlers would harm SEO), so a 403 on a customer site's page is *not* the geo rule and needs a different diagnosis.

## Production Deploy & Verification

- Production deploys go through the owning workflow / deploy CLI (see `deployment-operations`). Customer/prod state (portal registration, Azure infra, production seed) is coordinated in the `dcs-again` monorepo — don't duplicate it in the site repo.
- Verify the **public Front Door URL**, not just the SWA hostname: optional AFD cache purge for the path, then `curl` the production domain and confirm the expected `<title>`.
- For path-prefixed SWA sites, confirm assets resolve at `/<slug>/assets/` and the prefixed + live HTML match.

## Completion Gate

Report build result, preview/deploy target, the verified public URL, and any portal/monorepo coordination still required.

