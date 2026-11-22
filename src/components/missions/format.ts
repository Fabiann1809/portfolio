/** Zero-padded two digit count, e.g. 7 gives "07". */
export const countOf = (n: number) => String(n).padStart(2, "0");

/** Record code (prefix from the project labels) of the project at index `i`. */
export const codeOf = (prefix: string, i: number) => `${prefix}-${countOf(i + 1)}`;
