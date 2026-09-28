---
name: upstream-pstack
description: Pointer to the upstream pstack unslop SKILL.md that ../SKILL.md was adapted from. Attribution, license posture, pinned upstream commit, retrieval command. Upstream text is NOT vendored. Not an active skill; ../SKILL.md wins on every conflict.
metadata:
  docKind: skill
  docClass: guidance
  title: pstack unslop upstream (pointer)
  status: Active
  owner: Nathan Duff
  created: 2026-08-24
  lastVerified: 2026-08-24
  stalenessSLA: 180
  relatedDocs:
    - .github/skills/unslop/SKILL.md
    - .github/skills/dcs-design-taste/references/tasteskill-v2-upstream.md
  codeRefs: []
  updateTriggers:
    - The pinned commit below stops resolving (repo moved, renamed, or deleted)
    - Upstream restructures or relicenses the pstack/ subdirectory
    - A material upstream rewrite of the unslop rule set warrants a re-diff
---

# pstack unslop upstream, pointer not a copy

**This file is a pointer.** The upstream text is deliberately not vendored into
`.github/skills/`. Ratified by owner answer Q-691=A, which deleted an 88,088 B vendored
upstream copy worth roughly 10 percent of the skills byte budget measured by
`cli/check-ai-context-ceiling.mjs` that no agent turn had ever loaded. MIT attribution
needs a pinned ref and a retrieval command, not a second copy inside the always-scanned
AI-context tree.

## What the upstream is

Lauren Tan's `unslop` skill, published in the `pstack` plugin of Cursor's plugin
repository. One 6,595 B file, 31 numbered rules in 7 categories, a 4-step process, and an
"add soul" counter-pass. Every rule is a prose rule; it does not
cover agent-instruction writing, despite frequent misattribution of that half.

## Pinned upstream ref

| field | value |
|---|---|
| Repository | `https://github.com/cursor/plugins` |
| File | `pstack/skills/unslop/SKILL.md` |
| Pinned commit | `46125561306434d8a1d7745d540d8932ab0cd2a2` (retrieved 2026-08-24) |
| License | MIT, Copyright (c) 2026 Lauren Tan, licensed at the `pstack/` subdirectory |
| Parent repo license | none. Only `pstack/` carries the grant, so cite the subdirectory |

## How to retrieve the full text on demand

```
https://raw.githubusercontent.com/cursor/plugins/46125561306434d8a1d7745d540d8932ab0cd2a2/pstack/skills/unslop/SKILL.md
```

Retrieve to a scratch path outside the repo. Re-vendoring it would re-spend the byte
budget the no-vendor rule protects.

## Conflict rule

`../SKILL.md` is the active skill and wins on every conflict. Two DCS divergences are
deliberate and must survive any future upstream re-diff.

1. **Two-pass split.** Upstream hands the writer all 31 prohibitions at once. DCS loads the
   catalog in the detection pass only, and the rewrite pass receives just the hits.
2. **Rule 26 carve-out.** Upstream bans abstract metaphor nouns outright. DCS carves out the
   engineering vocabulary that is precise in internal use. See `../SKILL.md`.

The DCS catalog lives in `prose-tells.md`. It is our adaptation in our words, keyed to our
surfaces, not a transcription of upstream.

