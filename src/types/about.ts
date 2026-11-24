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

export interface AboutNow {
  id: "building" | "exploring" | "learning";
  title: string;
  detail: string;
}

export interface AboutData {
  /** Section label, shown as "// LABEL 000%". */
  label: string;
  statement: StatementWord[];
  timeline: TimelineStep[];
  /** Body paragraphs shown under the pinned statement. */
  paragraphs: string[];
  stackTitle: string;
  /** Small cards next to the text with facts the paragraphs don't mention. */
  facts: AboutFact[];
  /** "Currently" row: what I'm building, exploring and learning. */
  nowLabel: string;
  now: AboutNow[];
}
