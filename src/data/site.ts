/**
 * Single source of content for the site.
 *
 * Content rules enforced here (see the plan):
 *  - No Jira keys, no PR numbers, no internal URLs, no customer/org identifiers.
 *  - Ratios and percentages are fine; absolute dollar amounts and absolute
 *    customer/traffic counts are not.
 *  - Every claim traces to the evidence corpus.
 */

export const profile = {
  name: 'Hammad Maqsood',
  role: 'AI / LLM Engineer',
  location: 'Islamabad, Pakistan',
  remote: 'Remote',
  /** One line. What he builds, in his own register. */
  positioning:
    'I build production LLM agents, MCP interfaces, and the MLOps underneath them.',
  /** The evidential second beat — what makes the work different from a stack list. */
  stance:
    'Four AI products shipped at IgniteTech, a first-author clinical-ML paper, and a habit of measuring before recommending — including the time I measured a 74.7% cost saving and recommended against it.',
  availability: 'Open to remote AI/LLM roles — immediate availability.',
} as const;

export const links = {
  email: 'hamadmaqsood1@gmail.com',
  linkedin: 'https://www.linkedin.com/in/hammad-maqsood-71b0091a1/',
  /** Personal account — hosts this site. */
  github: 'https://github.com/Star-Mech',
  /** Day-job account — carries the IgniteTech-period contribution history. */
  githubWork: 'https://github.com/hammad-starmech',
  paper: 'https://arxiv.org/abs/2603.14876',
  npm: 'https://www.npmjs.com/package/openrpc-mcp-server-updated',
  gensym: 'https://g3mcp.ignitetech.ai',
  cv: '/Hammad-Maqsood-CV.pdf',
} as const;

export const nav = [
  { label: 'Work', href: '#work' },
  { label: 'Root Cause', href: '#root-cause' },
  { label: 'Research', href: '#research' },
  { label: 'Trajectory', href: '#trajectory' },
  { label: 'About', href: '#about' },
] as const;

/**
 * Practice areas. Each one is a claim, so each one names the work that proves
 * it — a skill never appears on this site detached from its evidence.
 */
export const practiceAreas = [
  {
    id: 'agents',
    title: 'Agentic systems',
    duration: '2 yrs',
    blurb:
      'Multi-node LangGraph pipelines in production — routers, tool nodes, streaming state, and the failure recovery that keeps them answering.',
    proof: ['mcp-334-to-3', 'appmanager-langgraph'],
  },
  {
    id: 'mcp',
    title: 'MCP & tool interfaces',
    duration: '1.5 yrs',
    blurb:
      'Exposing large enterprise APIs to LLMs without drowning them — progressive disclosure, OpenRPC, and an org-wide integration standard.',
    proof: ['mcp-334-to-3', 'gensym-g2-copilot'],
  },
  {
    id: 'eval',
    title: 'LLM evaluation & cost',
    duration: '2 yrs',
    blurb:
      'Blinded LLM-as-judge bake-offs, execution-grounded eval harnesses, per-query cost attribution, and go/no-go calls that survive scrutiny.',
    proof: ['the-no-go', 'gensym-g2-copilot'],
  },
  {
    id: 'mlops',
    title: 'MLOps & anomaly detection',
    duration: '2 yrs',
    blurb:
      'Serverless training and inference, a model registry with champion/challenger promotion, SHAP explainability, and a self-recentring tuning loop.',
    proof: ['radar-mlops'],
  },
  {
    id: 'rca',
    title: 'Production root-cause analysis',
    duration: 'the through-line',
    blurb:
      'Reading traces and logs until the real cause appears — then shipping the fix with the before/after measured, and filing the residual risk instead of hiding it.',
    proof: ['radar-mlops', 'appmanager-langgraph'],
  },
  {
    id: 'fullstack',
    title: 'Full-stack delivery',
    duration: '3 yrs',
    blurb:
      'FastAPI and Django backends through to React/TypeScript interfaces — features owned end to end rather than handed across a boundary.',
    proof: ['appmanager-langgraph', 'radar-mlops'],
  },
] as const;

