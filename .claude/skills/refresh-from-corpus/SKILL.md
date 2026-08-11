---
name: refresh-from-corpus
description: >-
  Audit the portfolio site's claims against the current evidence corpus and
  report what is stale, understated or contradicted. Use after a job-scout
  review, after new evidence is added to the corpus, or when asked whether the
  site is still accurate or up to date.
---

# Refresh the site against the corpus

The site is a snapshot; the corpus keeps growing. Every `/job-scout review` in `F:\JobSearch` can add
evidence, correct a figure, or surface something that was missing entirely — and the site then quietly
understates Hammad or, worse, contradicts his own published material.

This is not hypothetical. Both have already happened inside the corpus:

- The Medlabs cohort was recorded as "100k+ patients" when the published paper says **593,055** — an
  understatement of roughly **6×**, carried by every application produced before it was caught.
- A **first-author arXiv publication** was absent from the corpus entirely, so every earlier
  application omitted the single most verifiable artifact Hammad has.

The point of this skill is to find that class of drift before an employer does.

## 1. Find what changed in the corpus

The corpus flags its own corrections. Start there:

```bash
grep -n "⚠" /f/JobSearch/corpus/cv-content.md
```

Each `⚠` marks a fact that was wrong, contested, or newly added, usually with a date and the reason.
Read every one and ask: *does the site repeat the old version?*

Then look for dated review annotations, which mark facts added or corrected at a review:

```bash
grep -noE "(added|corrected|user-supplied|amended) [0-9]{4}-[0-9]{2}-[0-9]{2}" \
  /f/JobSearch/corpus/cv-content.md | sort -u -t: -k2
```

Anything dated **after the site's last content commit** is a candidate. Find that date with:

```bash
cd /f/portfolio-site && git log -1 --format=%ci -- src/data/
```

Also check whether whole sections have appeared. `cv-content.md` has `## Publications`, `## Awards`,
`## Education` and `## Certifications`; **`Awards` was still empty as of 2026-08-10.** A newly
populated section is the highest-value find, because the site has no placeholder for it and will
simply be missing it.

> Trap: empty sections in `cv-content.md` are not blank — they hold an *italic template prompt*
> (`*Have you won any accolades and awards in your career? List them here.*`). A naive
> "does this section contain words" check reports every empty section as populated. Read the section,
> or exclude lines wrapped in `*`.

## 2. Compare figures, in both directions

Pull every number the site publishes and check each against the corpus:

```bash
cd /f/portfolio-site && npm run build
grep -ohE '[0-9][0-9,.]*(%|×|x)?' dist/index.html dist/work/*/index.html | sort -u
```

For each, ask three questions — **the second is the one people skip**:

1. Is it still correct?
2. **Is it now an understatement?** New evidence usually makes Hammad look better, and a stale low
   number is a self-inflicted wound. This is exactly the Medlabs failure.
3. Does it contradict anything he has published elsewhere — his LinkedIn, the arXiv paper, a public
   freelance profile? A reader who checks two sources and finds two numbers stops trusting both.

Sources of truth, in order: the **published paper** beats the corpus; the corpus beats the site.

## 3. Check the site's own claims are still true of the site

Some statements describe the site or his situation rather than his work, and those rot quietly:

- Availability and location in `src/data/site.ts` (`profile.availability`, `profile.location`).
- `about.ts` — the `1,228 contributions in the last year` figure on the `hammad-starmech` account is a
  rolling number and will drift. Re-check it or reword it.
- The `certifications` count is rendered from array length, so it is self-correcting — but the array
  itself may be behind.
- `links.formspreeId` — if a form now exists, the contact section should be using it.

## 4. Report before editing

Produce a table: **claim → where it appears → corpus says → verdict**, with verdicts limited to
`stale`, `understated`, `contradicted`, `unsupported`, or `fine`. Then ask which to apply.

Do not silently rewrite content. Some differences are deliberate — the site withholds absolute dollar
figures that the corpus contains, states percentages instead, and omits figures listed in the corpus's
"Notes on assumptions" as unmeasured or not attributable to Hammad. **Check that section before
calling anything a gap**; an excluded figure reappearing is a regression, not a fix.

## 5. Apply, verify, deploy

- New or substantially rewritten case study → use the `add-case-study` skill.
- Figure corrections → edit `src/data/*.ts` only; prose lives in data, not components.
- If a corrected figure also appears on the CV, use the `regen-cv` skill.
- Then the disclosure audit and the `deploy` skill.

## Also worth flagging outward

If the corpus and Hammad's **live LinkedIn** disagree, the fix may belong on LinkedIn rather than the
site. Say so rather than quietly making the site match a stale profile. Recapture the profile before
judging it — `corpus/current_linkedin.md` goes stale and has misled before.

One such contradiction was resolved on 2026-08-10: the LinkedIn Medlabs entry now matches the paper's
593,055 figure. Do not re-flag it.
