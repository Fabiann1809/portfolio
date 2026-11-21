/** A fragment of the origin statement; emphasis words charge with the accent color. */
export interface StatementWord {
  text: string;
  emphasis?: boolean;
}

export interface TimelineStep {
  id: string;
  /** Place or stage name. */
  place: string;
  period: string;
}

export interface AboutData {
  /** Section label, shown as "// LABEL 000%". */
  label: string;
  statement: StatementWord[];
  timeline: TimelineStep[];
  /** Body paragraphs shown under the pinned statement. */
  paragraphs: string[];
  stackTitle: string;
}
