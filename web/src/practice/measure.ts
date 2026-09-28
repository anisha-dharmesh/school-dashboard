// Metric-measure helpers: a quantity like "3 km 528 m" is a [big, small]
// pair. The builders below derive both the answer and the worked solution
// from the same numbers, so a question's solution can never disagree with
// its answer.
import type { Question } from "./types";

export interface UnitSystem {
  big: string;
  small: string;
  /** How many of the small unit make one of the big unit. */
  ratio: number;
}

export type Measure = [big: number, small: number];

export const KM_M: UnitSystem = { big: "km", small: "m", ratio: 1000 };
export const M_CM: UnitSystem = { big: "m", small: "cm", ratio: 100 };
export const KG_G: UnitSystem = { big: "kg", small: "g", ratio: 1000 };
export const L_ML: UnitSystem = { big: "l", small: "ml", ratio: 1000 };

/** "3 km 528 m"; a zero part is dropped ("7 km"), and 0 0 reads "0 m". */
export function fmt(sys: UnitSystem, [big, small]: Measure): string {
  const parts: string[] = [];
  if (big > 0) parts.push(`${big} ${sys.big}`);
  if (small > 0) parts.push(`${small} ${sys.small}`);
  return parts.length ? parts.join(" ") : `0 ${sys.small}`;
}

const total = (sys: UnitSystem, [big, small]: Measure) => big * sys.ratio + small;
const split = (sys: UnitSystem, t: number): Measure => [Math.floor(t / sys.ratio), t % sys.ratio];

// ---- "New numbers" support -------------------------------------------------
//
// A regenerated question must feel like the same question, not a different
// one: same number of digits in each place ("11 m 9 cm" stays two numbers,
// one 2-digit and one 1-digit), zero stays zero (a part the textbook left
// out doesn't suddenly appear), and a subtraction never goes negative.

/**
 * A random number near `n` -- not any number with the same digit count, but
 * one drawn from a window around `n` itself (e.g. 32 might become 49; it
 * won't become an unrelated 91), still clamped so the digit count can't
 * change. The window is a quarter of that digit count's full span, which is
 * generous enough to vary the question but keeps the new number recognizably
 * "that question's number, moved a bit" rather than a fresh draw.
 */
function randomLike(n: number): number {
  if (n === 0) return 0;
  const digits = String(n).length;
  const min = 10 ** (digits - 1);
  const max = 10 ** digits - 1;
  const spread = Math.max(1, Math.round((max - min) / 4));
  const lo = Math.max(min, n - spread);
  const hi = Math.min(max, n + spread);
  let result = lo + Math.floor(Math.random() * (hi - lo + 1));
  if (result === n && hi > lo) result = result === hi ? result - 1 : result + 1;
  return result;
}

const randomMeasureLike = ([big, small]: Measure): Measure => [randomLike(big), randomLike(small)];

const parts = (sys: UnitSystem, [big, small]: Measure) => [
  { unit: sys.big, value: big },
  { unit: sys.small, value: small },
];

// ---- Solvers: each returns the worked steps, in the textbook's style ------

function convertUp(sys: UnitSystem, m: Measure): string[] {
  const t = total(sys, m);
  const head = `1 ${sys.big} = ${sys.ratio} ${sys.small}`;
  if (m[1] === 0) return [head, `${m[0]} ${sys.big} = ${m[0]} × ${sys.ratio} ${sys.small} = ${t} ${sys.small}`];
  return [
    head,
    `${fmt(sys, m)} = ${m[0]} × ${sys.ratio} ${sys.small} + ${m[1]} ${sys.small}`,
    `= ${m[0] * sys.ratio} ${sys.small} + ${m[1]} ${sys.small} = ${t} ${sys.small}`,
  ];
}

