# CLAUDE.md — star-mech.github.io

Context for any agent working in this repo. Read it before touching content, because most of the
rules here are about **what must not go on the page**, and none of them are inferable from the code.

---

## What this is

The public portfolio site of **Hammad Maqsood**, an AI/LLM engineer, live at
**https://star-mech.github.io**. Its job is to get him hired for remote AI/LLM roles.

It is not a blog, not a design showcase, and not a résumé transcription. The governing idea:

> **His five best systems are inside private enterprise products.** A stranger cannot run any of
> them. So the site cannot rely on live demos — instead it makes his *reasoning* inspectable. That is
> why the hero is a context-window visualiser and why there is a "root cause" section. Those are
> demos of judgement, not of product.

Audience is hiring managers and recruiters, roughly in that order. Two consequences: the page must
survive a 10-second skim *and* a 10-minute read, and it must load instantly on a phone.

### The three externally verifiable artifacts

Everything else on the site is Hammad describing private work. These three are checkable by a
stranger, so they are load-bearing and get their own row near the top of the page:

1. **First-author paper — arXiv:2603.14876.** Hybrid rule base (59 ICD-10 conditions) + multi-class
   ML over routine labs, across 593,055 patients at 547 US primary-care centres.
2. **A live hosted product** — `g2mcp.ignitetech.ai`, the Gensym G2 documentation copilot.
3. **A public npm package** — `openrpc-mcp-server-updated`.

---

## Where the content comes from

**Every factual claim on this site traces to `F:\JobSearch`**, a separate private repo holding
Hammad's evidence corpus and job-search automation. The important files there:

| Path | What it is |
|---|---|
| `corpus/cv-content.md` | The distilled evidence corpus — **the source of truth for every claim** |
| `corpus/portfolio.md` | Deep evidence, 1.2 MB — never read whole; use `corpus/portfolio-index.md` |
| `applications/_general/core/` | The general CVs, including this site's `Hammad-Maqsood-CV-Web.html/.pdf` |
| `scripts/verify-cv.sh` | Mechanical CV render checks (run it after any CV change) |

> ### The corpus must never enter this repo
> This repo is **public**. `F:\JobSearch` contains preferences, application history, salary
> discussions and unpublished evidence. That is why the site lives in its own directory with its own
> git remote, and why content is copied in by hand rather than imported. Do not add a path
> reference, a submodule, or a build step that reaches into `F:\JobSearch`.

If you need to check a claim, read the corpus in place. Do not copy corpus files here.

---

## Content rules (non-negotiable)

These come from the project's integrity requirements and from decisions Hammad made explicitly.
Violating one is worse than shipping nothing.

**Never publish:**

- **Jira keys or PR numbers.** `APPMNGRAI-111`, `PR #160` etc. Claims are stated as prose instead.
  (`ICD-10` is a medical coding standard and is fine — it only looks like a ticket key.)
- **Absolute dollar amounts.** Ratios and percentages are the transferable part; the dollars are the
  employer's. "74.7% cheaper" ships; a per-query cost figure does not. The NO-GO case study states
  this on the record, so a page that broke it would make the site self-contradicting.
- **Customer or organisation identifiers.** No org ids, no named customer appliances. Write
  "verified live on a real operator organisation".
- **Durations of any kind against a skill.** Hammad declined a computed years-of-experience total,
  and as of 2026-08-11 the per-area durations came off the practice-area cards too: they invited the
  reader to add them up, and the corpus flags every one of those year counts as an estimate. The
  cards carry evidence links instead. Role date ranges in the trajectory are fine and stay.
- **A link to the MQL5 feedback page**, and never any implication of a flawless record. Both his
  freelance records are public and neither is spotless (one 1★ on MQL5, one 3.9 on Upwork). The
  about section says so outright, because a "perfect rating" claim is false and checkable in one
  click.
- **Invented specifics.** This has already been caught twice mid-build: plausible-looking Kerio
  method names in the stepper, and per-step context-meter percentages. If the corpus does not record
  it, write the generic true thing instead.

**Always:**

- **State what the evidence does not support.** Two case studies carry a "what this page does not
  claim" panel, and one root-cause card says outright that no before/after was measured. This costs
  nothing and is the site's whole credibility posture.
- **Attach every number to its cause.** Hammad rejected a standalone metrics strip; figures live
  beside the thing that produced them.
- **Attach every skill to its proof.** No skill appears detached from the system it was used on.
  That is what the practice-area cross-links are for.
- **Honest location.** "Islamabad, Pakistan · Remote" (he relocated 2026-08-04).
- **No em dashes in anything a visitor can see.** Cleared repo-wide on 2026-08-11, because a page
  dense with them reads as machine-written and this site's whole argument is that a person did the
  work. Recast the sentence with a colon, a comma or a full stop; do not swap in a hyphen, which is
  worse typography and just as obvious. En dashes stay: they are doing real work in ranges
  (`2017 – 2021`, `2–3 seconds`) and in the `60 – 18` figure. `·` is the separator for label pairs.
  The check is `grep -c '—' dist/index.html dist/work/*/index.html`, and it must return zero
  everywhere. Note that `is:inline` script comments ship in the HTML too, so they count.

