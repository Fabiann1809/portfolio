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

export interface AboutFact {
  label: string;
  value: string;
}

export interface AboutData {
  /** Section label, shown as "// LABEL 000%". */
  label: string;
  statement: StatementWord[];
  timeline: TimelineStep[];
  /** Short facts: location and life outside tech. */
  facts: AboutFact[];
  stackTitle: string;
}
