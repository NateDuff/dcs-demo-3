---
name: unslop
description: "Use when reviewing or rewriting prose for AI tells on a DCS surface that is not a page-design brief. Key case is a bare ask, review this copy, does this read like AI, rewrite this post, unslop, make this sound human, edit this email. Owns the customer-facing prose surfaces nothing else governs, the transactional email defaults and the 14 Maizzle templates that ship under customers' own brands, the public VitePress docs site, provision and e2e seed copy, blog seeds, and the create-dcs-site legal templates cloned into every new customer site. Runs a two-pass method, detect against the tell catalog, then rewrite from positive targets, plus an add-soul counter-pass. Page and section design stays with dcs-design-taste. Product UI copy stays with dcs-ui-ux."
metadata:
  docKind: skill
  docClass: guidance
  title: Unslop (Prose Quality)
  status: Active
  owner: Nathan Duff
  created: 2026-08-24
  lastVerified: 2026-09-23
  stalenessSLA: 90
  relatedDocs:
    - .docs/plans/unslop-adoption/plan.md
    - .github/skills/unslop/references/prose-tells.md
    - .github/skills/unslop/references/upstream-pstack.md
    - .github/skills/dcs-design-taste/SKILL.md
    - .github/skills/dcs-ui-ux/SKILL.md
    - .github/skills/skill-management/SKILL.md
  codeRefs:
    - internal/emailtemplates/defaults.go
    - emails/emails/
    - docs/
    - cli/provision/
    - e2e/configs/seed-data/
    - packages/create-dcs-site/templates/
    - internal/systemprompts/catalog.go
  updateTriggers:
    - dcs-design-taste section 3.6, 5, 5.1, or 8 changes what it owns
    - A new customer-facing prose surface is added to the platform
    - .docs/skills/voice-nate-duff.md changes what a Nate-voiced rewrite targets
    - The owner amends the em-dash scope, the PT-17 carve-out, or the rule 26 carve-out list
---
<!-- Delivered from the dcs-again monorepo by cli/ai-guidance/sync-site-guidance.ps1. Do not edit here; edit the canonical source in dcs-again/.github and re-run the sync. -->

# Unslop (Prose Quality)

Adapted for DCS from the MIT-licensed `unslop` skill in `cursor/plugins`
(`pstack/skills/unslop/SKILL.md`, Copyright (c) 2026 Lauren Tan).
**Upstream text is not vendored here.** `references/upstream-pstack.md` carries the
attribution, license, pinned ref, and retrieval command. `references/prose-tells.md` is our
adaptation of the rule set, in our words.

## 1. When this fires, and when it does not

Three skills can plausibly answer "this copy is bad". Route explicitly so the work does not
land in two of them.

| the ask | owner |
|---|---|
| Design or redesign a page, hero, section, landing surface. "Make it look less AI" as a **design** brief. | `dcs-design-taste` |
| Product UI strings. Portal and admin labels, form errors, empty states, table headers, wizard steps. | `dcs-ui-ux` |
| Bare copy review with no design brief attached. "Review this copy", "does this read like AI", "rewrite this post", "unslop this". | **this skill** |
| Prose on a surface `dcs-design-taste` section 8 routes away, or that it never covered. Emails, the docs site, seed copy, legal templates. | **this skill** |
| Stress-test a decision, plan, or assumption. | `grill-me` |

**If a design brief exists, `dcs-design-taste` leads** and this skill is the copy pass inside
it, never overriding a design decision and never re-litigating layout or visual hierarchy.

## 2. What this skill does not own

`dcs-design-taste` owns the rules below. Read them there, cite them by section number, and
**do not restate them here or in the catalog.**

- **Section 3.6** content density, the mandatory copy self-audit, one register per page,
  **proof integrity** (which bans invented precision), and **no home-infrastructure names in
  public content**.
- **Section 5** the AI-tell content list and the marketing-copy bans.
- **Section 5.1** the em-dash ban itself, in its canonical form.

## 3. Scope, reviewed versus going-forward

This is the owner's split and the wording is his.

- **Customer-facing prose is REVIEWED and REMEDIATED.** Anything a customer or a customer's
  own customer reads. Fix what you find in the same pass.
- **Internal docs follow the rules GOING FORWARD when newly written, and get NO retroactive
  sweep.** That means `.docs/`, commit messages, and code comments. Do not open a cleanup
  pass over existing internal text, and do not report findings against it.

The line is the reader, not the file type. A `.md` file in `docs/` is customer-facing. A
`.md` file in `.docs/` is not.

## 4. Surfaces this skill governs

