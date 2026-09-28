---
name: site-submodule-operations
description: Use when working in DCS standalone customer, prospect, or demo site repos, including site-local guidance, .dcs metadata, preview/deploy expectations, and cross-repo handoffs.
metadata:
  docKind: skill
  docClass: guidance
  title: Site Operations
  status: Active
  owner: Nathan Duff
  created: 2026-03-06
  lastVerified: 2026-07-10
  stalenessSLA: 90
  relatedDocs:
    - .github/instructions/site-submodules.instructions.md
    - .github/skills/site-preview-deploy/SKILL.md
    - .github/skills/deployment-operations/SKILL.md
  codeRefs:
    - server/internal/services/sitedeployments/service.go
  updateTriggers:
    - Site repo deploy workflow contract (.dcs/site.yaml fields) changes
    - Snapshot storage/container contract changes
    - A new cross-repo handoff landmine is live-verified
---
<!-- Delivered from the dcs-again monorepo by cli/ai-guidance/sync-site-guidance.ps1. Do not edit here; edit the canonical source in dcs-again/.github and re-run the sync. -->

# Site Operations

Customer/prospect/demo sites are standalone sibling repos, not normal monorepo folders. Local site guidance wins unless a DCS-wide safety rule applies.

## Start Here

1. Identify the actual site repo path, usually a sibling under `E:\source\repos\`.
2. Read the site's local README and `.github/copilot-instructions.md` if present.
3. Read DCS `AGENTS.md` and `.github/instructions/site-submodules.instructions.md` for cross-repo invariants.
4. Check `.dcs/site.yaml` (older sites: `.dcs/site.json`), `.dcs/pages.yaml`, and package scripts before editing.

## Invariants

- When adding a user-managed page, update `.dcs/pages.yaml` on the same branch.
- Keep protected system pages (`home`, `blogs`, `topics`) non-deletable.
- Do not assume every site uses the same framework, branch names, or preview route.
- Keep customer-specific secrets out of commits.
- Coordinate DCS portal/server changes separately from site repo changes.

## Preconditions for Site-Repo Deploy

Before triggering the site's `site-deploy.yml`, confirm `.dcs/site.yaml` (older sites: `.dcs/site.json`) carries the fields the workflow greps out of it:

- `swa_resource_id` — full SWA Azure resource id. Missing = hard workflow error (the one field that fails loudly).
- `azure.client_id`, `azure.tenant_id`, `azure.subscription_id` — consumed by `azure/login` (tenant id falls back to repo `vars.AZURE_TENANT_ID`).
- `prod_appinsights_connection_string` / `dev_appinsights_connection_string` — injected as `VITE_*` env at build. Missing = GREEN run that ships a site with no telemetry (silent).
- `google_analytics_id` — the GA injection step is skipped when empty (silent).
- `build_dir` — silently defaults to `"site"`. A root-built Vue site that omits `build_dir: .` passes this step and fails later with "no package.json in build_dir".
- `dedicated_preview_swa` — the C-114/C-223 preview-environment trap; silent when absent.
- `api_base_url`, `pkg_root` — both defaulted silently.
- `production_url` / `preview_url` (+ `preview_base_path`) — post-deploy verification and snapshot targets; blank values verify nothing.

The silent fields are the trap: the workflow stays green. On a first deploy, spot-check the run's site-configuration echo lines (`gh run view <run-id> --log`) for blank values before calling it done.

## Common Tasks

- Design or content change: follow site-local component/style conventions first.
- Portal editor compatibility: verify `.dcs` metadata and page registration.
- Preview/deploy issue: use the site's README, then DCS deployment or SpartanMini skills if relevant.
- Contact/forms/auth features: verify the PortalSites feature flags and backend endpoints before changing site UI.

## Snapshot Storage / Container Contract

- Resolve the snapshot container with `siteRow.GetStorageContainerName()`, never `siteRow.Slug`.
- Two container contracts, resolved by `siteRow.GetStorageContainerName()` (`server/internal/services/portal/snapshots.go:177-193`) — **never** by `Slug`. **Unconfigured default** = the `<slug>` container, roots `["site-snapshots"]`. **Configured and different from the slug** (e.g. `"content"`, `"shared-assets"`) = roots `["<slug>", "site-snapshots"]` — i.e. the configured case probes **both**; it is not an either/or. (Seeds show both shapes live: kept `"content"`, iron-oak its own slug, boogie-babies `""`.) When diagnosing snapshot read/write drift, probe both blob roots.
- The SAS scope and `blobEndpoint` must target the real container. Snapshot upload-vs-read drift lives in `sitedeployments/service.go`.

## Legacy Site Handoff (homepage bridge)

- A homepage-only bridge: do **not** rename the slug, preview path, or Azure resource IDs.
- Treat `.dcs/pages.yaml` as integration state; keep the protected `home` page non-deletable.

