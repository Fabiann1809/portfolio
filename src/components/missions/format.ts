import { projectLabels } from "@/data/projects";

/** Zero-padded two digit count, e.g. 7 gives "07". */
export const countOf = (n: number) => String(n).padStart(2, "0");

/** Record code of the project at index `i`. */
export const codeOf = (i: number) => `${projectLabels.codePrefix}-${countOf(i + 1)}`;
