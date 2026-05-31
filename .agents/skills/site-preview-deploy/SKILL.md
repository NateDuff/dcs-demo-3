---
name: site-preview-deploy
description: Use when building, previewing, or deploying a DCS customer site repo — local build, SpartanMini home-network preview, and Front Door verification. Trigger for preview/deploy issues or pre-push validation in a site repo.
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

## Production Deploy & Verification

- Production deploys go through the owning workflow / deploy CLI (see `deployment-operations`). Customer/prod state (portal registration, Azure infra, production seed) is coordinated in the `dcs-again` monorepo — don't duplicate it in the site repo.
- Verify the **public Front Door URL**, not just the SWA hostname: optional AFD cache purge for the path, then `curl` the production domain and confirm the expected `<title>`.
- For path-prefixed SWA sites, confirm assets resolve at `/<slug>/assets/` and the prefixed + live HTML match.

## Completion Gate

Report build result, preview/deploy target, the verified public URL, and any portal/monorepo coordination still required.

