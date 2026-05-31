---
name: site-submodule-operations
description: Use when working in DCS standalone customer, prospect, or demo site repos, including site-local guidance, .dcs metadata, preview/deploy expectations, and cross-repo handoffs.
---
<!-- Delivered from the dcs-again monorepo by cli/ai-guidance/sync-site-guidance.ps1. Do not edit here; edit the canonical source in dcs-again/.github and re-run the sync. -->

# Site Operations

Customer/prospect/demo sites are standalone sibling repos, not normal monorepo folders. Local site guidance wins unless a DCS-wide safety rule applies.

## Start Here

1. Identify the actual site repo path, usually a sibling under `E:\source\repos\`.
2. Read the site's local README and `.github/copilot-instructions.md` if present.
3. Read DCS `AGENTS.md` and `.github/instructions/site-submodules.instructions.md` for cross-repo invariants.
4. Check `.dcs/site.json`, `.dcs/pages.yaml`, and package scripts before editing.

## Invariants

- When adding a user-managed page, update `.dcs/pages.yaml` on the same branch.
- Keep protected system pages (`home`, `blogs`, `topics`) non-deletable.
- Do not assume every site uses the same framework, branch names, or preview route.
- Keep customer-specific secrets out of commits.
- Coordinate DCS portal/server changes separately from site repo changes.

## Common Tasks

- Design or content change: follow site-local component/style conventions first.
- Portal editor compatibility: verify `.dcs` metadata and page registration.
- Preview/deploy issue: use the site's README, then DCS deployment or SpartanMini skills if relevant.
- Contact/forms/auth features: verify the PortalSites feature flags and backend endpoints before changing site UI.

## Snapshot Storage / Container Contract

- Resolve the snapshot container with `siteRow.GetStorageContainerName()`, never `siteRow.Slug`.
- Two container contracts: **default** = `content` container with `<slug>/...` paths; **custom** = `<slug>` container with `site-snapshots/...` paths. When diagnosing snapshot read/write drift, probe both blob roots.
- The SAS scope and `blobEndpoint` must target the real container. Snapshot upload-vs-read drift lives in `sitedeployments/service.go`.

## Legacy Site Handoff (homepage bridge)

- A homepage-only bridge: do **not** rename the slug, preview path, or Azure resource IDs.
- Treat `.dcs/pages.yaml` as integration state; keep the protected `home` page non-deletable.

