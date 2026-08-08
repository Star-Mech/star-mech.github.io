/**
 * About, credentials and the trajectory.
 *
 * Bounds carried over from the evidence corpus and applied here:
 *  - No computed years-of-experience total anywhere on this site. Dates and
 *    per-area durations only — the reader can do the arithmetic.
 *  - The freelance record is stated as platform-computed counts and the actual
 *    average rating (4.7, not 5.0). Nothing implies a flawless record, and the
 *    MQL5 feedback page is deliberately not linked.
 *  - No invented project counts.
 *  - Education states the field honestly. It is Mechanical, not CS.
 */

/** How he works, each principle attached to the thing that demonstrates it. */
export const principles = [
  {
    title: 'Measure before recommending',
    body:
      'A blinded judge over 83 paired questions is why a 74.7% cost saving got a NO-GO instead of a rubber stamp. A tokens-per-second measurement is why a "three times faster" migration never happened — 33.62 against 34.53 is not a difference.',
    proof: 'the-no-go',
  },
  {
    title: 'Ship the fix with the before and after attached',
    body:
      'A fix without a measurement is a guess that closed a ticket. Every entry in the root-cause file above carries the delta, and where a delta was never measured the card says so rather than borrowing a number from somewhere else.',
    proof: null,
  },
  {
    title: 'File the residual risk instead of burying it',
    body:
      'When per-organisation access enforcement shipped I filed the jailbreak gap it did not close. When a data-balancing module hit a ceiling I reported that it cannot raise the ceiling without better features. When causal discovery found nothing in real telemetry I published the negative result, which saved further investment.',
    proof: 'radar-mlops',
  },
  {
    title: 'Make the metrics honest even when they look worse',
    body:
      'Health logging on the assistant used to report 100% success while tool calls were failing. Separating success from tool errors made the dashboards worse and the engineering possible.',
    proof: 'appmanager-langgraph',
  },
] as const;

export const education = {
  institution: 'National University of Sciences and Technology (NUST)',
  degree: 'BEng, Mechanical Engineering',
  years: '2017 – 2021',
  note:
    'A top-tier Pakistani engineering school, and honestly not a computing degree. The freelance work below overlaps the final undergraduate years, which is exactly what it looks like — I was writing trading bots for clients while finishing the degree.',
} as const;

/** Platform-computed, independently checkable, and not perfect. */
export const freelanceRecord = [
  {
    platform: 'MQL5',
    stat: '41 of 41',
    detail: 'jobs finished — 100% completion — at 4.7★ across 26 client ratings.',
  },
  {
    platform: 'Upwork',
    stat: '12 of 12',
    detail: 'jobs completed, ID-verified. Recurring endorsements for clear communication and solution orientation.',
  },
] as const;

export const githubAccounts = [
  {
    label: 'Personal',
    handle: 'Star-Mech',
    url: 'https://github.com/Star-Mech',
    note: 'Where this site lives, alongside earlier Django and web work.',
  },
  {
    label: 'Day job',
    handle: 'hammad-starmech',
    url: 'https://github.com/hammad-starmech',
    note:
      '1,228 contributions in the last year. The work itself sits in private organisation repositories, so the account shows density rather than repositories — plus the two public artifacts, the OpenRPC MCP fork and a check-in automation server.',
  },
] as const;

export const certifications = [
  { name: 'Functions, Tools and Agents with LangChain', issuer: 'DeepLearning.AI', year: '2024' },
  { name: 'LangChain for LLM Application Development', issuer: 'DeepLearning.AI', year: '2024' },
  { name: 'LangChain: Chat with Your Data', issuer: 'DeepLearning.AI', year: '2024' },
  { name: 'Building and Evaluating Advanced RAG', issuer: 'DeepLearning.AI', year: '2024' },
  { name: 'Generative AI with Large Language Models', issuer: 'DeepLearning.AI', year: '2024' },
  { name: 'How Diffusion Models Work', issuer: 'DeepLearning.AI', year: '2024' },
  { name: 'Create AI Powered Apps with Open Source LangChain', issuer: 'IBM Skills Network', year: '2024' },
  { name: 'ChatGPT Prompt Engineering for Developers', issuer: 'Coursera', year: '2024' },
  { name: 'Generative AI for Everyone', issuer: 'Coursera', year: '2024' },
  { name: 'PyTorch for Deep Learning Bootcamp', issuer: 'Udemy', year: '2024' },
  { name: 'Deep Learning A–Z: Neural Networks, AI & ChatGPT', issuer: 'Udemy', year: '2024' },
  { name: '100 Days of Code: The Complete Python Pro Bootcamp', issuer: 'Udemy', year: '2024' },
  { name: 'Python Mega Course: Build 20 Apps', issuer: 'Udemy', year: '2024' },
  { name: 'Mathematics for Machine Learning and Data Science', issuer: 'Coursera', year: '2023' },
  { name: 'Django for Everybody Specialization', issuer: 'University of Michigan', year: '2023' },
  { name: 'Machine Learning Specialization', issuer: 'University of Washington', year: '2023' },
  { name: 'AI for Medicine', issuer: 'Coursera', year: '2023' },
  { name: 'Machine Learning Specialization', issuer: 'Stanford University', year: '2022' },
] as const;

