/**
 * The root-cause file.
 *
 * Same disclosure filter as the case studies: no ticket keys, no PR numbers, no
 * customer or organisation identifiers. Where the evidence does not support a
 * clean measured delta, `delta` says what was actually established instead of
 * inventing a number.
 */

export interface RootCause {
  id: string;
  /** What someone else noticed, in their words rather than mine. */
  symptom: string;
  /** The plausible-but-wrong explanation that had to be ruled out. */
  looked_like: string;
  cause: string;
  fix: string;
  delta: string;
  /** Short tag for the failure class. */
  kind: string;
}

export const rootCauses: RootCause[] = [
  {
    id: 'alb-idle-timeout',
    kind: 'infrastructure',
    symptom:
      'During a live customer trial the assistant would stop mid-answer. The user waited about 92 seconds and got nothing.',
    looked_like:
      'User cancellation. The disconnect signature was identical to someone closing the tab, and that is what the logs implied.',
    cause:
      'The load balancer in front of the service enforced a 60-second idle timeout. A long answer that streamed nothing for 60 seconds looked idle to the load balancer, which closed the connection under a perfectly healthy request.',
    fix:
      'A heartbeat on the streaming channel so the connection is never idle while work is in progress, validated against the live load balancer rather than only locally.',
    delta: '~92s with no answer became 39.16s with a complete answer — 2.4× faster on that path.',
  },
  {
    id: 'inner-join',
    kind: 'data loss',
    symptom:
      'Anomalies were being detected by the model pipeline and never appeared anywhere a human could see them.',
    looked_like:
      'A detection problem, or a transport problem between services. The pipeline reported success at every stage it knew about.',
    cause:
      'An inner join on appliance lookup during ingestion. When the joined row was absent the whole record was dropped rather than flagged — 458 of 478 processing attempts were failing, and the failure was silent by construction.',
    fix:
      'A deterministic left outer join with an explicit null filter, so a missing appliance produces a visible, handled case instead of a vanished anomaly.',
    delta: 'A 95.8% failure rate eliminated.',
  },
  {
    id: 'missing-index',
    kind: 'performance',
    symptom:
      'The write API was returning gateway timeouts — 3,670 of them across a month.',
    looked_like:
      'Capacity. The obvious read is that the service is undersized and needs more of it.',
    cause:
      'Missing database indexes. One search endpoint accounted for 99.2% of the failures over a ten-day window, and it was doing unindexed work that grew with the table.',
    fix:
      'Scoped a composite index on the two columns every one of those queries filtered by, and had it applied.',
    delta: 'Requests fell to roughly 2–3 seconds and the endpoint returned to 100% success. No extra capacity purchased.',
  },
  {
    id: 'token-overflow',
    kind: 'context engineering',
    symptom:
      'Log analysis for denial-of-service anomalies failed outright on the biggest and most interesting cases.',
    looked_like:
      'A model limitation — the prompt is too big, so use a bigger-context model or truncate and accept the loss.',
    cause:
      'A 216,479-token prompt against a 200,000-token limit, almost entirely near-identical log lines sent verbatim. The information content was a tiny fraction of the payload.',
    fix:
      'Structural deduplication before the prompt: collapse near-identical entries into groups with counts, preserving what the model needs to reason about and discarding the repetition.',
    delta:
      '11,699 filtered entries became 32 groups — roughly 99% reduction, 216,479 tokens down to about 2,000 — validated across six controlled cases.',
  },
  {
    id: 'ddos-no-actions',
    kind: 'silent no-op',
    symptom:
      'Confirmed denial-of-service attacks were generating zero recommended firewall actions. The feature appeared to work; it just never fired.',
    looked_like:
      'A tuning problem — thresholds too conservative, so raise the sensitivity.',
    cause:
      'Nothing was being tracked to act on. Across 1,137 historical records, not one had any attacker IP captured, so there was never anything for the action generator to reference.',
    fix: 'Fixed the extraction so attacker addresses are captured and carried through to action generation.',
    delta:
      'A subsequent SYN flood correctly flagged the attacking address at 18,453 connection attempts — 356× baseline — and generated a priority-one block. Baseline had been 0 of 1,137.',
  },
  {
    id: 'leaked-splits',
    kind: 'evaluation integrity',
    symptom: 'Evaluation metrics were strong. Suspiciously strong.',
    looked_like: 'A good model. Which is the most expensive thing to be wrong about.',
    cause:
      'Random train/test splitting on time-series data. 300 of 3,300 evaluation points were data the model had trained on, so it was being scored partly on memory.',
    fix:
      'Re-architected the splits to be temporal, so evaluation always happens on the future relative to training — then optimised the decision threshold on the now-honest numbers.',
    delta: 'Precision roughly doubled, 0.35 to 0.72, at minimal recall cost (1.0 to 0.967).',
  },
  {
    id: 'shap-sign',
    kind: 'explainability',
    symptom:
      'The generated insights named features that were not what made the record anomalous.',
    looked_like: 'Prompt quality — the explanation text reads badly, so rewrite the prompt.',
    cause:
      'A sign-attribution error in how feature-importance values were consumed. Features pushing toward normal and features pushing toward anomalous were being treated alike, so the explanation could confidently cite the wrong driver.',
    fix: 'Corrected the attribution so direction is preserved and only anomaly-driving features are cited.',
    delta:
      'Attribution is now directionally correct. No before/after accuracy figure was measured, so none is claimed.',
  },
  {
    id: 'case-mismatch',
    kind: 'integration',
    symptom: 'Triage notifications were mostly not arriving — 47 of 50 missing.',
    looked_like: 'A delivery or subscription problem in the notification service.',
    cause:
      'A metric name differed only in capitalisation between the producing and consuming systems. The transform matched exactly, so almost everything fell through.',
    fix: 'Aligned the naming across the boundary after tracing it through log-query forensics.',
    delta: '47 of 50 missing notifications explained and resolved by a case fix.',
  },
];
