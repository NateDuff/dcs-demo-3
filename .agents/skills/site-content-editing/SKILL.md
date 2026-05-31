---
name: site-content-editing
description: Use when editing managed content in a DCS customer/prospect/demo site repo — pages, routes, editable text, images, and SEO that flow through the DCS portal CMS and visual editor. Trigger for page/route changes, `.dcs` metadata sync, text-key edits, managed images, or local search.
---
<!-- Delivered from the dcs-again monorepo by cli/ai-guidance/sync-site-guidance.ps1. Do not edit here; edit the canonical source in dcs-again/.github and re-run the sync. -->

# Site Content Editing

Customer sites are managed by the DCS portal CMS and visual editor. Content edits must keep the site repo and the portal in sync, or the visual editor and snapshot capture break.

## Keep `.dcs` Metadata in Sync (same branch as the change)

| File | Owns | Rule |
|------|------|------|
| `.dcs/pages.yaml` | page/route registration | Update when adding/removing a user-managed page or route. Keep protected system pages (`home`, `blogs`, topics) `deletable: false`. |
| `.dcs/content.yaml` | editable text keys | Every `useTextContent` `t('<key>')` must have a matching entry. |
| `.dcs/seo.yaml` | per-page SEO | Limit to active pages only. |
| `.dcs/forms/<id>.yaml` | managed form schema | See the `site-forms` skill. |

## Visual-Editor Markers

The portal visual editor and full-page screenshot capture discover content through DOM markers — keep them intact:

- `data-section` / `data-section-label` on each editable section.
- `data-text-key="<key>"` on editable text, mirrored in `.dcs/content.yaml`.
- For managed imagery, prefer a real `<picture>` / `<img data-dcs-image-key>` layer backed by `.dcs/content.yaml`/`.dcs/pages.yaml` over a CSS-only `background-image` URL, so the editor can replace the asset and screenshots can see it.
- Editable content flows through `useTextContent` `t()` keys and `ManagedImage`; keep keys, markers, and `.dcs/content.yaml` aligned.

## Local Search (VitePress sites)

- VitePress MiniSearch indexes the `.md` body only. For component-driven pages, add a hidden `search-content` div (with `aria-hidden`) so the page is findable.
- Configure `search: { provider: 'local' }`. Verify the generated `@localSearchIndex*.js` has a non-zero `documentCount` after build.

## Validation

- `pnpm build` from the site root must pass.
- After visual changes, screenshot the affected pages in light + dark and confirm the design matches and framework chrome hasn't bled into the isolated page subtree (see `site-design-system`).
- Confirm new/renamed routes resolve and appear in the portal editor.