function convertDown(sys: UnitSystem, t: number): string[] {
  const [big, rem] = split(sys, t);
  const head = `${sys.ratio} ${sys.small} = 1 ${sys.big}`;
  if (rem === 0) return [head, `${t} ${sys.small} = ${big} × ${sys.ratio} ${sys.small} = ${big} ${sys.big}`];
  return [
    head,
    `${t} ${sys.small} = ${big * sys.ratio} ${sys.small} + ${rem} ${sys.small}`,
    `= ${big} × ${sys.ratio} ${sys.small} + ${rem} ${sys.small}`,
    `= ${big} ${sys.big} + ${rem} ${sys.small} = ${fmt(sys, [big, rem])}`,
  ];
}

function addSteps(sys: UnitSystem, terms: Measure[]): { result: Measure; steps: string[] } {
  const smallSum = terms.reduce((s, t) => s + t[1], 0);
  const carry = Math.floor(smallSum / sys.ratio);
  const rem = smallSum % sys.ratio;
  const bigSum = terms.reduce((s, t) => s + t[0], 0) + carry;
  const result: Measure = [bigSum, rem];

  const steps = [`Add the ${sys.small}: ${terms.map((t) => t[1]).join(" + ")} = ${smallSum} ${sys.small}`];
  if (carry > 0) {
    steps.push(`${smallSum} ${sys.small} = ${carry} ${sys.big} + ${rem} ${sys.small}`);
    steps.push(`Write ${rem} under the ${sys.small} column and carry ${carry} to the ${sys.big} column.`);
  } else {
    steps.push(`Write ${rem} under the ${sys.small} column.`);
  }
  const bigTerms = [...(carry > 0 ? [carry] : []), ...terms.map((t) => t[0])];
  steps.push(`Add the ${sys.big}: ${bigTerms.join(" + ")} = ${bigSum} ${sys.big}`);
  steps.push(`${terms.map((t) => fmt(sys, t)).join(" + ")} = ${fmt(sys, result)}`);
  return { result, steps };
}

function subSteps(sys: UnitSystem, a: Measure, b: Measure): { result: Measure; steps: string[] } {
  if (total(sys, a) < total(sys, b)) throw new Error(`subSteps: ${fmt(sys, a)} is less than ${fmt(sys, b)}`);
  const borrow = a[1] < b[1];
  const aBig = borrow ? a[0] - 1 : a[0];
  const aSmall = borrow ? a[1] + sys.ratio : a[1];
  const result: Measure = [aBig - b[0], aSmall - b[1]];

  const steps: string[] = [];
  if (borrow) {
    steps.push(`Since ${a[1]} < ${b[1]}, borrow 1 ${sys.big} (= ${sys.ratio} ${sys.small}) from ${a[0]} ${sys.big}, leaving ${aBig} ${sys.big}.`);
    steps.push(`${sys.ratio} ${sys.small} + ${a[1]} ${sys.small} = ${aSmall} ${sys.small}`);
    steps.push(`${aSmall} ${sys.small} − ${b[1]} ${sys.small} = ${result[1]} ${sys.small}`);
  } else {
    steps.push(`Subtract the ${sys.small}: ${a[1]} − ${b[1]} = ${result[1]} ${sys.small}`);
  }
  steps.push(`Subtract the ${sys.big}: ${aBig} − ${b[0]} = ${result[0]} ${sys.big}`);
  steps.push(`${fmt(sys, a)} − ${fmt(sys, b)} = ${fmt(sys, result)}`);
  return { result, steps };
}

export { addSteps, subSteps };

// ---- Question builders ----------------------------------------------------

/** Bigger unit to smaller: "Convert into cm: 6 m 8 cm". */
export function toSmall(id: string, sys: UnitSystem, m: Measure): Question {
  return {
    id,
    instruction: `Convert into ${sys.small}`,
    prompt: fmt(sys, m),
    answer: { kind: "parts", parts: [{ unit: sys.small, value: total(sys, m) }] },
    solution: convertUp(sys, m),
    regenerate: () => toSmall(id, sys, randomMeasureLike(m)),
  };
}