/**
 * The five flagship case studies. Bodies land in Phase 2; this index drives
 * the work grid and the practice-area cross-links.
 */
export const work = [
  {
    slug: 'mcp-334-to-3',
    title: '334 methods, 3 tools',
    kicker: 'Kerio Control MCP',
    summary:
      'A network appliance exposes 334 JSON-RPC admin methods. Handing an LLM one tool per method destroys the context window before it can think. I built a three-tool progressive-disclosure layer instead — discover, inspect, call — and the pattern went on to be reused across three products.',
    figure: '334 → 3',
    figureNote: 'admin methods, exposed through three tools',
    tags: ['MCP', 'OpenRPC', 'JSON-RPC', 'Node.js', 'Context engineering'],
    featured: true,
  },
  {
    slug: 'appmanager-langgraph',
    title: 'The agent that shipped',
    kicker: 'AppManager AI',
    summary:
      'The multi-node LangGraph conversation pipeline that became the product’s core architecture, a schema-driven factory that generates tools from API specs, and the long reliability tail — tool-call recovery, streaming stability, multi-tenant isolation — that decided whether any of it survived real customers.',
    figure: '2.4×',
    figureNote: 'faster on a failing streaming path, once the real cause was found',
    tags: ['LangGraph', 'LangChain', 'FastAPI', 'SSE', 'React', 'AWS'],
    featured: true,
  },
  {
    slug: 'radar-mlops',
    title: 'Anomalies at appliance scale',
    kicker: 'GFI RADAR',
    summary:
      'A serverless ML platform that watches managed network appliances: training, evaluation and inference on Lambda and Step Functions, a model registry with automated champion selection, SHAP explainability, and supervised plus unsupervised detection running in parallel.',
    figure: '95.8%',
    figureNote: 'appliance-lookup failure rate eliminated — anomalies had been dropping silently',
    tags: ['AWS Lambda', 'Step Functions', 'MLflow', 'SHAP', 'Isolation Forest', 'Django'],
    featured: true,
  },
  {
    slug: 'the-no-go',
    title: 'The NO-GO',
    kicker: 'LLM evaluation & cost engineering',
    summary:
      'I measured a 74.7% reduction in cost per query from a cheaper model, then ran a blinded judge over 83 paired questions to check what it cost in quality. The incumbent won 60 of them. I recommended against the saving — and wrote down why.',
    figure: '60 – 18',
    figureNote: 'blinded head-to-head, against a 74.7% cheaper model',
    tags: ['LLM-as-judge', 'Langfuse', 'FinOps', 'Bake-off design', 'Multi-provider'],
    featured: true,
  },
  {
    slug: 'gensym-g2-copilot',
    title: 'A copilot for a language nobody knows',
    kicker: 'Gensym G2',
    summary:
      'G2 is a proprietary expert-system language with no public training data, so no model can write it. I pivoted the project off fine-tuning onto real-time documentation retrieval, shipped it as an authenticated hosted product, and built an eval harness that runs generated code inside a live G2 instance to score it.',
    figure: '95%',
    figureNote: 'execution-grounded codegen baseline, scored by running the code',
    tags: ['MCP', 'Hybrid retrieval', 'pgvector', 'BM25', 'TypeScript', 'Evaluation'],
    featured: true,
  },
] as const;

export type WorkItem = (typeof work)[number];

export function workBySlug(slug: string): WorkItem | undefined {
  return work.find((w) => w.slug === slug);
}

/**
 * Which mini instrument each case study tile carries. Every one is built from
 * that project's own result — no stock imagery anywhere on this site.
 */
export const workViz: Record<string, 'context' | 'waterfall' | 'race' | 'plot' | 'dots'> = {
  'mcp-334-to-3': 'context',
  'appmanager-langgraph': 'waterfall',
  'radar-mlops': 'race',
  'the-no-go': 'plot',
  'gensym-g2-copilot': 'dots',
};
