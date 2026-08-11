---
name: deploy
description: >-
  Deploy the portfolio site to GitHub Pages and verify it live. Use when asked to
  deploy, publish, ship or push the site, to check whether a change is live, to
  find the live URL, or when a deploy has failed or the site is serving stale or
  wrong content.
---

# Deploy star-mech.github.io

## Where it lives

| | |
|---|---|
| **Live URL** | https://star-mech.github.io |
| **Repo** | https://github.com/Star-Mech/star-mech.github.io (public) |
| **Local** | `F:\portfolio-site` |
| **Deploy method** | GitHub Actions → GitHub Pages. `.github/workflows/deploy.yml` |
| **Trigger** | Any push to `main`. Also `workflow_dispatch`. |
| **Build** | `npm ci` → `npm run build` → `dist/` → `upload-pages-artifact` → `deploy-pages` |
| **Typical time** | ~40 s for the workflow, plus up to ~30 s before the CDN serves the new content |

There is no staging environment. `main` is production.

## Before you push

Never deploy an unverified content change — the disclosure rules in `CLAUDE.md` are the reason this
site can be trusted, and a violation is public the moment it ships.

```bash
cd /f/portfolio-site
npm run build          # must be 0 errors, 7 pages
```

Then the disclosure audit. **Case-sensitive** — adding `-i` makes `[A-Z]` match Tailwind class names
like `cols-10` and produces dozens of false positives:

```bash
cd /f/portfolio-site/dist
grep -ohE '\b[A-Z]{3,12}-[0-9]{1,5}\b' index.html work/*/index.html | sort -u
#   expect ONLY: ICD-10
grep -ohE 'PR #[0-9]+|\$[0-9]|org 2[0-9]{2}' index.html work/*/index.html | sort -u
#   expect nothing
```

And the payload guard — the site's speed is part of its argument:

```bash
gzip -c dist/index.html | wc -c      # under ~25000 bytes
ls dist/_astro/*.js                  # must find NOTHING (no framework runtime)
```

## Deploy

```bash
cd /f/portfolio-site
git add -A && git commit    # Conventional Commits; see repo history for register
git push
```

Then watch it, do not assume it:

```bash
gh run watch "$(gh run list --limit 1 --json databaseId --jq '.[0].databaseId')" --exit-status
```

A Node 20 deprecation warning from the actions is expected and harmless.

## Verify live, not just green

A green workflow does not prove the site is correct. Always fetch it:

```bash
B=https://star-mech.github.io
for p in / /404.html /og.png /robots.txt /sitemap-index.xml /Hammad-Maqsood-CV.pdf \
         /work/mcp-334-to-3/ /work/appmanager-langgraph/ /work/radar-mlops/ \
         /work/the-no-go/ /work/gensym-g2-copilot/; do
  printf "%-32s %s\n" "$p" "$(curl -s -o /dev/null -w '%{http_code} %{size_download}' -L "$B$p")"
done
```

All must be `200`. The CV must be ~140 KB and start with `%PDF-` — **that URL is printed on
Hammad's actual CV**, so a 404 there is worse than a broken page.

Spot-check that the deploy carried your change, e.g.:

```bash
curl -sL https://star-mech.github.io/ | grep -c "the string you just added"
```

## Auth — the thing most likely to block you

**Two GitHub accounts exist and only one can push here.**

- `Star-Mech` — personal, owns this repo. **Must be the active account.**
- `hammad-starmech` — the day-job account, carrying the IgniteTech contribution history.

```bash
gh auth status              # "Active account: true" must be under Star-Mech
gh auth switch --user Star-Mech
gh config get git_protocol  # must be https
```

HTTPS matters: the SSH key on this machine is not registered with GitHub, so an SSH remote fails with
`Permission denied (publickey)`.

**Do not run `gh auth login` yourself** — it is an interactive browser approval flow. If neither
account is authenticated, ask Hammad to run it and pick `Star-Mech` + HTTPS.

## Troubleshooting

**Site 404s, or serves something that looks like the raw repo.** Pages is on legacy branch-deploy
instead of Actions. GitHub auto-enables legacy when a repo is named `<account>.github.io`, and legacy
serves the repo root — which has no `index.html`. This has happened once already:

```bash
gh api repos/Star-Mech/star-mech.github.io/pages   # check build_type
gh api -X PUT repos/Star-Mech/star-mech.github.io/pages -f build_type=workflow
```

**A red `pages-build-deployment` run in the Actions tab.** If it predates the fix above, it is the
legacy deploy and is expected history. Only `Deploy to GitHub Pages` matters.

**Workflow fails at `npm ci`.** `package-lock.json` is out of sync with `package.json`. Run
`npm install` locally, commit the lockfile. The build runs on Linux and can fail where Windows
succeeded — read the run log rather than guessing:

```bash
gh run view <id> --log-failed
```

**Change deployed but not visible.** CDN lag; wait ~30 s and re-fetch. If it persists, confirm the
built HTML in `dist/` actually contains the change — the problem is usually local, not the deploy.

**Need to roll back.** Revert the commit and push; there is no other rollback mechanism.

```bash
git revert <sha> && git push
```

## Related

- `CLAUDE.md` — what may and may not be published, and why
- Regenerating the CV or the OG image are documented there; both are manual steps whose outputs are
  committed, not build steps.
