---
name: site-forms
description: Use when adding or editing a managed form on a DCS customer site — `<DcsForm>` wiring, the site↔portal↔provision 3-way schema sync, form-field normalization, and the visual-editor managed-form affordance. Trigger for contact/intake/questionnaire forms or form submission issues.
---
<!-- Delivered from the dcs-again monorepo by cli/ai-guidance/sync-site-guidance.ps1. Do not edit here; edit the canonical source in dcs-again/.github and re-run the sync. -->

# Site Forms

DCS manages customer site forms end-to-end so every submission lands in one portal inbox. Never wire a site form to a third-party provider (Formspree, Netlify Forms, etc.) — submissions must reach the DCS portal.

## The `<DcsForm>` Consumer

Render the managed form from `@duffcloudservices/site-forms`:

```html
<DcsForm form-id="contact" :site-slug="<slug>" :api-base="apiBase" :forms-modules="formsModules" />
```

It posts to `POST {apiBase}/sites/<slug>/forms/<formId>/submissions` and surfaces in the portal Contact Inboxes view.

## Three-Way Schema Sync (all must agree)

A form only flows submissions when these three stay in sync:

1. **`.dcs/forms/<formId>.yaml`** — site-side schema (validated against `contracts/dist/form-definition.schema.json`).
2. **`cli/provision/<slug>/PortalSiteForms.json`** (in the DCS monorepo) — the same schema serialized as `SchemaJSON`.
3. **`cli/provision/<slug>/PortalSites.json`** (in the DCS monorepo) — `Features` must include the form's feature flag (e.g. `contactForm`).

Author the form in the portal Form Manager (through `https://localhost:4000`, not raw Vite), then snapshot the canonical YAML into the site repo.

## Form-Field Normalization (portal field editor)

When a field's `type` changes, normalize the `PortalFormField` payload: seed/drop `options`, set `html` ownership, `validation.accept`, the `defaultValue` shape, and clear layout-only stale props. Keep the nested detail-sheet index in sync on reorder/remove/add. Rename a field id through the store action (kebab-case, dedupe, and repair `steps[].fieldIds` + any `visibleIf.fieldId`).

## Visual-Editor Managed-Form Affordance

The managed surface is marked with `[data-form-key]`. The "edit this form" affordance lives in the shared `editorBridge.ts` and emits a `dcs:managed-form-click` event; portal forwarding stays thin, and every entry point (preview, toolbar, context menu) converges on one destination. This is the same first-party pattern as managed reviews (`data-dcs-reviews`) — runtime markers → shared bridge → one portal workflow → durable truth (the portal record, not the preview DOM).

## Validation

- A PHI-flagged form must NOT log submission values through `internal/logging` — assert via grep before shipping.
- Submit one real submission against the preview slot; confirm a `PortalSiteFormSubmissions` row, the portal notification, and the site-owner email all fire.
- The captcha token must be non-empty in the submission payload.