**Disclosure ceiling:** product names and architecture as already published on his own LinkedIn
(AppManager AI, GFI RADAR, Gensym G2, Kerio Control, MyPersonas). Percentages, latencies, token
counts, trace counts and test counts are publishable.

---

## Stack, and why

Astro 7 · Tailwind CSS v4 (CSS-first `@theme`, no JS config) · **no framework at all**.

```
npm install     # once
npm run dev     # localhost:4321
npm run build   # static output to dist/
npm run check   # astro check
```

Dependencies are deliberately six: `astro`, `@astrojs/sitemap`, `tailwindcss`,
`@tailwindcss/vite`, and two self-hosted `@fontsource` packages.

> **React and MDX were removed on purpose.** Both were installed during scaffolding, neither was
> used, and the React integration emitted an unreferenced client runtime into every build. **Do not
> add a UI framework to make something interactive** — see the interaction rules below. The home
> page currently ships **zero JavaScript chunks** and about 20 KB of gzipped HTML, and that speed is
> part of the argument the site is making.

### Layout

- Container is `max-w-7xl px-4`. A **bento grid** — asymmetric tiles that fill the width. The
  original single centred column left a dead void across the right 45% of a wide screen; do not
  reintroduce it.
- Fonts are self-hosted and latin-subset only. No external requests from any page.

---

## Content model

All content is typed data in `src/data/`. Prose lives here, not in components, so a factual fix is
one edit in one place.

| File | Holds |
|---|---|
| `site.ts` | Profile, links, nav, six practice areas, the seven work items, `workViz` mapping |
| `case-studies.ts` | Case-study bodies: `scope`, `blocks[]`, `hardPart`, `results[]`, `stack[]`, optional `caveat` |
| `root-causes.ts` | The eight production failures: `symptom`, `looked_like`, `cause`, `fix`, `delta` |
| `about.ts` | Principles, education, freelance record, GitHub accounts, 18 certifications, the timeline |

`links.formspreeId` is empty. While empty, `Contact.astro` renders a mail-first card; set it and a
real form appears. **Do not create the Formspree account** — that is Hammad's to do.

### Pages

- `src/pages/index.astro` — the long home page, all sections
- `src/pages/work/[slug].astro` — one route per case study, from `work[]`
- `src/pages/404.astro`

---

## Design system

Defined once in `src/styles/global.css` under `@theme`. Register: **dark "engineering instrument"** —
near-black canvas, two low-alpha radial washes, a ~1 KB inline-SVG film grain, raised-glass tiles.

Key classes: `.tile` (+ `.tile-glow`, `.tile-glow-2`, `.tile-interactive`), `.label`, `.figure`,
`.pill`, `.tag`, `.btn-primary`, `.btn-ghost`, `.grad-text`, `.reveal`.

**Colour is semantic, not decorative:**

- `--color-signal` (teal) and `--color-accent-2` (violet) carry emphasis and every figure.
- **`--color-warn` and `--color-fail` mean something failed.** A red bar on this site always denotes
  a real failure state — never "look at this". Do not use them for accent.

### Accessibility is a build requirement

WCAG 2.1 AA. Specifically:

- **Contrast was measured, not eyeballed.** `--color-ink-faint` was `#6d7580`, which computes to
  **3.70:1** against the tile surface — failing AA for the 11px labels and tags it is used on. It is
  now `#868e9a` at **5.21:1**. If you change any colour token, recompute against the composited tile
  surface (`#191b1f`, i.e. `#0e1014` under a white 4.5% wash), not against the raw canvas.
- Every interactive element is a **native `<button>`** or `<details>`, so focus, tab order and
  Enter/Space come from the platform.
- One `<h1>` per page, then `<h2>`/`<h3>`.

---

## Interaction rules

Both interactive pieces — the 334→3 stepper in `ContextPanels.astro` and the ten-stage diagram in
`RadarDiagram.astro` — follow the same pattern, and anything new should too:

1. **Server-render the complete, correct end state.** That output is also the no-JS and
   reduced-motion experience.
2. **Enhance with an `is:inline` script.** No islands, no framework.
3. **Never ship a dead control.** Controls are rendered `hidden` and revealed by the script, so a
   no-JS visitor never sees a button that does nothing.
4. **Bail out under `prefers-reduced-motion`** leaving the full static content, and make sure
   `.reveal` content can never be left invisible (there is a `.no-js` guard for exactly this).
5. **Interactivity must carry information.** Every interactive element has to teach a fact a
   paragraph could not. This is why the stepper reveals *what each call returns* rather than
   animating a meter — the meter's truth is that it stays flat, so animating it meant inventing a
   number.
6. **Prefer text to geometry.** The diagram originally had SVG connectors over a CSS grid; they
   drifted at breakpoints. Sequence is now carried by stage numbers, which never misalign and read
   correctly to a screen reader.

---

## Build and deploy

