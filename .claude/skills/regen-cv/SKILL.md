---
name: regen-cv
description: >-
  Regenerate the downloadable CV PDF served by the portfolio site, from its
  web-specific source in the JobSearch repo. Use when the CV needs updating,
  when a claim on it changed, or when the CV download is stale, wrong or
  missing.
---

# Regenerate the site's CV

`public/Hammad-Maqsood-CV.pdf` is served from **https://star-mech.github.io/Hammad-Maqsood-CV.pdf**,
and **that URL is printed on the CV itself and given to employers.** Treat it as production.

## The two CVs, and why they differ

| | Application CV | Web CV |
|---|---|---|
| Source | `F:\JobSearch\applications\_general\core\Hammad-Maqsood-CV-General-Core.html` | `...\Hammad-Maqsood-CV-Web.html` |
| Audience | A named employer, sent directly | Anyone on the internet, forever |
| Location line | `Islamabad, Pakistan` | `Islamabad, Pakistan · Remote` |
| Phone number | present | **removed** |
| Dollar figures | present | **removed** |
| Extra contact | — | link back to the site's contact section |

> **Only ever edit `Hammad-Maqsood-CV-Web.html`.** The application CV feeds `/job-tailor` and
> `/job-application`; changing it to fix a website problem breaks those flows. If a claim is wrong in
> both, fix both deliberately and say so.

The three web-specific removals exist for concrete reasons:

- **Phone number** — a public PDF gets scraped.
- **Dollar figures** (the per-query cost baseline, the per-conversation token-burn range) — publishing
  an employer's unit economics at a permanent public URL is not the same as putting them in a CV
  mailed to one recipient. The site's own NO-GO case study states that absolute cost figures are
  withheld *because they belong to the employer*, so a CV on the same domain publishing them makes
  the site self-contradicting.
- **`· Remote`** — the site's entire audience is remote roles.

## Steps

### 1. Edit the web source

```bash
cd /f/JobSearch/applications/_general/core
# edit Hammad-Maqsood-CV-Web.html
```

If the change originates in the application CV, port it across by hand rather than re-copying the
file — a straight copy silently reinstates the phone number and the dollar figures.

Ground any new or changed claim in `/f/JobSearch/corpus/cv-content.md`, same as the site.

### 2. Render

```bash
cd /f/JobSearch/applications/_general/core
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu \
  --no-pdf-header-footer \
  --print-to-pdf="$(pwd -W)/Hammad-Maqsood-CV-Web.pdf" \
  "file:///$(pwd -W)/Hammad-Maqsood-CV-Web.html"
```

`$(pwd -W)` gives Chrome a Windows path; a POSIX path fails silently and leaves the old PDF in place.

### 3. Verify the rendered text layer

Chrome fails quietly, so check the extracted text, never the source and never by eye:

```bash
cd /f/JobSearch
bash scripts/verify-cv.sh \
  applications/_general/core/Hammad-Maqsood-CV-Web.html \
  applications/_general/core/Hammad-Maqsood-CV-Web.pdf \
  --no-md-check
```

Must exit 0. It checks page count, that hyphenated compounds survive extraction, that the LinkedIn
slug is intact, that no letter-spaced headings regressed, and it prints every number on the page for
cross-checking against the corpus. `--no-md-check` is correct here — the web variant has no
accompanying `.md`.

Then the two web-specific guards, which `verify-cv.sh` does not know about:

```bash
pdftotext applications/_general/core/Hammad-Maqsood-CV-Web.pdf - > /tmp/cv.txt
grep -c '8903806\|307 890' /tmp/cv.txt     # must be 0 — phone number
grep -c '\$[0-9]'          /tmp/cv.txt     # must be 0 — dollar figures
grep -o 'Remote'           /tmp/cv.txt | head -1   # must be present
```

Also read the `Numbers on the page` block from `verify-cv.sh` output and confirm each figure against
`corpus/cv-content.md`. That scan is what caught the dollar figures in the first place.

### 4. Copy in, rebuild, deploy

```bash
cp /f/JobSearch/applications/_general/core/Hammad-Maqsood-CV-Web.pdf \
   /f/portfolio-site/public/Hammad-Maqsood-CV.pdf
cd /f/portfolio-site && npm run build
```

The filename in `public/` is `Hammad-Maqsood-CV.pdf` and **must not change** — `links.cv` in
`src/data/site.ts` points at it, and the old URL is on printed and emailed copies.

Then the `deploy` skill, and confirm live:

```bash
curl -sL https://star-mech.github.io/Hammad-Maqsood-CV.pdf | head -c 5   # %PDF-
curl -s -o /dev/null -w '%{size_download}\n' -L \
  https://star-mech.github.io/Hammad-Maqsood-CV.pdf                      # ~140 KB
```

Commit in **both** repos — the source lives in JobSearch, the artifact in the site repo.

## Known and deferred

Recorded by Hammad's decision, so do not "discover" them again as new problems: the CV template
renders a LinkedIn URL that extracts as a dead link, and drops hyphens from compounds like
"LLM-as-judge". Fix only if asked.

## Bounds on CV content

From the corpus, and non-negotiable:

- **Never state a computed years-of-experience total.** Dates only.
- **Do not generate a project count** Hammad has not published himself.
- The freelance record is stated as platform-computed counts and real averages (41/41 at 4.7★,
  12/12). Never imply a flawless record; both public records carry a poor review.