| surface | what it is | notes |
|---|---|---|
| `internal/emailtemplates/defaults.go` | transactional copy | Ships **under customers' own brands**. Keep it em-dash-free. |
| `emails/emails/` | Maizzle templates | Preserve Maizzle expressions and inlined CSS. |
| `docs/` | public VitePress docs site | Highest word count and SEO exposure. |
| `cli/provision/` and `e2e/configs/seed-data/` | seed copy | Becomes live site copy at provision time, so it is customer-facing the moment it lands. |
| blog seeds | editorial copy | Editorial register. Voice matters most here. |
| `packages/create-dcs-site/templates/**` | privacy, terms, and the rest of the legal set | Cloned into **every** new customer site, so one bad sentence multiplies. **Never change legal meaning while fixing prose.** |
| `internal/systemprompts/catalog.go` | the prompts that generate customer prose | Read-only here. Prompt edits are owner-gated in the adoption plan. |

## 5. The method, detect then rewrite

**Why the split exists, and why not to collapse it.** The obvious "simplification" is to hand
the writer the whole forbidden list. Matt Pocock's `writing-for-agents` argues that **steering
by prohibition drags the forbidden behavior into context and makes it more available, not
less.** So the catalog is a **detector input**, never a **writer input**, and an editor who
merges it into this file removes the reason the skill works.

### 5.1 Pass one, detect

Load `references/prose-tells.md`. Classify the text against it. Emit hits only, in the shape
`PT-nn | locator | quoted span | one-line why`. Do not rewrite in this pass. Do not list a
rule that found nothing.

Also flag, without duplicating their text, anything that trips `dcs-design-taste` 3.6 or 5,
citing the section number.

### 5.2 Pass two, rewrite

**Fix a tell by RESTRUCTURING the sentence, never by swapping the offending character for
another one.** An em-dash traded for a colon, a parenthesis, or a semicolon is the same tell
wearing a different mark. If the sentence survives with one character changed, the pass did
not happen.

**Touch ONLY what the hit list names.** Typography, bolding, frontmatter values, heading
style, and link formatting that are not themselves hits are left exactly as found. Never
sweep a construct the catalog did not flag. Edits are local and semantic, not total and
typographic, and **over-application is a defect, not thoroughness.**

So: fix every hit (PT-13 makes every em-dash one, bullet separators included), fix it by
restructuring, and touch nothing that was not a hit.

**Start a clean context.** Feed it only the hit list from pass one, the positive targets in
section 6, and the voice file in section 7 when the surface is Nate-voiced. Never paste the
catalog, or its rule text, into this context. A clean context means a genuinely separate
agent, a detector that emits only the hit list and a rewriter spawned fresh with it. Prefer
that whenever you can spawn subagents.

**Be honest about the single-turn fallback.** Writing the hit list to a scratch file does
NOT evict the catalog from your context, so the priming this split prevents is only reduced.
Order the passes anyway, because the ordering catches the tail of a repeated pattern that a
top-to-bottom edit misses, but claim no clean-context guarantee you did not get. If the
rewrite reaches for the catalog's own vocabulary, that is the priming, and the fix is a
second agent.

Preserve, in this order of precedence: factual accuracy, legal meaning, the structural
contract of the surface (JSON, HTML, Maizzle expressions, template placeholders, frontmatter,
length limits), SEO keywords on ranking pages, then style. If a house rule collides with a
platform limit or a legal phrase, the limit or the phrase wins and you say so.

### 5.3 Pass three, add soul

Removing tells is half the job. **Sterile, voiceless prose is equally an AI tell.** Read the
rewrite again for a human on the other end.

- **Have an opinion.** React to the fact instead of listing pros and cons evenly.
- **Vary rhythm.** Short sentence. Then one that takes its time and earns the length.
- **Acknowledge complexity.** "Fast, and it costs you a rebuild" beats "fast".
- **Let some mess in.** Perfectly parallel structure reads machine-made.

**This pass is never skipped, and it has a floor: the rewrite may never come out with LESS
life than the text it edited.** That floor holds on every surface, including the ones where
first person and opinion are wrong.

**Register is a surface constraint. Soul is not.** "I", opinion, and Nate's voice belong on
founder, marketing, and blog copy. Product documentation, legal templates, and transactional
email under a **customer's** brand get clarity and correctness instead. On those surfaces
add-soul means **preserving the concrete human beats the original already had**, keeping a
real actor in the sentence, and refusing to flatten rhythm into uniform declaratives, not
adding personality. Cutting a clause like "and you manage every appointment from one place"
because it read warm is the failure, not the fix.

### 5.4 Pass four, self-audit

Ask the question directly: "what still makes this obviously AI generated?" Fix what the
answer names, then confirm the structural contract and the facts still hold.

### 5.5 Required last step, compare the rewrite against the original

Before returning anything, read the rewrite beside the text it replaced and grade both.

- **Voice.** If the original had more life, the pass FAILED. Redo it.
- **Specificity.** If the rewrite asserts a claim the original did not make, the pass FAILED.
  Redo it.

**A rewrite that is merely more compliant than the original is not automatically better than
it.** Compliance is the floor, not the score. If the only gain is that some marks are gone
and the prose reads flatter for it, say so instead of shipping it as an improvement.

## 6. Positive targets, what good DCS prose does

This is what pass two writes toward.

