import type { StatementWord } from "@/types";

export interface StatementToken {
  text: string;
  emphasis: boolean;
}

/** Splits the statement fragments into word tokens; punctuation glued to a word stays with it. */
export function tokenizeStatement(statement: StatementWord[]): StatementToken[] {
  const tokens: StatementToken[] = [];
  let open = false;
  for (const segment of statement) {
    for (const chunk of segment.text.split(/(\s+)/)) {
      if (!chunk) continue;
      if (/^\s+$/.test(chunk)) {
        open = false;
        continue;
      }
      if (open) {
        const last = tokens[tokens.length - 1];
        last.text += chunk;
        last.emphasis = last.emphasis || Boolean(segment.emphasis);
      } else {
        tokens.push({ text: chunk, emphasis: Boolean(segment.emphasis) });
      }
      open = true;
    }
  }
  return tokens;
}
