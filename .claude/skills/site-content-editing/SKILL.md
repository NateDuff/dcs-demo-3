---
name: site-content-editing
description: Use when editing managed content in a DCS customer/prospect/demo site repo — pages, routes, editable text, images, and SEO that flow through the DCS portal CMS and visual editor. Trigger for page/route changes, `.dcs` metadata sync, text-key edits, managed images, or local search.
metadata:
  docKind: skill
  docClass: guidance
  title: Site Content Editing
  status: Active
  owner: Nathan Duff
  created: 2026-05-31
  lastVerified: 2026-09-23
  stalenessSLA: 90
  relatedDocs:
    - .github/skills/site-design-system/SKILL.md
    - .github/skills/site-forms/SKILL.md
    - .github/instructions/site-submodules.instructions.md
  codeRefs:
    - packages/cms/src/composables/useTextContent.ts
    - packages/cms/src/components/ManagedImage.vue
    - portal/src/components/visual-editor/VisualPageEditor.vue
  updateTriggers:
    - .dcs metadata schema or editor DOM markers change
    - getArray or list-array editing contract changes
    - Managed image or CDN asset pipeline changes
---
<!-- Delivered from the dcs-again monorepo by cli/ai-guidance/sync-site-guidance.ps1. Do not edit here; edit the canonical source in dcs-again/.github and re-run the sync. -->

# Site Content Editing

Customer sites are managed by the DCS portal CMS and visual editor. Content edits must keep the site repo and the portal in sync, or the visual editor and snapshot capture break.

## Keep `.dcs` Metadata in Sync (same branch as the change)

| File | Owns | Rule |
|------|------|------|
| `.dcs/pages.yaml` | page/route registration | Update when adding/removing a user-managed page or route. Keep protected system pages (`home`, `blogs`, topics) `deletable: false`. |
| `.dcs/content.yaml` | editable text keys | Every `useTextContent` `t('<key>')` must have a matching entry. **Since cms 0.7 these values are applied at PRERENDER, not just at hydration** (the fleet is on 0.13.x), so a stale provision-era seed value is baked into `dist/` and is **crawler-visible HTML**, not just something the editor shows. After any content-key edit — and always after a cms bump — run the text-key flip audit: `node cli/text-key-audit.mjs` (procedure in `cms-fleet-bump`). |
| `.dcs/seo.yaml` | per-page SEO | Limit to active pages only. |
| `.dcs/forms/<id>.yaml` | managed form schema | See the `site-forms` skill. |

## Visual-Editor Markers

The portal visual editor and full-page screenshot capture discover content through DOM markers — keep them intact:

- `data-section` / `data-section-label` on each editable section.
- `data-text-key="<key>"` on editable text, mirrored in `.dcs/content.yaml`.
- For managed imagery, prefer a real `<picture>` / `<img data-dcs-image-key>` layer backed by `.dcs/content.yaml`/`.dcs/pages.yaml` over a CSS-only `background-image` URL, so the editor can replace the asset and screenshots can see it. An image is editor-replaceable and responsive only when managed (`ManagedImage` / CDN `assets/<uuid>` URLs); a raw `/images/*` path is neither.
- Editable content flows through `useTextContent` `t()` keys and `ManagedImage`; keep keys, markers, and `.dcs/content.yaml` aligned.

## Editor-Configurable Lists (arrays)

- To make a card list add/remove/edit-able from the visual editor, mirror CareersView: `getArray('<base>')` + dot-numeric `base.N.field` keys (the index must be the 2nd dot-segment) + ideally an `arrayKeys` entry for the page in `.dcs/pages.yaml`. The `arrayKeys` entry is a **recommendation, not a requirement** — `visualEditor.ts:888-898` falls back to `autoDetectArrayKeys(pageSlug)` when it is absent, and that handles 0-based indices fine (1-based is only the `addArrayItem` seed).
- `getArray` (`packages/cms/src/composables/useTextContent.ts`) only parses `<base>.<N>.<field>` — it returns nothing for 2-segment (`services.service.N`) or hyphenated (`steps.step-N`) bases, so you must **render** those yourself. The portal editor and `editorBridge` handle both shapes (they match `/\.\d+\./` and `/\.\w+-\d+\./`), so those lists get the List icon and a working array editor and **do** grow from the editor.
- Text arrays are text-only (`ArrayTextEditor.vue`), but **media-carousel arrays are not** — `MediaCarouselEditor.vue` (wired at `ArrayEditSheet.vue:7`) gives items a `url`/`type`/`alt` triple with the image picker and auto-detected `image | video | youtube | facebook-* | instagram-*` types. Remove still leaves index gaps (no reindex; `addArrayItem` uses `max(existing)+1`); reorder is still unimplemented. Persist href-only `link` fields into `.dcs/content.yaml` or the panel shows blanks.

## Local Search (VitePress sites)

- VitePress MiniSearch indexes the `.md` body only. For component-driven pages, add a hidden `search-content` div (with `aria-hidden`) so the page is findable.
- Configure `search: { provider: 'local' }`. Verify the generated `@localSearchIndex*.js` has a non-zero `documentCount` after build.

## Validation

- `pnpm build` from the site root must pass.
- After visual changes, screenshot the affected pages in light + dark and confirm the design matches and framework chrome hasn't bled into the isolated page subtree (see `site-design-system`).
- Confirm new/renamed routes resolve and appear in the portal editor.

