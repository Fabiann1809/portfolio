export interface StackItem {
  name: string;
  icon: string;
}

export interface Ability {
  id: string;
  name: string;
  description: string;
  /** Names of items in data/stack.ts (frameworks and libraries only). */
  technologies: string[];
}

export interface ExtraData {
  /** Section label, shown as "// LABEL". */
  label: string;
  technologiesLabel: string;
  /** Wheel accessibility labels and counter separator. */
  wheelAria: string;
  select: string;
  previous: string;
  next: string;
  counterSeparator: string;
  abilities: Ability[];
}

export interface FooterData {
  text: string;
}
