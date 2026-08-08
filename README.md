# star-mech.github.io

Personal site for Hammad Maqsood — AI/LLM engineer.

Built with [Astro](https://astro.build) + Tailwind CSS v4, with React islands used only where an
interaction carries information a paragraph could not.

## Commands

```bash
npm install     # once
npm run dev     # local dev server at localhost:4321
npm run build   # static build into dist/
npm run preview # serve the built output
```

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and publishes to GitHub
Pages. Enable it once under **Settings → Pages → Source → GitHub Actions**.

## Structure

```
src/
  data/site.ts        all site content in one place
  layouts/Base.astro  document shell, meta, skip link
  components/         Nav, Footer, SectionHeader, ContextPanels
  pages/
    index.astro       the long home page
    work/[slug].astro one route per case study
  styles/global.css   design tokens + component classes
public/               static assets (favicon, CV PDF)
```

## Content rules

These are deliberate constraints, not oversights:

- No Jira keys, no pull-request numbers, no internal URLs, no customer or organisation identifiers.
- Ratios and percentages are publishable; absolute dollar amounts and absolute customer or traffic
  counts are not.
- No skill appears detached from the work that proves it.
- Every claim traces to source evidence.

## Accessibility

WCAG 2.1 AA is a build requirement. Every interactive element must be keyboard-operable, focus must
be visible, and `prefers-reduced-motion` must have a real static path — not a degraded one.
