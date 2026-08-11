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
  /** The evidential second beat. What makes the work different from a stack list. */
  stance:
    'Four AI products shipped at IgniteTech, a first-author clinical-ML paper, and a habit of measuring before recommending. That includes the time I measured a 74.7% cost saving and recommended against it.',
  availability: 'Open to remote AI and LLM roles.',
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
  gensym: 'https://g2mcp.ignitetech.ai',
  cv: '/Hammad-Maqsood-CV.pdf',
  /**
   * Formspree form id, e.g. 'xdkogqyz'. Empty until Hammad creates the form
   * himself — creating accounts on his behalf is not something I do. While it
   * is empty the contact section renders a mail-based card instead, so nothing
   * on the page is ever broken or silently swallowing messages.
   */
  formspreeId: '',
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
 * it. A skill never appears on this site detached from its evidence.
 */
export const practiceAreas = [
  {
    id: 'agents',
    title: 'Agentic systems',
    blurb:
      'Multi-node LangGraph pipelines in production: routers, tool nodes, streaming state, and the failure recovery that keeps them answering. Also a ReAct agent that investigates network appliances on its own, through tools rather than a fixed script.',
    proof: ['mcp-334-to-3', 'appmanager-langgraph', 'radar-mlops'],
  },
  {
    id: 'mcp',
    title: 'MCP & tool interfaces',
    blurb:
      'Exposing large enterprise APIs to LLMs without drowning them: progressive disclosure, OpenRPC, and an organisation-wide integration standard.',
    proof: ['mcp-334-to-3', 'gensym-g2-copilot'],
  },
  {
    id: 'eval',
    title: 'LLM evaluation & cost',
    blurb:
      'Blinded LLM-as-judge bake-offs, execution-grounded eval harnesses, per-query cost attribution, and go/no-go calls that survive scrutiny.',
    proof: ['the-no-go', 'appmanager-langgraph', 'gensym-g2-copilot'],
  },
  {
    id: 'mlops',
    title: 'MLOps & model deployment',
    blurb:
      'Serverless training and inference, a model registry with champion/challenger promotion, SHAP explainability, and a self-recentring tuning loop. Before that, the plainer half of the job: getting models into production at all, on GPUs, behind services that stay up.',
    proof: ['radar-mlops', 'smart-eob', 'medlabs'],
  },
  {
    id: 'rca',
    title: 'Production root-cause analysis',
    blurb:
      'Reading traces and logs until the real cause appears, then shipping the fix with the before and after measured, and filing the residual risk instead of hiding it.',
    proof: ['radar-mlops', 'appmanager-langgraph'],
  },
  {
    id: 'fullstack',
    title: 'Full-stack delivery',
    blurb:
      'FastAPI and Django backends through to React and TypeScript interfaces, plus a claims system delivered alone from OCR pipeline to admin screen. Features owned end to end rather than handed across a boundary.',
    proof: ['appmanager-langgraph', 'radar-mlops', 'smart-eob'],
  },
] as const;

/**
 * The flagship case studies. This index drives the work grid and the
 * practice-area cross-links; bodies live in `case-studies.ts`.
 */
