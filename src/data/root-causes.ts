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
    delta: '~92s with no answer became 39.16s with a complete answer, 2.4× faster on that path.',
  },
  {
    id: 'inner-join',
    kind: 'data loss',
    symptom:
      'Anomalies were being detected by the model pipeline and never appeared anywhere a human could see them.',
    looked_like:
      'A detection problem, or a transport problem between services. The pipeline reported success at every stage it knew about.',
    cause:
      'During ingestion each anomaly was matched to the appliance it came from, using a database join that keeps a record only where the match succeeds. When the appliance was missing, the join discarded the entire anomaly rather than flagging it. 458 of 478 processing attempts were failing this way, and by construction not one of them left a trace.',
    fix:
      'Switched to a join that keeps the anomaly even when no appliance matches, with an explicit check for the empty value, so a missing appliance now produces a visible, handled case instead of a vanished anomaly.',
    delta: 'A 95.8% failure rate eliminated.',
  },
  {
    id: 'missing-index',
    kind: 'performance',
    symptom:
      'The service that records detected anomalies and answers searches over them kept timing out. 3,670 failed requests across a month.',
    looked_like:
      'Capacity. The obvious read is that the service is undersized and needs more of it.',
    cause:
      'Missing database indexes. A single endpoint, the one that searches stored anomalies, accounted for 99.2% of the failures over a ten-day window. With no index to work from, every search read the whole table, so it got slower as the table grew.',
    fix:
      'Scoped an index covering the two columns every one of those searches filtered on, the appliance and the timestamp, and had it applied.',
    delta: 'Requests fell to roughly 2–3 seconds and the endpoint returned to 100% success. No extra capacity purchased.',
  },
  {
    id: 'token-overflow',
    kind: 'context engineering',
    symptom:
      'Log analysis for denial-of-service anomalies failed outright on the biggest and most interesting cases.',
    looked_like:
      'A model limitation: the prompt is too big, so move to a bigger-context model, or truncate it and accept the loss.',
    cause:
      'A 216,479-token prompt against a 200,000-token limit, almost entirely near-identical log lines sent verbatim. The information content was a tiny fraction of the payload.',
    fix:
      'Structural deduplication before the prompt: collapse near-identical entries into groups with counts, preserving what the model needs to reason about and discarding the repetition.',
    delta:
      '11,699 filtered entries became 32 groups, roughly a 99% reduction, taking 216,479 tokens down to about 2,000. Validated across six controlled cases.',
  },
  {
    id: 'ddos-no-actions',
    kind: 'feature never fired',
    symptom:
      'Confirmed denial-of-service attacks were generating zero recommended firewall actions. The feature appeared to work; it just never fired.',
    looked_like:
      'A tuning problem: thresholds set too conservatively, so raise the sensitivity.',
    cause:
      'There was nothing recorded to act on. Across 1,137 historical records, not one had captured the address of the attacker, so the part that recommends a block had never had anything to point at.',
    fix: 'Fixed the extraction so attacker addresses are captured and carried through to action generation.',
    delta:
      'A later flood attack correctly flagged the attacking address at 18,453 connection attempts, 356× the normal rate, and generated a priority-one block. The baseline had been 0 of 1,137.',
  },
  {
    id: 'leaked-splits',
    kind: 'evaluation integrity',
    symptom: 'Evaluation metrics were strong. Suspiciously strong.',
    looked_like: 'A good model. Which is the most expensive thing to be wrong about.',
    cause:
      'The test set was drawn at random from data that arrives in time order. 300 of the 3,300 evaluation points were records the model had already trained on, so it was being scored partly on memory.',
    fix:
      'Re-architected the splits so evaluation always happens on data from after the training period, then optimised the decision threshold against the now-honest numbers.',
    delta:
      'Of the anomalies it flagged, the share that were real roughly doubled, 0.35 to 0.72, while the share of real anomalies it caught barely moved, 1.0 to 0.967.',
  },
  {
    id: 'shap-sign',
    kind: 'explainability',
    symptom:
      'The written explanations named the wrong reasons, citing measurements that were not what made the record unusual.',
    looked_like: 'Prompt quality. The explanation text reads badly, so rewrite the prompt.',
    cause:
      'Every measurement carries two things: how strongly it influenced the verdict, and which way it pushed, toward normal or toward anomalous. The code read the strength and ignored the direction. A measurement arguing forcefully that the record was normal could therefore be cited as the reason it had been flagged.',
    fix: 'Corrected the attribution so direction is preserved, and only the measurements genuinely pushing toward anomalous are cited.',
    delta:
      'Attribution is now directionally correct. No before/after accuracy figure was measured, so none is claimed.',
  },
  {
    id: 'case-mismatch',
    kind: 'integration',
    symptom: 'Triage notifications were mostly not arriving. 47 of 50 went missing.',
    looked_like: 'A delivery or subscription problem in the notification service.',
    cause:
      'A metric name differed only in capitalisation between the producing and consuming systems. The transform matched exactly, so almost everything fell through.',
    fix: 'Aligned the naming across the boundary after tracing it through log-query forensics.',
    delta: '47 of 50 missing notifications explained and resolved by a case fix.',
  },
];
