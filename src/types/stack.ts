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
  /** Prefix of the ability codes, e.g. "PWR" gives PWR-01. */
  codePrefix: string;
  activeLabel: string;
  scanLabel: string;
  technologiesLabel: string;
  abilities: Ability[];
}

export interface FooterData {
  text: string;
}