Push to `main` → `.github/workflows/deploy.yml` → build → Pages. Nothing else to do.

Two things that will bite you:

- **Pages must be on `build_type: workflow`.** GitHub auto-enabled *legacy branch-deploy* the moment
  this repo was created, because its name matches the account name. Legacy serves the raw repo root,
  which has no `index.html`, so the site 404s. Check with
  `gh api repos/Star-Mech/star-mech.github.io/pages`; fix with
  `gh api -X PUT .../pages -f build_type=workflow`.
- **Two GitHub accounts exist.** `Star-Mech` is personal and owns this repo. `hammad-starmech` is the
  day-job account carrying the IgniteTech-period contribution history (the work itself is in private
  org repos, so it shows density rather than repositories). `gh` must be active as **`Star-Mech`**
  with HTTPS to push here. There is no way to merge the accounts; the about section explains the
  split honestly.

### The CV

`public/Hammad-Maqsood-CV.pdf` is a **web-specific variant**, generated in `F:\JobSearch` from
`applications/_general/core/Hammad-Maqsood-CV-Web.html` with headless Chrome, and deliberately
different from the CV used for individual applications:

- Location reads "Islamabad, Pakistan · **Remote**".
- **No phone number** — a public PDF gets scraped.
- **No dollar figures.** The per-query cost baseline and the per-conversation token-burn range were
  removed, because publishing an employer's unit economics at a public URL is not the same as putting
  them in a CV mailed to a named employer.
- Contact routes are email, LinkedIn, and a link back to this site's contact section.

Regenerate with headless Chrome `--print-to-pdf`, then **run `scripts/verify-cv.sh` in `F:\JobSearch`**
before copying the PDF here. Do not edit the application CV to fix a site problem.

### The OG image

`public/og.png` is rendered from `assets/og.html` — self-contained, system fonts only, no build step:

```bash
chrome --headless=new --disable-gpu --hide-scrollbars \
  --screenshot=public/og.png --window-size=1200,630 assets/og.html
```

`og:image` must stay absolute; a relative path silently fails to unfurl.

---

## Verification

Run all of these before calling any content change done.

```bash
npm run build      # 0 errors, 9 pages
```

**Disclosure audit** — case-sensitive, and note the trap: adding `-i` makes `[A-Z]` match Tailwind
class names like `cols-10` and produces dozens of false positives.

```bash
cd dist && grep -ohE '\b[A-Z]{3,12}-[0-9]{1,5}\b' index.html work/*/index.html | sort -u
# expect only: ICD-10
```

Also sweep for `PR #[0-9]`, `\$[0-9]`, `org 2[0-9][0-9]`, and years-of-experience totals — all must
return nothing.

**Payload** — home page under ~25 KB gzipped, and `ls dist/_astro/*.js` must find nothing.

**Fallbacks** — confirm `data-controls hidden` is present in the built HTML, that all three tool
names render server-side, and that the diagram's overview panel is in the HTML without scripting.

**Responsive** — see the tooling note below; measure, do not screenshot.

---

## Tooling gotchas already paid for

- **Astro trims whitespace around inline expressions.** `and the <span>MLOps</span>` renders as
  `theMLOps`. Use `{' '}` explicitly. This shipped twice.
- **`mcp__claude-in-chrome__resize_window` lies.** It reports success and the viewport does not
  change, so media queries never re-evaluate. Use the in-app Browser pane's `resize_window`
  (`{preset:"mobile"}` gives a real 375×812). Its screenshots need the pane displayed, but
  `javascript_tool` works regardless — measure `clientWidth`/`scrollWidth`,
  `getBoundingClientRect()` and `getComputedStyle().gridTemplateColumns` instead of looking.
- **Local-dev screenshots go stale.** Sections have appeared blank while `getComputedStyle` reported
  `opacity: 1`. Trust the DOM over the image.
- Markdown backticks in `case-studies.ts` bullet copy are converted to `<code>` by a helper in
  `[slug].astro`. Nothing else converts markdown — there is no markdown pipeline.

---

## Open items

- `links.formspreeId` is empty. Hammad creates the form, then it drops in.
- Known and deferred by his decision: the CV template renders a LinkedIn URL that extracts as a dead
  link, and drops hyphens from compounds like "LLM-as-judge".
- Resolved 2026-08-11: the CV PDF was regenerated without em dashes, so the download and the page
  now read in the same voice.
- Resolved 2026-08-11: the live URL is on LinkedIn in both places, the profile website field (typed
  as Portfolio) and the top of the Featured section. Note that LinkedIn's link preview rejects
  `https://star-mech.github.io` without a trailing slash; `https://star-mech.github.io/` resolves.
- Resolved 2026-08-11: LinkedIn location now reads Islamabad, so it no longer contradicts the site.
  The postal code alone does not move it; the displayed location comes from the city typeahead in
  the field labelled "Country/Region", which accepts cities.
- Resolved 2026-08-10: his LinkedIn Medlabs entry now matches the paper's 593,055-patient figure, so
  the profile and the site no longer contradict each other.