export const work = [
  {
    slug: 'mcp-334-to-3',
    title: '334 methods, 3 tools',
    kicker: 'Kerio Control MCP',
    summary:
      'A network appliance exposes 334 JSON-RPC admin methods. Handing an LLM one tool per method destroys the context window before it can think. I built a three-tool progressive-disclosure layer instead: discover, inspect, call. The pattern went on to be reused across three products.',
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
      'The multi-node LangGraph conversation pipeline that became the product’s core architecture, a schema-driven factory that generates tools from API specs, and the long reliability tail that decided whether any of it survived real customers: tool-call recovery, streaming stability, multi-tenant isolation.',
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
      'A serverless ML platform that watches managed network appliances: training, evaluation and inference on Lambda and Step Functions, a model registry with automated champion selection, SHAP explainability, and supervised plus unsupervised detection running in parallel. On top of it, a ReAct agent that investigates each anomaly through appliance tools rather than a fixed script.',
    figure: '95.8%',
    figureNote: 'appliance-lookup failure rate eliminated; anomalies had been dropping silently',
    tags: ['AWS Lambda', 'Step Functions', 'MLflow', 'SHAP', 'Isolation Forest', 'Django'],
    featured: true,
  },
  {
    slug: 'the-no-go',
    title: 'The NO-GO',
    kicker: 'LLM evaluation & cost engineering',
    summary:
      'I measured a 74.7% reduction in cost per query from a cheaper model, then ran a blinded judge over 83 paired questions to check what it cost in quality. The incumbent won 60 of them. I recommended against the saving, and wrote down why.',
    figure: '60 – 18',
    figureNote: 'blinded head-to-head, against a 74.7% cheaper model',
    tags: ['LLM-as-judge', 'Langfuse', 'FinOps', 'Bake-off design', 'Multi-provider'],
    featured: true,
  },
  {
    slug: 'gensym-g2-copilot',
    title: 'Teaching a model a language it has never seen',
    kicker: 'Gensym G2',
    summary:
      'G2 is a proprietary expert-system language with no public training data, so no model can write it. I pivoted the project off fine-tuning onto real-time documentation retrieval, shipped it as an authenticated hosted product, and built an eval harness that runs generated code inside a live G2 instance to score it.',
    figure: '95%',
    figureNote: 'execution-grounded codegen baseline, scored by running the code',
    tags: ['MCP', 'Hybrid retrieval', 'pgvector', 'BM25', 'TypeScript', 'Evaluation'],
    featured: true,
  },
  {
    slug: 'smart-eob',
    title: 'Two OCR engines, one answer',
    kicker: 'SMART EOB',
    summary:
      'Posting explanation-of-benefits documents was manual, and most incoming claims had already been posted, so staff spent their day re-checking finished work. I delivered the whole system alone: an OCR pipeline that cross-checks two engines against each other before trusting a claim number, a parallel processing pipeline tuned to the GPU and database ceilings of the machine it ran on, and the Django application and admin screens around it.',
    figure: '~6×',
    figureNote: 'faster batch processing, down to about 30 minutes',
    tags: ['PaddleOCR', 'Tesseract', 'Celery', 'RabbitMQ', 'Django', 'CUDA'],
    featured: true,
  },
  {
    slug: 'medlabs',
    title: 'Rules where certain, model where not',
    kicker: 'Medlabs',
    summary:
      'Chronic-disease diagnosis predicted from routine lab results, across 593,055 patients at 547 US primary-care centres. A clinically validated rule base confirms the clear-cut cases and a gradient-boosted model ranks likely diagnoses for the ambiguous ones, with SHAP explaining every inference to the physician reading it. Published as a first-author paper.',
    figure: '83.1%',
    figureNote: 'top-5 diagnostic accuracy, the ranked shortlist a physician then confirms',
    tags: ['XGBoost', 'PySpark', 'SHAP', 'ICD-10', 'Flask', 'Clinical ML'],
    featured: true,
  },
] as const;

export type WorkItem = (typeof work)[number];

export function workBySlug(slug: string): WorkItem | undefined {
  return work.find((w) => w.slug === slug);
}

/**
 * Which mini instrument each case study tile carries. Every one is built from
 * that project's own result. No stock imagery anywhere on this site.
 */
export const workViz: Record<
  string,
  'context' | 'waterfall' | 'race' | 'plot' | 'dots' | 'split' | 'curve'
> = {
  'mcp-334-to-3': 'context',
  'appmanager-langgraph': 'waterfall',
  'radar-mlops': 'race',
  'the-no-go': 'plot',
  'gensym-g2-copilot': 'dots',
  'smart-eob': 'split',
  'medlabs': 'curve',
};