- **Names the mechanism, the number, or the action.** If a sentence cannot be restated as a
  concrete fact or instruction, it is decoration. **Name a number only when it is already in
  the source or is a durable property of the thing.** Never derive a count by counting the
  items in front of you and asserting it as fact. "Six screens" over a source that said
  "focused screens" makes a claim the author declined to make, buys nothing when the list is
  right there, and goes silently false the day a seventh ships. That is invented precision,
  banned by `dcs-design-taste` 3.6.
- **Says one thing per sentence.** Split before you decorate.
- **Uses the plain word.** Use, not utilize. Help, not facilitate.
- **Puts a named actor in front of the verb.** We deploy your site, not your site is deployed.
- **Is specific to this product.** A sentence that would survive a find-and-replace of the
  product name says nothing.
- **Is confident and capability-forward.** DCS and founder copy state what the platform does.
  No hedging stack, no mock humility, no apology for existing.
- **Keeps the facts real.** Proof integrity, `dcs-design-taste` 3.6, is absolute.
- **Reads as one register per surface.** Pick it before you write, not after.
- **Is mechanically clean.** Straight quotes, no decorative emoji, no em-dash, no en-dash, and
  sentence-case headings unless the surface already runs the other convention (PT-17).

**The house form for a term-and-gloss list is `**Term:** gloss`.** This is the one approved
replacement for the `**Term** - gloss` shape the em-dash ban removes, and it is settled so that
no remediation PR has to relitigate it page by page. It is NOT a colon substituted for a dash
mid-sentence, which PT-14 still forbids: it is the definition-list label form PT-14 explicitly
permits, so the two rules agree. Keep the gloss lowercase and keep it a fragment.

Never weld the term into a predicate ("**Customers** keeps the people who book and buy from
you"): it destroys the scan pattern and drifts into a repetitive verb rota. The bold term must
stay alone at the left edge where a skimming reader finds it.

## 7. Voice target for Nate-voiced surfaces

`.docs/skills/voice-nate-duff.md` (moved there 2026-09-11, C-1632: an uncounted reference home
outside the AI-context ceiling) is the positive target for any rewrite on a surface written
in Nate's own voice, meaning nateduff.com, DCS marketing copy, founder blog posts, and cold
outreach.

Its evidence is TIERED, and the tiers matter more than the volume. Tier 1 is Nate's own
unmediated typing, principally the `Notes:` fields in `.workboard/answers/*.md`, and it wins
any conflict. Tier 2 is published but AI-assisted nateduff.com prose. Tier 3 is drafted-for-him
and never shipped, which is `.docs/plans/m6-founder-content/`, and it is not a voice target.
The tiering exists because several published posts were written by an assistant following a
prior voice skill, so grading new prose against them grades that skill's output, not Nate. A
fuller treatment lives in the sibling `resume-blog` repo at
`.agents/skills/nateduff-blog-voice/`, a separate clone that may not be present.

Load it in **pass two only**, alongside the hit list. Do not fold its content into this file,
and do not paraphrase it from memory. If the surface is not Nate-voiced, skip it entirely.

## 8. Em-dashes

**Hard ban in customer-facing copy, enforced going forward.** The owner's words are "I just
don't want to see emdashes moving forward." That is the decision. Do not relitigate it and do
not ask for a "sparingly" allowance.

The canonical statement is `dcs-design-taste` section 5.1, which scopes it to rendered page
text. **This skill widens the surface** to all customer-facing prose, adding the seven
surfaces in section 4. Internal docs, commit messages, and code comments stay exempt from
remediation and follow the rule only when newly written (section 3).

Fix by restructuring, per 5.2. End the sentence, or recast it so a comma carries the join.
**Do not drop parentheses, a colon, or a semicolon into the em-dash's place**, which trades
one tell for another mark. Ranges take a hyphen. Attribution takes a spaced hyphen or a line
break. The en-dash as a separator is banned on the same terms.

## 9. Rule 26 carve-out, abstract metaphor nouns

PT-26 bans abstract metaphor nouns that stand in for a plainer concrete word. It ships
**with this carve-out written down**, because six of the banned terms are load-bearing DCS
engineering vocabulary that AGENTS.md and the instruction tree use precisely.

**Carved-out terms:** `surface`, `primitive` (as a noun), `scaffolding`, `harness`,
`north star`, `flywheel`.

The rule applies to customer-facing prose where the abstract noun hides a concrete word the
reader would understand better. It does not apply to internal engineering prose, where these
six name real things and are correct usage. Everything else in PT-26 stays banned on both
sides of the line, and never file a PT-26 hit against AGENTS.md, the instruction tree, or a
skill.

## 10. Output and done-when

A review emits, in this order: the hit list from pass one, the rewritten text from pass two,
and a short note on anything deliberately left alone with the reason (legal phrasing, an SEO
keyword, a length limit, a carve-out term).

Done when every hit is either fixed or explicitly waived with a reason, nothing outside the
hit list was touched, the structural contract of the file still holds, no fact was invented
or lost, the register matches whose brand the words ship under, the 5.5 comparison passed on
both axes, and the text reads like a person wrote it rather than like a list of prohibitions
was satisfied.