// ===========================================================================
// Trajectory
// ===========================================================================

export interface TimelineEntry {
  period: string;
  role: string;
  org: string;
  body: string;
  /** Nested projects, for the periods where the projects are the point. */
  projects?: { name: string; detail: string }[];
  tags?: string[];
  current?: boolean;
}

export const timeline: TimelineEntry[] = [
  {
    period: 'Nov 2024 – present',
    role: 'AI / ML Engineer',
    org: 'IgniteTech (GFI Software)',
    body:
      'Individual contributor across four AI products, owning features end to end — the agent pipeline, the MCP integration layer, the anomaly-detection platform, and the code copilot. Everything in the work section above comes from here.',
    tags: ['LangGraph', 'MCP', 'AWS MLOps', 'LLM evaluation'],
    current: true,
  },
  {
    period: 'Oct 2023 – Nov 2024',
    role: 'AI Engineer',
    org: 'CureMD',
    body:
      'Clinical machine learning on real patient data, plus the deployment work to get it in front of clinicians.',
    projects: [
      {
        name: 'Medlabs — chronic-disease prediction',
        detail:
          'Wrangled and feature-engineered laboratory data for 593,055 patients across 547 US primary-care centres into a ~40-feature modelling set using PySpark, with MongoDB as the feature store serving both training and the clinical-validation app. A multi-label gradient-boosting classifier paired with a rule base, where the rules decide definitive cases and the model handles the ambiguous ones. Presented at an AIME real-world-evidence workshop in July 2024, and published as a first-author paper.',
      },
      {
        name: 'OCR microservice',
        detail:
          'Profiled OCR times and bottlenecks across servers, then built and deployed a standalone FastAPI OCR API handling parallelism internally.',
      },
      {
        name: 'Digital Twin — text to image',
        detail:
          'A research proof of concept: fine-tuned Stable Diffusion 2 via LoRA and DreamBooth on NIH X-ray data to generate chest X-rays from radiology reports. Evaluated, not shipped.',
      },
    ],
    tags: ['PySpark', 'MongoDB', 'XGBoost', 'Flask', 'Stable Diffusion'],
  },
  {
    period: 'Apr 2023 – Sep 2023',
    role: 'Associate AI Engineer',
    org: 'CureMD',
    body:
      'Delivered SMART EOB end to end — automating explanation-of-benefits posting at roughly 3,500 claims a day. Batch OCR and image processing about 6× faster, down to around 30 minutes, cutting human posting effort to roughly a third by auto-detecting about 70% of claims as already posted so reviewers only handle the rest. Dual-engine extraction aligning PaddleOCR and Tesseract on the same text line by coordinates, with Paddle primary and Tesseract as fallback. The parallel pipeline underneath it was RabbitMQ and Celery chains and chords, tuned against GPU and database concurrency limits.',
    tags: ['PaddleOCR', 'Tesseract', 'RabbitMQ', 'Celery', 'Django', 'MSSQL', 'CUDA'],
  },
  {
    period: 'Oct 2022 – Apr 2023',
    role: 'Trainee AI Engineer',
    org: 'CureMD',
    body:
      'An intensive foundation — the Stanford ML specialization, AI for Medicine, the mathematics of ML, an applied ML course — alongside hands-on deep learning, multiple OCR engines, and Linux deployment.',
    tags: ['scikit-learn', 'TensorFlow', 'NumPy/Pandas', 'Linux'],
  },
  {
    period: 'Feb 2022 – Apr 2023',
    role: 'Freelance engineer, and learning Python',
    org: 'Upwork',
    body:
      'Kept taking paid client work while teaching myself Python. Two engagements evidence it directly: a Django feature making a collection of forms editable on a single page, which no built-in Django view supports, and the crypto bot below — which overlapped the start at CureMD, so the freelance work did not stop when the job began.',
    projects: [
      {
        name: 'KuCoin trading bot — Python and WebSockets',
        detail:
          'An automated crypto trading bot driven by live exchange streams rather than polled snapshots, built for a client in early 2023. Rated 5.0★, and the feedback records the delivered system as "more robust than I had previously planned."',
      },
    ],
    tags: ['Python', 'WebSockets', 'Django'],
  },
  {
    period: 'Apr 2020 – Jan 2022',
    role: 'MQL trading automater',
    org: 'MetaQuotes · freelance',
    body:
      'Where the programming started. Designing trading strategies and automating them in MQL4 and MQL5 for the MetaTrader platforms — strategy design, decision logic, money management — and presenting solutions to clients directly. It is also where the analytical habit came from: a trading strategy either survives contact with the market or it does not, and no amount of describing it well changes that.',
    tags: ['MQL4', 'MQL5', 'MetaTrader', 'strategy design'],
  },
];
