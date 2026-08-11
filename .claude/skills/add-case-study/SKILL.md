---
name: add-case-study
description: >-
  Add a new case study to the portfolio site, or revise an existing one, sourcing
  every claim from the evidence corpus and applying the publishing filter. Use
  when asked to add a project, add a sixth case study, rewrite or update a case
  study, or put a new piece of work on the site.
---

# Add or revise a case study

Four files, in this order. The order matters: get the evidence and the filter right *before* writing
prose, because prose written first tends to get defended rather than corrected.

Read `CLAUDE.md` first if you have not. The publishing rules there are not optional and are not
inferable from the code.

## 1. Gather evidence — from the corpus, never from memory

The corpus is in the **separate private repo** `F:\JobSearch`. Read it in place. Do not copy files
into this repo; it is public.

```bash
grep -n "<the product or project name>" /f/JobSearch/corpus/cv-content.md
```

`cv-content.md` is the source of truth. Part B (achievement bullets, grouped by product) is usually
where case-study material lives. For more depth, use `corpus/portfolio-index.md` to find line ranges
in `corpus/portfolio.md` — **never read `portfolio.md` whole, it is 1.2 MB.**

Two things to check before trusting anything:

- **`⚠` markers.** The corpus flags corrections with them. If your claim sits near one, read it — it
  usually means an earlier version of that fact was wrong.
- **The "Notes on assumptions" section** near the end of Part A lists figures **deliberately
  excluded** as unmeasured or not attributable to Hammad. Do not resurrect those. It also records
  what he did *not* do — e.g. he authored ~410 PRs but did not review others', so no code-review-of-
  others is ever claimed.

Absence from `cv-content.md` is not absence of evidence — `portfolio.md` is deeper. But absence from
both means the claim does not go on the site.

## 2. Apply the publishing filter

Before writing a line. Every one of these has been violated at least once during this site's build:

- Strip **Jira keys and PR numbers**. State the claim as prose.
- Strip **absolute dollar amounts**. Ratios and percentages ship; dollars do not.
- Strip **customer and organisation identifiers**. Write "a real operator organisation", never an id
  or a named customer appliance.
- **Invent nothing.** No plausible-looking API method names, no representative-looking percentages.
  If the evidence does not record a specific, write the generic true thing. This has been caught
  twice: fabricated Kerio method names, and a "40 tools" figure that existed nowhere.
- If a claim has **no measured before/after**, say so on the page rather than borrowing a number.

## 3. `src/data/site.ts` — the index entry

Add to `work[]`:

```ts
{
  slug: 'kebab-case-slug',      // becomes /work/<slug>/
  title: 'Short, concrete',     // the hook, not the product name
  kicker: 'Product name',
  summary: '2–3 sentences: the problem, what you built, what it turned on.',
  figure: '95.8%',              // ONE headline figure
  figureNote: 'what produced it — the number never stands alone',
  tags: ['...'],                // 4–6, real technologies only
  featured: true,
}
```

Then add the matching entry to **`workViz`** in the same file. Missing this leaves the tile with no
mini instrument and no build error — it fails silently.

Existing kinds: `context` (a wall of bars vs a few), `waterfall` (before/after durations), `race`
(candidates with one winner), `plot` (two-axis trade-off), `dots` (n-of-m pass grid). Reuse one if it
fits the shape of the result. Only add a kind to `MiniViz.astro` if the result genuinely has a
different shape — and build it from **that project's own numbers**, in plain CSS or hand-authored
SVG. No charting library, no canvas, no stock imagery.

Remember `MiniViz` colour is semantic: red means something failed, teal is the shipped path.

## 4. `src/data/case-studies.ts` — the body

```ts
{
  slug: 'same-slug',
  scope: 'What the system is and what the goal was. 2–3 sentences.',
  blocks: [{ heading, body?, bullets? }],   // 2–4 blocks
  hardPart: { heading: 'The hard part', body: '...' },
  results: [{ figure, label }],             // 3–5
  stack: [{ group, items: [] }],            // grouped, not one flat list
  caveat: '...',                            // optional but valuable
}
```

Notes on the shape:

- **`hardPart` is the most important field.** It renders with its own emphasis and it is what makes
  the page read as engineering rather than a feature list. It should name the thing that was
  genuinely difficult or counter-intuitive — often a reframe, a measurement, or a decision not to
  build.
- **`caveat`** becomes a "what this page does not claim" panel. Use it whenever the evidence stops
  short. Two case studies already carry one and they strengthen the page.
- Bullets may use `` `backticks` `` for identifiers — a helper in `work/[slug].astro` converts them
  to `<code>`. **Nothing else converts markdown.** No `**bold**`, no links.
- Prose register: plain, specific, first person, no adjectives doing work a number could do.

## 5. Cross-link it

In `site.ts`, add the slug to the `proof` array of any `practiceAreas` entry it evidences. The rule is
that **no skill appears on the site detached from work that proves it** — an orphaned case study
breaks the site's central mechanic.

Consider whether it belongs in `about.ts` `principles[].proof` too.

## 6. Verify

```bash
cd /f/portfolio-site && npm run build     # page count should have gone up by 1
```

- Fetch `/work/<slug>/` locally and confirm the mini instrument, results sidebar and stack all render.
- Confirm the home tile appears and its figure sits beside its note.
- Run the disclosure audit from the `deploy` skill. **Case-sensitive** — the `-i` flag makes `[A-Z]`
  match Tailwind class names and produces dozens of false positives.
- Re-read your prose against `cv-content.md` one final time, hunting specifically for numbers you
  smoothed and specifics you invented.

Then use the `deploy` skill.

## Watch for

- **Astro trims whitespace around inline expressions.** `and the <span>MLOps</span>` renders
  `theMLOps`. Use `{' '}`. This shipped twice.
- If a corpus figure contradicts something already on the site, the corpus wins — and check whether
  the same stale figure appears elsewhere on the page.
