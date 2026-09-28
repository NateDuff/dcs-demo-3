---
name: prose-tells
description: The DCS prose-tell detection catalog, 31 numbered rules across 7 categories, adapted from the pstack unslop rule set. LOAD THIS IN THE DETECTION PASS ONLY, it is a detector input and never a writer input. The rewrite pass receives the hit list, not this file. Read ../SKILL.md for the method and the positive targets.
metadata:
  docKind: skill
  docClass: guidance
  title: DCS prose-tell catalog (detection pass)
  status: Active
  owner: Nathan Duff
  created: 2026-08-24
  lastVerified: 2026-08-24
  stalenessSLA: 90
  relatedDocs:
    - .github/skills/unslop/SKILL.md
    - .github/skills/unslop/references/upstream-pstack.md
    - .github/skills/dcs-design-taste/SKILL.md
  codeRefs: []
  updateTriggers:
    - A recurring tell is found in review that no rule here catches
    - dcs-design-taste section 5 or 5.1 changes what it owns
    - The rule 26 carve-out list in ../SKILL.md changes
---

# DCS prose-tell catalog

**Detection input only.** Do not paste this file, or any rule text, into the rewrite context.
`../SKILL.md` explains why the split exists and must not be collapsed.

**Output shape.** Every hit is `PT-nn | file plus locator | quoted span | one-line why`.
Never list a rule with zero hits, and never rewrite while detecting. A rule you are unsure
about is reported as a hit with the doubt stated, not silently dropped and not asserted.

**Precision beats recall.** A finding is an accusation against someone's writing, and a false
positive costs more than a missed tell, so quote the exact span you are accusing.

**Do not restate rules other skills own.** Filler verbs, the Jane Doe effect, fake numbers,
proof integrity, home-infrastructure names, and one-register-per-page belong to
`dcs-design-taste` 3.6 and 5. Cite them by section number, and do not duplicate them into a
PT id.

## Content

- **PT-01 Puffery.** "pivotal moment", "a testament to", "the evolving landscape",
  "setting the stage for", "leaves an indelible mark", "deeply rooted". Cut it and state
  what actually happened.
- **PT-02 Name-dropping without content.** Listing outlets, vendors, or partners with no
  claim attached. Pick one and say what it did or said.
- **PT-03 Trailing -ing clause.** "highlighting the need for", "ensuring seamless", "further
  reflecting", "showcasing our", "fostering". The clause carries no fact. Delete it, or
  expand it into the fact it was gesturing at.
- **PT-04 Promotional adjectives.** "nestled", "vibrant", "breathtaking", "groundbreaking",
  "renowned", "stunning", "must-visit", "cutting-edge", "world-class". Describe neutrally.
- **PT-05 Vague attribution.** "Experts believe", "Industry reports suggest", "Studies show",
  "Many businesses find". Name the source or delete the sentence. This also trips proof
  integrity, `dcs-design-taste` 3.6.
- **PT-06 Formulaic adversity arc.** "Despite these challenges, the team continues to
  thrive." Replace with the specific fact that made it hard and the specific outcome.

## Language

- **PT-07 House AI vocabulary.** additionally, crucial, delve, enduring, enhance, fostering,
  garner, interplay, intricate, landscape (abstract), pivotal, showcase, tapestry, testament,
  underscore, vibrant, robust, comprehensive, streamline, empower. Replace with the plain
  word. Keep a term when it is the literal technical name of a thing, such as a product tier
  that is actually called that.
- **PT-08 Fancy ways of saying "is".** "serves as", "stands as", "boasts", "features",
  "represents". Write "is" or "has".
- **PT-09 "Not just X, but Y."** Also "It is not only X, it is Y." State the point once.
- **PT-10 Forced rule of three.** Three parallel items when the real number is two or five.
  Triads in headlines, sub-copy, and feature lists all count. Use the natural number.
- **PT-11 Synonym cycling.** The same referent renamed across a paragraph (the portal, the
  dashboard, the management surface, the control panel). Pick one noun and repeat it.
  In product prose the cycled synonyms are usually also wrong, because the product has one
  name for that thing.
- **PT-12 False range.** "from onboarding to invoicing" where the two ends are not on a
  scale. List the items directly.

## Style

- **PT-13 Em-dash and en-dash.** Any em-dash or en-dash in customer-facing prose is a hit.
  Restructure the sentence. Do not drop another mark into its place, parentheses, a colon, or
  a semicolon included, which trades one tell for another. Ranges take a hyphen. Attribution
  takes a spaced hyphen or a line break. The canonical rule is `dcs-design-taste` 5.1, and the
  surface widening is in `../SKILL.md`.
