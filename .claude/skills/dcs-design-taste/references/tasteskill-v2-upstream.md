---
name: tasteskill-v2-upstream
description: Pointer to the upstream taste-skill v2 (design-taste-frontend) SKILL.md that ../SKILL.md was adapted from — attribution, license, pinned upstream ref, and two retrieval commands. The full upstream text is NO LONGER VENDORED here; fetch it on demand. Do not load as an active skill; the DCS adaptation in ../SKILL.md wins on all conflicts (upstream is React/Next.js-centric).
metadata:
  docKind: skill
  docClass: guidance
  title: taste-skill v2 upstream (pointer)
  status: Active
  owner: Nathan Duff
  created: 2026-07-04
  lastVerified: 2026-08-22
  stalenessSLA: 180
  relatedDocs:
    - .github/skills/dcs-design-taste/SKILL.md
  codeRefs: []
  updateTriggers:
    - Upstream Leonxlnx/taste-skill publishes v2.0.0 stable
    - The pinned upstream commit below stops resolving (repo moved, renamed, or deleted)
---

# taste-skill v2 upstream — pointer, not a copy

**This file is a pointer.** It used to hold an 88,088 B verbatim copy of the upstream
`taste-skill` v2 `SKILL.md`. That copy was removed on 2026-08-22 (owner answer Q-691 = A):
it was ~10% of the `.github/skills` byte budget measured by
`cli/check-ai-context-ceiling.mjs`, and **zero agent turns ever loaded it** — its own header
told every reader not to.

## What the upstream is

`Leonxlnx/taste-skill` v2, the skill directory `skills/taste-skill/` (published as
`design-taste-frontend`): an anti-slop frontend design skill for landing pages, portfolios,
and redesigns. `../SKILL.md` is the DCS adaptation of it.

## Why it was vendored in the first place

Attribution under the upstream MIT license, and a stable base for future upstream diffs —
so a v2.0.0 release could be diffed against the exact text the DCS adaptation was derived
from. Both purposes are served by a pinned ref plus a retrieval command; neither requires
88 KB to sit inside the always-scanned AI-context tree.

## Pinned upstream ref

| field | value |
|---|---|
| Repository | `https://github.com/Leonxlnx/taste-skill` |
| File | `skills/taste-skill/SKILL.md` |
| Pinned commit | `b17742737e796305d829b3ad39eda3add0d79060` (2026-07-05) |
| License | MIT, Copyright (c) 2026 Leonxlnx |

Provenance: this ref was recorded verbatim in the removed file's own header comment and is
restated identically in `../SKILL.md`. It is not reconstructed or inferred.

## How to retrieve the full text on demand

**From upstream at the pinned commit** (preferred — this is what the DCS adaptation was
derived from):

```
https://raw.githubusercontent.com/Leonxlnx/taste-skill/b17742737e796305d829b3ad39eda3add0d79060/skills/taste-skill/SKILL.md
```

**From this repo's own history** (works offline, and is authoritative if upstream ever
disappears — this is the exact 88,088 B that was vendored here):

```
git show ab8a23db90d4d6d2183983c088578b8239d868b1:.github/skills/dcs-design-taste/references/tasteskill-v2-upstream.md
```

`ab8a23db90d4d6d2183983c088578b8239d868b1` is the last commit that carried the full vendored
content. Retrieve to a scratch path outside the repo — re-vendoring it would re-spend the
byte budget this removal freed.

## Conflict rule (unchanged)

Upstream is React/Next.js + Motion/GSAP centric. `../SKILL.md` is the active skill and wins
on every conflict — stack, icon set, motion system. Read upstream for archaeology and
diffing, never as instructions.

