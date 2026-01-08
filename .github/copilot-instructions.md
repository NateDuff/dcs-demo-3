# GitHub Copilot Instructions for Astro Demo Site

This is a demo site for **Duff Cloud Services (DCS)** CMS integration. It showcases the Astro framework with runtime content management.

## Project Overview

- **Framework**: Astro
- **CMS Package**: `@duffcloudservices/cms-astro`
- **Site Slug**: `demo-3`
- **Purpose**: Demonstration of DCS CMS content editing capabilities

## Technology Stack

- Astro 5.x with Tailwind CSS 4
- Tailwind CSS for styling
- DCS CMS integration for runtime content management
- TypeScript for type safety

## How This Site Works

### Content Management

This site uses DCS's CMS system where text content can be edited at runtime without code changes:

1. **Default content** is defined in components using `getTextContent()`
2. **Runtime overrides** are loaded from the DCS API based on `VITE_SITE_SLUG`
3. **Portal users** can edit text via the DCS Portal without deploying

### Text Key Pattern

```astro
---
import { getTextContent } from '@duffcloudservices/cms-astro'
const text = getTextContent({
  'hero.title': 'Welcome to Astro',
  'hero.description': 'The web framework for content-driven sites'
})
---
<h1>{text('hero.title')}</h1>
```

- Text keys are hierarchical: `component.element.modifier`
- Default values render during SSG/SSR
- Overrides take precedence at runtime

## Project Structure

```
src/
├── components/     # Astro components
├── layouts/        # Page layouts
├── pages/          # File-based routing
└── styles/         # Global styles
```

## Development Commands

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Preview the built site
pnpm preview
```

## Making Changes

### For Copilot (Automated)

When processing development requests:

1. **Read this file first** for project patterns
2. **Use `getTextContent()`** for any user-editable text
3. **Follow existing component patterns** in the codebase
4. **Run `pnpm build`** to verify changes compile

### Text Key Guidelines

When adding new editable text:

- Use descriptive, hierarchical keys: `section.element.purpose`
- Provide meaningful default values
- Keep keys consistent with component names

## Deployment

Deployments use GitHub Actions triggered by pushes to `master` or `release/**` branches.
The site is hosted on Azure Blob Storage with static website hosting enabled.

## DCS Integration Files

| File | Purpose |
|------|---------|
| `.dcs/site.yaml` | Site configuration (slug, storage account) |
| `.dcs/pages.yaml` | Page definitions for portal visual editor |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_BACKEND_URI` | DCS Portal API URL |
| `VITE_SITE_SLUG` | Site identifier for content loading |

## Important Notes

1. **This is a PUBLIC repository** - do not add secrets or sensitive data
2. **Demo content only** - use placeholder text, not real customer data
3. **MIT License** - all code is open source

## Support

For questions about DCS integration:
- **Portal**: https://portal.duffcloudservices.com
- **Documentation**: https://docs.duffcloudservices.com