- **PT-14 Colon as a mid-sentence connector.** A colon before a list or an example is fine.
  A colon splicing two clauses to sound weighty is a crutch. Rewrite so the point stands.
  **A bold-label-plus-colon definition list is NOT a hit.** That colon labels a list item, it
  does not splice a clause. PT-16 covers the case where the text after the label restates it.
- **PT-15 Boldface spray.** Bolding every proper noun, acronym, or product name. Bold marks
  the one thing that matters in a passage, not every noun in it.
- **PT-16 Inline-header list restating itself.** The tell is a bold label plus colon whose
  following text merely repeats the label, a bolded "Performance" followed by a sentence
  starting "Performance". A bold lead-in followed by genuinely new detail is fine, not a hit.
- **PT-17 Sentence-case headings.** Sentence case, in docs, emails, and page copy. Proper
  nouns and product names keep their casing. **Carve-out: a site-wide convention beats this
  rule.** PT-17 does NOT fire when neighbouring pages on the same surface follow the opposite
  convention, because retitling one page desyncs it from its siblings. Every H1 in
  `docs/guide/` is title case today, so PT-17 is not a hit there. Change the convention for
  the whole surface, or leave the page alone.
- **PT-18 Decorative emoji.** In headings, bullets, or email subject lines. A status glyph
  carrying real semantic state is not decoration.
- **PT-19 Curly quotes and typographic apostrophes** where straight ones belong. Watch for
  these arriving invisibly through a paste from a document editor.

## Communication artifacts

- **PT-20 Chatbot phrases.** "I hope this helps", "Let me know if you have any questions",
  "Of course", "Certainly", "Great news". Worst in transactional email, where they ship
  under a customer's brand and read as a bot answering for them.
- **PT-21 Knowledge-cutoff or availability disclaimers.** "While specific details are
  limited", "Based on available information". Find the fact or drop the sentence.
- **PT-22 Sycophancy.** "Great question", "You are absolutely right", "Excellent choice".
  Answer directly.

## Filler

- **PT-23 Filler phrases.** "in order to" becomes "to". "due to the fact that" becomes
  "because". "it is important to note that" is deleted whole. So are "at the end of the
  day", "when it comes to", and "in today's world".
- **PT-24 Stacked hedging.** "could potentially be argued that it might" becomes "may".
  One hedge maximum, and only where the uncertainty is real.
- **PT-25 Generic conclusion.** "The future looks bright." "The possibilities are endless."
  End on a fact, a number, or the next action.

## Jargon

- **PT-26 Abstract metaphor nouns, WITH the DCS carve-out.** substrate, wedge, vector, locus,
  vantage, nexus, primitive (as a noun), harness (as metaphor), surface (as in API surface),
  bedrock, scaffolding (as metaphor), modality, paradigm, gold-plating, ratchet (as
  metaphor), evacuate (for moving code), endgame, north star, flywheel. Each usually hides a
  plainer concrete word. "substrate" becomes "base". "wedge in" becomes "add". "gold-plating"
  becomes "more than the job needs". "endgame" becomes "the last phase".
  **The carve-out is binding and is listed in `../SKILL.md`.** Six terms are load-bearing DCS
  engineering vocabulary and are NOT hits in internal engineering prose. Fire PT-26 on those
  six only when the text is customer-facing AND the noun hides a concrete word the reader
  would understand better. Check the surface before you accuse.

## Plain speech

- **PT-27 Names a feeling, not a mechanism.** "your data stays close at hand", "reporting you
  can actually read", "peace of mind". The fix names the mechanism, a number, or an action.
  Second check on the same sentence, if it could appear unchanged in a competitor's copy, it
  says nothing about this product. Cut it.
- **PT-28 Dense sentence.** If a reader has to backtrack to parse it, split it. One idea per
  sentence. Email body copy and legal templates are where this bites hardest.
- **PT-29 Passive voice with a hidden actor.** "queries are validated" becomes "the compiler
  validates queries". "your site is deployed" becomes "we deploy your site". Passive is fine
  only when the actor is genuinely unknown or irrelevant.
- **PT-30 Adverb propping up a weak verb.** "runs quickly" becomes "is fast" or the measured
  number. "significantly improves" becomes the delta. Fix the verb, do not decorate it.
- **PT-31 Fancier synonym than the job needs.** utilize becomes use, leverage becomes use,
  facilitate becomes help, numerous becomes many, in the event that becomes if, prior to
  becomes before, subsequently becomes then.