/** Smaller unit to bigger: "Convert into m: 1925 cm" (answer is m and cm). */
export function toBig(id: string, sys: UnitSystem, t: number): Question {
  return {
    id,
    instruction: `Convert into ${sys.big}`,
    prompt: `${t} ${sys.small}`,
    answer: { kind: "parts", parts: parts(sys, split(sys, t)) },
    solution: convertDown(sys, t),
    regenerate: () => toBig(id, sys, randomLike(t)),
  };
}

interface ArithOptions {
  /** The question text. Defaults to the bare expression, e.g. "4 km 210 m + 2 km 215 m". */
  prompt?: string;
  /** Shown above the prompt. Defaults to "Add" / "Subtract" for bare expressions. */
  instruction?: string;
  /** Named result for word problems: "Total weight" -> "Total weight = 3 kg + 1 kg". */
  label?: string;
  /** Extra worked lines before the column method, for multi-step problems. */
  lead?: string[];
}

export function add(id: string, sys: UnitSystem, terms: Measure[], opts: ArithOptions = {}): Question {
  const { result, steps } = addSteps(sys, terms);
  const expr = terms.map((t) => fmt(sys, t)).join(" + ");
  const question: Question = {
    id,
    instruction: opts.instruction ?? (opts.prompt ? undefined : "Add"),
    prompt: opts.prompt ?? expr,
    answer: { kind: "parts", parts: parts(sys, result) },
    solution: [...(opts.lead ?? []), ...(opts.label ? [`${opts.label} = ${expr}`] : []), ...steps],
  };
  // A custom prompt is a fixed sentence built around these exact numbers
  // ("Charu travelled 5 km 580 m...") -- regenerating the numbers would
  // leave it saying something it no longer means, so only the bare
  // "a + b" style question (no opts.prompt) gets new numbers.
  if (!opts.prompt) question.regenerate = () => add(id, sys, terms.map(randomMeasureLike), opts);
  return question;
}

export function sub(id: string, sys: UnitSystem, a: Measure, b: Measure, opts: ArithOptions = {}): Question {
  const { result, steps } = subSteps(sys, a, b);
  const expr = `${fmt(sys, a)} − ${fmt(sys, b)}`;
  const question: Question = {
    id,
    instruction: opts.instruction ?? (opts.prompt ? undefined : "Subtract"),
    prompt: opts.prompt ?? expr,
    answer: { kind: "parts", parts: parts(sys, result) },
    solution: [...(opts.lead ?? []), ...(opts.label ? [`${opts.label} = ${expr}`] : []), ...steps],
  };
  if (!opts.prompt) {
    question.regenerate = () => {
      // Reroll first, up to a point -- a and b often have differently
      // shaped patterns (e.g. a 2-digit g against a 3-digit g), and simply
      // swapping the moment a2 < b2 would swap those shapes too. Only fall
      // back to a swap (rare, and just as correct) if rerolling doesn't
      // turn up a fit.
      let a2: Measure, b2: Measure;
      let tries = 0;
      do {
        a2 = randomMeasureLike(a);
        b2 = randomMeasureLike(b);
      } while (total(sys, a2) < total(sys, b2) && ++tries < 30);
      if (total(sys, a2) < total(sys, b2)) [a2, b2] = [b2, a2];
      return sub(id, sys, a2, b2, opts);
    };
  }
  return question;
}

/** A hand-written numeric question, for anything the builders above don't cover. */
export function numeric(id: string, prompt: string, unit: string, value: number, solution: string[], instruction?: string): Question {
  return { id, instruction, prompt, answer: { kind: "parts", parts: [{ unit, value }] }, solution };
}

/** Same as numeric but the answer is a full measure, e.g. "5 kg 300 g". */
export function measure(id: string, prompt: string, sys: UnitSystem, m: Measure, solution: string[], instruction?: string): Question {
  return { id, instruction, prompt, answer: { kind: "parts", parts: parts(sys, m) }, solution };
}

export function choice(id: string, prompt: string, options: string[], correct: number, solution: string[], instruction?: string): Question {
  return { id, instruction, prompt, answer: { kind: "choice", options, correct }, solution };
}
