// Grammar practice: multiple-choice questions assembled from small, curated
// word banks. Every question is built by a generator that picks fresh words
// each time (via `Question.regenerate`), but only ever from the bank -- so the
// level stays fixed at what a Class 3 child has been taught, and every answer
// is correct by construction.
import { shuffled } from "./session";
import type { Question } from "./types";

export type Pair = readonly [string, string];

export const pick = <T>(items: readonly T[]): T => items[Math.floor(Math.random() * items.length)];

/** `n` distinct items in random order, skipping anything in `not`. */
export function pickN<T>(items: readonly T[], n: number, not: readonly T[] = []): T[] {
  return shuffled(items.filter((x) => !not.includes(x))).slice(0, n);
}

export interface Draft {
  instruction?: string;
  prompt: string;
  correct: string;
  /** Wrong options; the order is shuffled together with `correct`. */
  wrong?: readonly string[];
  /** A fixed option order (including `correct`), for a set like a / an / the. */
  options?: readonly string[];
  solution: string[];
}

/** A multiple-choice question that rebuilds itself from `draft` on every regenerate. */
export function mcq(id: string, draft: () => Draft): Question {
  const make = (): Question => {
    const d = draft();
    const options = d.options ? [...d.options] : shuffled([d.correct, ...new Set((d.wrong ?? []).filter((w) => w !== d.correct))]);
    return {
      id,
      instruction: d.instruction,
      prompt: d.prompt,
      answer: { kind: "choice", options, correct: options.indexOf(d.correct) },
      solution: d.solution,
      regenerate: make,
    };
  };
  return make();
}

/** `count` independent generator slots, so one exercise can supply a whole session. */
export const slots = (count: number, make: (id: string) => Question): Question[] => Array.from({ length: count }, (_, i) => make(`q${i + 1}`));

/** Sort a word into one of a few labels, e.g. common / proper noun. */
export function sortQuiz(
  id: string,
  bank: Record<string, readonly string[]>,
  o: { instruction: string; ask: (word: string) => string; why: (word: string, label: string) => string[] },
): Question {
  const labels = Object.keys(bank);
  return mcq(id, () => {
    const label = pick(labels);
    const word = pick(bank[label]);
    return { instruction: o.instruction, prompt: o.ask(word), correct: label, options: labels, solution: o.why(word, label) };
  });
}

/** Given one word of a pair, pick its partner (male/female, opposite, ...). */
export function pairQuiz(
  id: string,
  pairs: readonly Pair[],
  o: { instruction: string; ask: (from: string, side: 0 | 1) => string; why: (a: string, b: string, side: 0 | 1) => string[]; oneWay?: boolean },
): Question {
  return mcq(id, () => {
    const p = pick(pairs);
    const side = o.oneWay ? 0 : pick([0, 1] as const);
    const from = p[side];
    const to = p[side === 0 ? 1 : 0];
    const wrong = pickN(pairs.map((q) => q[side === 0 ? 1 : 0]), 2, [to, from]);
    return { instruction: o.instruction, prompt: o.ask(from, side), correct: to, wrong, solution: o.why(from, to, side) };
  });
}

/** Singular -> plural. The wrong options are the singular itself and another word's plural. */
export function pluralQuiz(
  id: string,
  pairs: readonly Pair[],
  o: { instruction: string; ask: (singular: string) => string; why: (singular: string, plural: string) => string[] },
): Question {
  return mcq(id, () => {
    const p = pick(pairs);
    const last = p[1].slice(-1);
    const others = pairs.filter((q) => q !== p && q[1] !== p[1]);
    const alike = others.filter((q) => q[1].slice(-1) === last);
    const other = pick(alike.length ? alike : others);
    return { instruction: o.instruction, prompt: o.ask(p[0]), correct: p[1], wrong: [p[0], other[1]], solution: o.why(p[0], p[1]) };
  });
}

/** Pick the one word that belongs to a different group from the other three. */
export function oddQuiz(
  id: string,
  bank: Record<string, readonly string[]>,
  o: { instruction: string; ask: string; why: (odd: string, oddLabel: string, label: string) => string[] },
): Question {
  const labels = Object.keys(bank);
  return mcq(id, () => {
    const label = pick(labels);
    const oddLabel = pick(labels.filter((l) => l !== label));
    const odd = pick(bank[oddLabel]);
    return { instruction: o.instruction, prompt: o.ask, correct: odd, wrong: pickN(bank[label], 3), solution: o.why(odd, oddLabel, label) };
  });
}

/**
 * Pick a word out of a sentence. Each row is [sentence, a, b, c]: the sentence
 * followed by the three words offered, of which `which` (1-3) is the answer.
 */
export function findQuiz(
  id: string,
  rows: readonly (readonly string[])[],
  o: { instruction: string; which: number; why: (row: readonly string[]) => string[] },
): Question {
  return mcq(id, () => {
    const row = pick(rows);
    return { instruction: o.instruction, prompt: row[0], correct: row[o.which], wrong: row.slice(1), solution: o.why(row) };
  });
}

/** Complete a sentence. Each item is [sentence with ___, answer, wrong options]. */
export function fillQuiz(
  id: string,
  items: readonly (readonly [string, string, readonly string[]])[],
  o: { instruction: string; why: (prompt: string, answer: string) => string[] },
): Question {
  return mcq(id, () => {
    const [prompt, answer, wrong] = pick(items);
    return { instruction: o.instruction, prompt, correct: answer, wrong, solution: o.why(prompt, answer) };
  });
}
