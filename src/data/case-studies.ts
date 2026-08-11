/**
 * Case-study bodies.
 *
 * Disclosure filter applied to every line here:
 *  - No Jira keys, no pull-request numbers, no internal URLs.
 *  - No customer or organisation identifiers. "verified on a live MSP
 *    customer's organisation", never the org id. No customer appliance names.
 *  - Ratios, percentages, latencies, token counts, trace counts and test counts
 *    are publishable. Absolute dollar amounts are not — so cost work appears as
 *    "74.7% cheaper", never as a per-query figure.
 *  - Every claim traces to corpus/cv-content.md.
 */

export interface Block {
  heading: string;
  body?: string;
  bullets?: string[];
}

export interface CaseStudy {
  slug: string;
  scope: string;
  blocks: Block[];
  hardPart: { heading: string; body: string };
  results: { figure: string; label: string }[];
  stack: { group: string; items: string[] }[];
  /** Stated where the evidence stops short of a measured before/after. */
  caveat?: string;
}

export const caseStudies: CaseStudy[] = [
  // =======================================================================
  {
    slug: 'mcp-334-to-3',
    scope:
      'Kerio Control is a network-security appliance whose administrative API exposes 334 methods over a single JSON-RPC endpoint. The goal was to let an LLM agent operate it, reading configuration, investigating traffic and changing firewall rules, without a human translating each step.',
    blocks: [
      {
        heading: 'What I built',
        bullets: [
          'Evaluated the obvious route first, generating one MCP tool per API method from an OpenAPI spec, and rejected it. Kerio Control exposes everything through one `/jsonrpc` endpoint, which OpenAPI describes badly, and tool discovery became unusable once the schema list passed a few hundred entries.',
          'Pivoted to OpenRPC, forked a stale community OpenRPC MCP server whose responses no longer worked with current clients, updated its dependencies, rebuilt it and republished it to npm so it could be used at all.',
          'Replaced the stock two-tool design (discover, call) with a three-tool progressive-disclosure architecture: `rpc_discover` returns method names only, `rpc_method_detail` returns the full schema for the single method the model picked, and `rpc_call` invokes it.',
          'Handled appliance authentication, then validated the whole thing against a live Kerio Control instance through Claude Desktop and Cursor.',
          'Later shipped an authenticated JSON-RPC proxy endpoint in the AppManager backend, with dual OIDC auth, a pre-flight ping, configured timeouts and token-redacted logging, so an agent never has to hold raw appliance credentials.',
          'Attached the layer to a LangGraph ReAct agent inside RADAR’s AI-insights pipeline, chosen over two alternative agent frameworks after hands-on evaluation, turning generic recommendations into autonomous investigations that cite specific IPs and traffic volumes.',
        ],
      },
      {
        heading: 'Then made it a standard, not a one-off',
        bullets: [
          'Authored the organisation’s MCP integration standard: tiered certification levels, integration standards for the API layer, and separate client and server checklists, validated against two real reference implementations and delivered as a team playbook.',
          'Ran the build-versus-adopt evaluation of an internal MCP platform, including a controlled onboarding-agent test across four public MCP servers in which none completed end to end, and routed the reliability and observability gaps back to the owning team with a clear boundary between prompt bugs and platform bugs.',
          'Piloted the pattern on a search product end to end, from a hand-authored OpenAPI spec through to a chat-client integration, and fixed two defects it exposed: over-strict output schemas silently truncating tool results down to bare content IDs, and a model that passed tool parameters as strings where others passed objects.',
          'Categorised all 313 tools in the AppManager backend into a nine-bucket taxonomy, concluded a backend-level MCP offered nothing actionable for anomaly response, and said so. Then built the appliance-level firewall blocking tool that did.',
          'Made the stop-work call on a second integration whose utility did not justify the build, and redirected the effort. A documented decision not to build, rather than a quiet low-value delivery.',
        ],
      },
    ],
    hardPart: {
      heading: 'The hard part',
      body:
        'The instinct is to give the model everything it might need. That is exactly what breaks it: 334 tool schemas resident on every request spend the context window before the model has reasoned about anything, and selection accuracy falls as the list grows. The reframe was that a model does not need the manual up front. It needs a directory, and the ability to ask a follow-up question. Three tools, and the same 334 methods stay reachable.',
    },
    results: [
      { figure: '334 → 3', label: 'admin methods reachable through three tool definitions' },
      { figure: '~82%', label: 'of a 28-anomaly investigation batch enriched and persisted, at roughly two minutes each' },
      { figure: '3 products', label: 'reused the pattern after it was proven on the first appliance' },
      { figure: 'public', label: 'the modernised OpenRPC MCP server, published to npm' },
    ],
    stack: [
      { group: 'Protocols', items: ['MCP', 'OpenRPC', 'JSON-RPC', 'OpenAPI (evaluated, rejected)'] },
      { group: 'Runtime', items: ['Node.js', 'npm publishing', 'Python', 'LangGraph ReAct'] },
      { group: 'Auth & infra', items: ['OIDC', 'token-redacted logging', 'live appliance validation'] },
      { group: 'Clients', items: ['Claude Desktop', 'Cursor', 'LibreChat'] },
    ],
    caveat:
      'The npm package has no published download or adoption figures, so its reach is not claimed, only that it exists, is public, and unblocked current clients.',
  },

  // =======================================================================
  {
    slug: 'appmanager-langgraph',
    scope:
      'An AI assistant embedded in the GFI AppManager platform, letting managed service providers run IT-management tasks in natural language. FastAPI and LangGraph on the backend, a React and TypeScript widget on the front. I built the core pipeline, then owned the reliability work that decided whether it survived contact with customers.',
    blocks: [
      {
        heading: 'The architecture',
        bullets: [
          'Designed and shipped the multi-node LangGraph conversation pipeline that is still the documented product architecture: agents, nodes, routers, shared state, per-node model configuration and the streaming generator, at 7,216 lines across 47 files, creating the package from nothing.',
          'Built a schema-driven tool factory that generates LangChain tools from API specifications rather than hand-writing each one, with retrieval-based selection across dozens of tools.',
          'Built a provider-agnostic model layer with one streaming interface across three providers, making model swaps a configuration change, and shipped a verified fallback path so a provider outage degrades instead of failing.',
          'Prototyped a planner-executor orchestrator against the shipped ReAct loop, measured it 15% slower (23.51s against 20.45s) with 35% more model calls, and deliberately did not merge it. The observed query distribution was 62 of 71 queries needing a single tool call, so the planner was solving a problem the traffic did not have.',
        ],
      },
      {
        heading: 'Keeping it answering',
        bullets: [
          'Converted aborting tool-call failures into recoverable retries by feeding validation errors and tracebacks back to the model to self-correct, and coerced malformed tool arguments at the graph boundary, which also ended a class of recursion loop that burned tokens on every failed conversation.',
          'Root-caused an intermittent provider 400 error to concurrent same-session requests and serialised them behind a per-session lock with a forced-release watchdog, so a stuck request cannot lock a user out of their own session.',
          'Fixed an orphaned tool-call bug that permanently broke chat sessions on certain queries, by reproducing the exact production incident as a failing test first, backed by 29 new unit tests across four layers.',
          'Delivered the multi-tenant data-isolation fix that stopped the assistant mixing data across companies for multi-tenant operators: optional account scoping threaded through nine tools in a three-layer design, 25 new regression tests, a 251-test suite green, verified live on a real operator organisation before release.',
          'Collapsed ten near-duplicate per-product documentation tools into one enum-constrained dispatcher, removing about 250 lines of duplicated logic and with it the wrong-product answers, cross-product answers and blank-answer recursion errors. 10 of 10 deterministic unit tests and 6 of 6 live scenarios passed.',
          'Fixed degraded tool selection on non-English questions by always emitting an English rewritten query behind a language gate: English keeps a zero-model fast path, everything else gets one cheap translation pass.',
          'Made health logging honest by separating success from tool errors and empty tool results, so the metrics stopped reporting 100% success during failures.',
          'Filed a residual jailbreak gap as a follow-up rather than leaving the risk silent once per-organisation access enforcement shipped.',
        ],
      },
      {
        heading: 'Observability and launch',
        bullets: [
          'Delivered the application-layer error monitoring and Slack alerting the team had none of during a live customer beta: logs to a Lambda to a topic to Slack, with full tracebacks on every hot-path handler. Then killed a duplicate-alert storm by reverting an over-engineered log pipeline.',
          'Built the organisation-level enable/disable infrastructure that was the prerequisite for any rollout, and resolved a customer-facing exposure incident the same day it was reported: acknowledged in about sixteen minutes, root-caused to a stale deployment branch, redeployed.',
          'Re-architected the documentation refresh pipeline from a manual, deploy-coupled process into an automated workflow that scrapes, rebuilds the vector index, and hot-reloads both environments through one authenticated call with no redeploy, and expanded coverage from six product stores to ten.',
          'Built a repeatable production-trace analysis pipeline as committed tooling, and used it to characterise two post-launch windows, growing from 63 traces to 218.',
        ],
      },
    ],
    hardPart: {
      heading: 'The hard part',
      body:
        'The pipeline was never the difficult part. What was difficult is that a demo answers one question at a time, in one language, for one tenant, on a healthy network. Production does none of those things. Every fix above came out of reading traces from real sessions, and several of them were invisible in the metrics until the logging was made honest enough to show them.',
    },
    results: [
      { figure: '2.4×', label: 'faster on a failing streaming path: 92s with no answer became 39.16s complete' },
      { figure: '102s → 92s', label: 'p99 latency across two measured post-launch windows, mean per trace 31.8s → 27.1s' },
      { figure: '1-in-17 → 0-in-30', label: 'follow-up-question regression, driven out by measured prompt-context iteration' },
      { figure: '8 languages', label: 'localised fallback covering the indefinite-hang recovery path' },
    ],
    stack: [
      { group: 'Agent', items: ['LangGraph', 'LangChain', 'ReAct', 'tool-calling', 'checkpointing'] },
      { group: 'Backend', items: ['Python', 'FastAPI', 'SSE streaming', 'Pydantic', 'asyncio'] },
      { group: 'Frontend', items: ['React', 'TypeScript', 'MUI'] },
      { group: 'Models', items: ['Anthropic Claude', 'OpenAI', 'Google', 'AWS Bedrock', 'fastText'] },
      { group: 'Infra', items: ['AWS ECS', 'ALB', 'CloudWatch', 'Lambda', 'SNS', 'Langfuse', 'FAISS'] },
    ],
  },

  // =======================================================================
  {
    slug: 'radar-mlops',
    scope:
      'A machine-learning product that watches managed network appliances, among them Kerio Control, Kerio Connect, GFI Archiver and MailEssentials, and surfaces anomalies with recommended actions. Serverless AWS for the model pipeline, Django for ingestion. I was the sole hands-on ML and MLOps engineer across the data foundation, the model pipeline and the ingestion backend.',
    blocks: [
      {
        heading: 'The model pipeline',
        bullets: [
          'Sole implementer of the serverless supervised pipeline: data preparation from a search cluster and object storage, per-appliance model selection, scaler and explainer persistence in a model registry, an event-triggered inference function writing calibrated probabilities to PostgreSQL, and a queue hand-off for feature attribution, delivered across 41 self-authored merged pull requests.',
          'Built a state-machine pipeline for train, evaluate and champion selection, hard-linking registry run ids to kill a parallel-training race condition, with inline alias-based promotion and configurable performance-tolerance bands. Validated across parallel multi-appliance execution, designed to scale to hundreds.',
          'Closed the loop: hyperparameters discovered during training write back into configuration automatically, so the Bayesian search re-centres itself and stays drift-resistant, with significant-change gating and a versioned audit trail, and no new infrastructure after a deliberate design trade.',
          'Shipped the unsupervised pipeline running in parallel with the supervised path and aggregated with it, pivoting from one algorithm to Isolation Forest after a documented bake-off that eliminated multi-minute inference latency and degenerate scoring where everything looked anomalous. Roughly 7,000 lines of new package code, with explainability and temporal visual evaluation.',
          'Extended coverage from two appliance types to four, fixing a chunker bug that had silently blocked every appliance onboarded through the search cluster, and validating against tens of thousands of live records per new type.',
        ],
      },
      {
        heading: 'Making the numbers trustworthy',
        bullets: [
          'Removed training-data leakage by re-architecting random splits into temporal ones, after 300 of 3,300 evaluation points turned out to have been training data, then raised the decision threshold to roughly double precision, from 0.35 to 0.72, at minimal recall cost (1.0 to 0.967).',
          'Found and fixed an accidental double-normalisation that had been feeding effectively unnormalised data into training, and retrained the affected models.',
          'Quantified the gap between balanced-set and runtime performance rather than hiding it, and refused to close it by over-tuning tolerance bands, redirecting instead to the leakage and threshold work that actually fixed it.',
          'Built a data-balancing module with eight configurable strategies and its own evaluation harness, established the resulting performance ceiling empirically, and reported honestly that balancing helps a model reach that ceiling but cannot raise it without better features.',
          'Reported a negative result on causal discovery, where two libraries found no causal links in real telemetry, which saved further investment in the approach.',
          'Built the model-governance layer: timestamped champion audit tags queryable in the registry, one promotion path shared by automated and manual routes, and naming conventions separating experiments from production.',
        ],
      },
      {
        heading: 'Ingestion, monitoring and response',
        bullets: [
          'Drove the migration of anomaly ingestion from a lossy polling architecture of seven or more fetch calls per appliance to a single OIDC-protected push call, removing a documented data-loss failure mode, and cut database operations in the migration script by roughly 23× for large runs.',
          'Shipped a first-class ML-anomaly alert type to production with a backward-compatible migration, and wrote the root-cause analysis and technical decision record that satisfied central engineering’s risk concerns and unblocked architectural approval.',
          'Built a monitoring dashboard covering fleet overview, per-appliance drilldown, threshold optimisation, champion-transition markers and decline alerts, designed toward a thousand-plus models, then consolidated three separate monitoring services into one multipage application, cutting the hosting footprint from three services to one.',
          'Delivered AI-driven GeoIP firewall block and unblock actions end to end across three repositories, verified against a real appliance across 230 country codes, with a findings-plus-inline-actions contract replacing an unusable dropdown panel.',
          'Deployed the first production appliance models, then drove a beta rollout across a customer’s full appliance estate where only a third had usable data, solved with cross-appliance model transfer, and packaged as reusable tooling the team adopted as its standard deployment recipe.',
        ],
      },
    ],
    hardPart: {
      heading: 'The hard part',
      body:
        'Most of the work was not modelling. It was establishing that the data reaching the model was real, that the metrics coming out of it meant what they said, and that an anomaly detected actually arrived somewhere a human would see it. Three of the largest wins on this product were a join, an index and a split: none of them machine learning, all of them the reason the machine learning was worth anything.',
    },
    results: [
      { figure: '95.8%', label: 'appliance-lookup failure rate eliminated; 458 of 478 attempts had been failing silently' },
      { figure: '0.35 → 0.72', label: 'precision roughly doubled after removing leakage and optimising the threshold' },
      { figure: '~23×', label: 'fewer database operations in the ingestion migration script' },
      { figure: '2 → 4', label: 'appliance types covered by unsupervised detection' },
      { figure: '3 → 1', label: 'monitoring services after consolidation, same capability' },
    ],
    stack: [
      { group: 'ML', items: ['scikit-learn', 'XGBoost', 'Isolation Forest', 'SHAP', 'SMOTE', 'Bayesian optimisation'] },
      { group: 'MLOps', items: ['MLflow', 'champion/challenger', 'temporal splitting', 'threshold optimisation', 'drift resistance'] },
      { group: 'AWS', items: ['Lambda', 'Step Functions', 'SQS', 'EventBridge', 'S3', 'OpenSearch', 'ECS', 'CloudWatch Logs Insights'] },
      { group: 'Data & backend', items: ['PySpark', 'pandas', 'PostgreSQL', 'Django REST Framework', 'Streamlit', 'Plotly'] },
    ],
  },

  // =======================================================================
  {
    slug: 'the-no-go',
    scope:
      'Two questions the business needed answered with evidence rather than opinion: what does a query actually cost, and can a cheaper model replace the incumbent without the answers getting worse. The second question is the one people skip.',
    blocks: [
      {
        heading: 'Establishing the baseline',
        bullets: [
          'Established the company’s official cost-per-query baseline over 174 production and 205 development traces, revising a prior estimate downward. It was formally adopted as the figure to plan against.',
          'Rebuilt the analysis tool for a roughly 30× per-trace speedup, replacing recursive API calls that took about thirty seconds per trace and timed out with local parent-child tree traversal under one second, shipped as reusable in-repo tooling with an environment switch.',
          'Produced the post-upgrade baseline across 253 full-pipeline traces, at 13.58M input and 218,882 output tokens, and attributed 91% of the cost to a single node, which is where any optimisation had to aim.',
          'Surfaced a live incident in the process: every query was failing against a deprecated primary model and silently falling back to a secondary provider. Nobody had noticed, because it still answered. Delivered the exact remediation.',
        ],
      },
      {
        heading: 'The bake-offs',
        bullets: [
          'Benchmarked four providers across about nine model variants against the production baseline, measuring one provider’s direct API at roughly 20% lower latency than the same models via a cloud gateway.',
          'Disproved a third-party claim that a competing deployment was three times faster: measured 33.62 against 34.53 tokens per second, no meaningful difference, preventing a migration that would have cost real effort for nothing.',
          'Ran a blinded three-model bake-off measuring cost reductions between 67% and 82%, and delivered a data-backed 56% reduction option to a pricing review with an explicit recommendation attached.',
          'On a separate product, benchmarked a newer model family against its predecessor for code generation and proved the scoring harness itself was unreliable, since a prompt change alone more than halved the score, steering the team away from a base-model swap toward fixing retrieval and building a deterministic harness first.',
        ],
      },
      {
        heading: 'The verdict',
        body:
          'The cheapest credible option cut cost per query by 74.7% on the same traffic. That is the number that gets a proposal approved. So I built the check that could stop it: 83 questions answered by both models, a third model as judge, blinded so it could not tell which answer came from which. The incumbent won 60 of the 83. The challenger won 18. I recommended against the saving, wrote down why, and the recommendation held.',
      },
    ],
    hardPart: {
      heading: 'The hard part',
      body:
        'Cost is easy to measure and quality is not, which is why cost usually wins arguments by default. A blinded judge over paired answers is the cheapest way to put a number on the other side of the trade, but it only means anything if you are willing to publish the result when it goes against the outcome you could have taken credit for.',
    },
    results: [
      { figure: '74.7%', label: 'cost reduction measured on same traffic from the cheaper model' },
      { figure: '60 – 18', label: 'blinded head-to-head over 83 paired questions, incumbent versus challenger' },
      { figure: '~30×', label: 'faster cost analysis per trace, 30s to under 1s' },
      { figure: '91%', label: 'of pipeline cost attributed to a single node' },
      { figure: '33.62 vs 34.53', label: 'tokens per second, the measurement that killed a "3× faster" claim' },
    ],
    stack: [
      { group: 'Evaluation', items: ['LLM-as-judge', 'blinded pairing', 'execution-grounded harnesses', 'bake-off design'] },
      { group: 'Observability', items: ['Langfuse', 'trace-tree traversal', 'token attribution'] },
      { group: 'Providers', items: ['Anthropic', 'OpenAI', 'Google', 'AWS Bedrock'] },
      { group: 'Tooling', items: ['Python', 'reusable in-repo CLI'] },
    ],
    caveat:
      'Absolute cost-per-query figures are deliberately absent from this page. The percentages are the transferable part; the dollar amounts belong to the employer.',
  },

  // =======================================================================
  {
    slug: 'gensym-g2-copilot',
    scope:
      'G2 is Gensym’s proprietary expert-system language. There is effectively no public G2 in any model’s training data, so no model writes it correctly. The project began as local model fine-tuning and became a customer-facing MCP product instead.',
    blocks: [
      {
        heading: 'The pivot',
        body:
          'Fine-tuning a small local model on a language with almost no corpus is expensive and slow to iterate. The alternative was to stop trying to put G2 inside the model and instead give a capable general model the documentation at the moment it writes, through real-time context injection over MCP. I executed that pivot, and it became the shipped product.',
      },
      {
        heading: 'What shipped',
        bullets: [
          'Built the documentation-copilot MCP server on hybrid retrieval, keyword and vector search fused by reciprocal rank fusion over PostgreSQL with pgvector, returning source-cited results across all three official manuals.',
          'Deployed it live and customer-accessible with per-customer API keys stored as HMAC-SHA256 hashes and instant revocation: three manuals, 3,408 pages, 3,511 searchable chunks, 17 tools at launch.',
          'Architected a split-execution local proxy so documentation and search calls go to the hosted server while knowledge-base export runs client-side where G2 is actually installed, hardened for customer Windows machines with port isolation and process cleanup scoped so it can never kill the customer’s live G2 instance. All 25 tools validated end to end.',
          'Rebuilt knowledge-base export as a module-aware two-pass pipeline: every item tagged with its owning module, zero of 34,874 items untagged on the customer regression knowledge base, about a hundred silently vanishing application-layer items recovered, and the merge-edit-save round trip made to work programmatically for the first time.',
          'Diagnosed and fixed six root causes behind zombie processes stranding a port and silently exporting the wrong knowledge base: cross-process file locking, marker-based process reaping and escalating termination, through a six-round automated review cycle.',
          'Built codebase-analysis tools giving agents programmatic control of legacy knowledge bases: a structured exporter validated at 100% element coverage and zero data loss across five knowledge bases, including one of 34,950 elements restructured into 28,713 files across 37 modules.',
        ],
      },
      {
        heading: 'Scoring it honestly',
        body:
          'A generated program that looks plausible is worthless in a language almost nobody can read by eye. So the evaluation framework runs the generated code inside a live Gensym instance and scores whether it executed, across 20 knowledge-base-anchored tasks in six categories, backed by more than 135 tests. That established a 95% baseline before any fine-tuning, and I root-caused the single failing task precisely enough to show it was a genuine model gap rather than a harness artefact. That result is what let the team decide against fine-tuning on evidence.',
      },
      {
        heading: 'The path not taken, kept working',
        bullets: [
          'Built the fine-tune, serve and evaluate automation before the pivot: a single-command orchestrator doing 4-bit QLoRA with both supervised fine-tuning and direct preference optimisation as a config-selectable route, a preference-dataset generator, automatic model packaging and deployment, and all training and evaluation metrics logged.',
          'Packaged the local model into a self-contained offline installer for on-premises installation: containerised model serving, a local embedding model, a vector store and an inference API, with pinned dependencies.',
          'Migrated the inference API off one RAG framework onto another to resolve a vector-store format incompatibility and unify the product with the evaluation stack.',
          'Led the rebrand of the public surface: rebuilt the hosted pages to a proxy-only client model and atomically renamed 15 model-facing tools and 7 environment variables across a Python, TypeScript and container stack, cutting the published package over with a deprecation and migration path.',
        ],
      },
    ],
    hardPart: {
      heading: 'The hard part',
      body:
        'Everything about this problem punishes self-assessment. The language is obscure enough that a wrong answer reads as a right one, and the first scoring harness was unreliable enough that changing the prompt moved the score more than changing the model did. The fix was to stop scoring text and start executing it, the only judge that cannot be talked into a good review.',
    },
    results: [
      { figure: '95%', label: '19 of 20 generated programs executed correctly in a live instance, before fine-tuning' },
      { figure: '0 of 34,874', label: 'knowledge-base items left without a module tag' },
      { figure: '100%', label: 'element coverage with zero data loss across five exported knowledge bases' },
      { figure: '3,511', label: 'searchable chunks over 3,408 pages of official manuals' },
    ],
    stack: [
      { group: 'Retrieval', items: ['BM25', 'pgvector', 'reciprocal rank fusion', 'PostgreSQL', 'FAISS'] },
      { group: 'Serving', items: ['MCP', 'FastAPI', 'TypeScript', 'npm proxy', 'Docker', 'Ollama'] },
      { group: 'Fine-tuning', items: ['Unsloth QLoRA', 'TRL (SFT + DPO)', 'Langfuse datasets'] },
      { group: 'Evaluation', items: ['execution-grounded harness', 'pytest', 'live-instance scoring'] },
    ],
  },

  // =======================================================================
  {
    slug: 'smart-eob',
    scope:
      'SMART EOB reads explanation-of-benefits documents and posts the claims inside them. Posting was manual, and a large share of incoming claims had already been posted, so reviewers spent their time confirming work that was already finished. I was the only engineer on it, from the OCR pipeline through to the admin screens and the production deployment.',
    blocks: [
      {
        heading: 'Reading every document twice',
        bullets: [
          'Ingested the latest EOB documents, converted them to images and prepared them for optical character recognition.',
          'Ran two OCR engines over every document rather than one. PaddleOCR and Tesseract both propose the claim identifier, and the pipeline compares the coordinates of each result and how far the two overlap to confirm they are reading the same line of text.',
          'Treated PaddleOCR as primary. Where it produced a valid claim identifier that identifier was used; where it did not, the pipeline fell back to the Tesseract reading instead of dropping the document.',
          'Reconciled each extracted claim against the records already in the database and updated the ones that matched. Roughly seventy per cent of incoming claims turned out to be posted already, so a reviewer only ever saw the remaining thirty.',
        ],
      },
      {
        heading: 'The pipeline underneath',
        body:
          'Orchestration is what made it fast enough to matter. Five steps run as a RabbitMQ and Celery pipeline built from chains and chords, so independent documents move through in parallel instead of in sequence. Worker counts and worker types were set per step against the hard ceilings of the machine it ran on: how many GPU processes could genuinely run at once, and how many concurrent requests the database would accept. Tuning to those two real limits, rather than to a round number, is what cleared the bottleneck.',
      },
      {
        heading: 'The application around it',
        bullets: [
          'Built the Django web application and the admin interface that operates the pipeline, on Microsoft SQL Server.',
          'Deployed to production on Linux as a service behind Nginx and Gunicorn, with CUDA and cuDNN giving PaddleOCR its GPU acceleration.',
          'Carried roughly 3,500 claims a day in total volume, before the already-posted filter reduced what a person had to look at.',
        ],
      },
      {
        heading: 'What came next',
        body:
          'Later that year the OCR capability stopped being one system’s private asset. I profiled OCR timings and bottlenecks across the different servers it ran on, engineered around what I found, and deployed a standalone OCR API on FastAPI that handles its own parallelism internally, so other internal systems could call it instead of reimplementing it. No throughput figures were recorded for that service, so none are given here.',
      },
    ],
    hardPart: {
      heading: 'The hard part',
      body:
        'Two OCR engines disagreeing is more useful than one engine being confident. A single reader hands you a claim number with no way to know whether it is right, the failure is silent, and a wrongly posted claim is worse than an unposted one. Running both engines and comparing where on the page each found its text turns an unverifiable guess into something checkable, and gives a principled fallback for when the primary reader comes back empty. The speed work was ordinary queue tuning. This is the part that made the output trustworthy enough to act on.',
    },
    results: [
      { figure: '~6×', label: 'faster batch OCR and image processing, down to about 30 minutes' },
      { figure: '~70%', label: 'of claims detected as already posted, leaving about 30% for a reviewer' },
      { figure: 'about a third', label: 'of the original human effort to post the same volume' },
      { figure: '~3,500', label: 'claims a day in total volume through the pipeline' },
    ],
    stack: [
      { group: 'OCR', items: ['PaddleOCR', 'Tesseract', 'coordinate overlap matching', 'CUDA', 'cuDNN'] },
      { group: 'Orchestration', items: ['RabbitMQ', 'Celery chains & chords', 'GPU-bounded worker pools'] },
      { group: 'Application', items: ['Python', 'Django', 'Django admin', 'Microsoft SQL Server'] },
      { group: 'Deployment', items: ['Linux service', 'Nginx', 'Gunicorn', 'FastAPI (OCR service)'] },
    ],
    caveat:
      'Every figure on this page is self-reported. This work predates the evidence trail behind the rest of the site, and the systems are internal, so there is no public artefact and nothing here was independently re-measured. The architecture is described exactly as built; the numbers are mine.',
  },

  // =======================================================================
  {
    slug: 'medlabs',
    scope:
      'Medlabs predicts chronic-disease diagnoses from routine laboratory results, then names the investigation that would confirm each one. It was built on real-world evidence from 593,055 patients across 547 US primary-care centres. I led the data engineering and the modelling: the distributed data work, feature engineering, training and evaluation, the rule-based confirmation layer, clinical validation and deployment.',
    blocks: [
      {
        heading: 'The data',
        bullets: [
          'Lab data at that scale does not fit on one machine, so wrangling, cleaning, filtering and feature extraction ran distributed in PySpark on an on-premises lakehouse.',
          'Set the eligibility criteria: patients with lab tests inside the one-year window before a potential diagnosis, using the first occurrence of that diagnosis as the reference date for training. Patients missing age or demographic information were filtered out, and for patients without a diagnosis the most recent year of labs was used.',
          'Built the feature store the pipeline stands on. Processed data and extracted features were written to MongoDB, which then served both model training and the clinical-validation application.',
          'Used lab values alongside age and gender, because a lab result cannot be interpreted without knowing both.',
        ],
      },
      {
        heading: 'Two systems, not one',
        body:
          'A rule base and a model are usually offered as alternatives. Here they work as a cohort, split by how certain the evidence is. The rule base is clinically validated and covers 59 health conditions: where the labs directly confirm a disease it says so and assigns the ICD-10 codes, with no model involved. The model takes what the rules cannot settle, ranking likely diagnoses across 37 ICD-10 codes grouped into 11 categories by the labs a physician would order to confirm them. SHAP values quantify each feature’s contribution, so a physician sees why an inference was made instead of being asked to trust it.',
      },
      {
        heading: 'Evaluating it the way it gets used',
        body:
          'A single top prediction is the wrong measure here, because the output is not a diagnosis. It is a shortlist, plus the investigation that would confirm it. So evaluation used a top-N criterion: whether the correct diagnosis sits among the N highest-probability ones. Accuracy is 31.2% at rank one and 83.1% by rank five, which is where it clears the eighty-per-cent threshold, and rank five is the operating point because five is still short enough for a physician to work through. At rank five, recall reaches 0.943 for upper-respiratory infection, 0.866 for dyslipidemia and 0.860 for anemia, and the model separates patients with disease from those without at 0.916.',
      },
      {
        heading: 'Published',
        body:
          'The work was presented at an AIME real-world-evidence workshop in July 2024 and published as a first-author paper, "A Hybrid AI and Rule-Based Decision Support System for Disease Diagnosis and Management Using Labs". It is the one thing on this site a stranger can check without taking my word for anything: the cohort size, the rule-base scope and the results tables are all in it. I am the first of five authors, not the only one.',
      },
    ],
    hardPart: {
      heading: 'The hard part',
      body:
        'Class imbalance is the part that looked solved and was not. Rare conditions are exactly the ones a decision-support system exists to catch, and they are exactly the ones a model trained on real prevalence learns to ignore. Balancing by undersampling to the smallest disease group did balance the classes, and it threw away most of the data and made the model worse. Weighting each class by inverse frequency was the obvious replacement, and it overcorrected. What worked was found by experiment rather than derived: taking the square root of those inverse-frequency weights. It lifted sensitivity on the less prevalent conditions without costing overall accuracy, and no amount of reasoning about the problem would have produced it in advance.',
    },
    results: [
      { figure: '83.1%', label: 'top-5 accuracy, the rank at which the shortlist clears the 80% threshold' },
      { figure: '593,055', label: 'patients across 547 US primary-care centres, all real-world evidence' },
      { figure: '59', label: 'clinically validated conditions in the rule base, ICD-10 coded' },
      { figure: '0.916', label: 'recall separating patients with disease from those without, at rank five' },
    ],
    stack: [
      { group: 'Data', items: ['PySpark', 'Apache Spark', 'on-prem lakehouse', 'MongoDB feature store'] },
      { group: 'Modelling', items: ['XGBoost multi-class', 'scikit-learn', 'cross-validated tuning', 'square-root class weighting'] },
      { group: 'Clinical layer', items: ['rule-based expert system', '59 conditions', 'ICD-10 coding'] },
      { group: 'Explainability & serving', items: ['SHAP', 'Flask clinical-validation app'] },
    ],
    caveat:
      'What this page does not claim is a deployed clinical product. The system was clinically validated and served through a validation application, not rolled out as a live service that physicians used in practice. The results quoted are the paper’s own, and the paper reports them in full.',
  },
];

export function caseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}
