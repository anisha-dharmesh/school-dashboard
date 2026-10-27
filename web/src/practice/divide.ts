// Division helpers: the quotient, remainder and worked long-division steps all
// come from the same two numbers, so a solution can never disagree with its
// answer. Same idea as measure.ts.
import { randomLike } from "./measure";
import type { Question } from "./types";

/** Long-division steps in the textbook's order: take digits, divide, subtract, bring down. */
export function divisionSteps(n: number, d: number): string[] {
  const digits = String(n).split("").map(Number);
  const quotient = Math.floor(n / d);
  const remainder = n % d;
  const steps: string[] = [];

  if (n < d) {
    steps.push(`${n} is less than ${d}, so ${d} goes into ${n} 0 times.`);
  } else {
    let taken = 1;
    let current = digits[0];
    while (current < d) current = current * 10 + digits[taken++];
    if (taken > 1) {
      steps.push(`${digits[0]} is less than ${d}, so take the first ${taken} digits together: ${current}.`);
    } else {
      steps.push(`${current} is at least ${d}, so start with ${current}.`);
    }
    const divideStep = (cur: number) => {
      const q = Math.floor(cur / d);
      steps.push(`${d} × ${q} = ${d * q}. Write ${q} in the quotient. Subtract: ${cur} − ${d * q} = ${cur - d * q}.`);
      return cur - d * q;
    };
    let rem = divideStep(current);
    for (; taken < digits.length; taken++) {
      current = rem * 10 + digits[taken];
      steps.push(`Bring down ${digits[taken]}. The new dividend is ${current}.`);
      if (current < d) {
        steps.push(`${d} is more than ${current}, so write 0 in the quotient. ${current} is left over.`);
        rem = current;
      } else {
        rem = divideStep(current);
      }
    }
  }
  steps.push(`${n} ÷ ${d}: quotient = ${quotient}, remainder = ${remainder}.`);
  steps.push(`Check: ${d} × ${quotient} + ${remainder} = ${d * quotient + remainder}`);
  return steps;
}

const digitCount = (n: number) => String(n).length;

/** A divisor of the same size: any 2-9 for a single digit, a nearby number otherwise. */
function randomDivisor(d: number): number {
  if (d === 10) return 10;
  if (d < 10) {
    let next = d;
    while (next === d) next = 2 + Math.floor(Math.random() * 8);
    return next;
  }
  return randomLike(d);
}

/** New numbers shaped like the originals: same digit counts, and still exact (or still not exact). */
function similarPair(n: number, d: number): [number, number] {
  const exact = n % d === 0;
  for (let tries = 0; tries < 60; tries++) {
    const d2 = randomDivisor(d);
    let n2: number;
    if (exact) {
      n2 = d2 * Math.max(1, randomLike(n / d));
      if (n2 === 0 || digitCount(n2) !== digitCount(n)) continue;
    } else {
      n2 = randomLike(n);
      if (n2 % d2 === 0 || n2 < d2) continue;
    }
    if (n2 !== n || d2 !== d) return [n2, d2];
  }
  return [n, d];
}

interface DivideOptions {
  instruction?: string;
  /** Ask only for the quotient (an exact division, or a "write the quotient" exercise). */
  quotientOnly?: boolean;
}

const QUOTIENT = { unit: "quotient" };
const REMAINDER = { unit: "remainder" };

/** "Divide 276 by 2": quotient and remainder (or just the quotient). */
export function divide(id: string, n: number, d: number, opts: DivideOptions = {}): Question {
  const quotient = Math.floor(n / d);
  const remainder = n % d;
  return {
    id,
    instruction: opts.instruction ?? (opts.quotientOnly ? "Divide and write the quotient" : "Divide and find the quotient and remainder"),
    prompt: `${n} ÷ ${d}`,
    answer: opts.quotientOnly
      ? { kind: "parts", parts: [{ ...QUOTIENT, value: quotient }] }
      : { kind: "parts", parts: [{ ...QUOTIENT, value: quotient }, { ...REMAINDER, value: remainder }], labelled: true },
    solution: divisionSteps(n, d),
    regenerate: () => {
      const [n2, d2] = similarPair(n, d);
      return divide(id, n2, d2, opts);
    },
  };
}

/** Dividing by 10 without working it out: the ones digit is the remainder, the rest the quotient. */
export function divideByTen(id: string, n: number): Question {
  const quotient = Math.floor(n / 10);
  const remainder = n % 10;
  return {
    id,
    instruction: "Write the quotient and remainder without actually dividing",
    prompt: `${n} ÷ 10`,
    answer: { kind: "parts", parts: [{ ...QUOTIENT, value: quotient }, { ...REMAINDER, value: remainder }], labelled: true },
    solution: [
      "When a number is divided by 10, the ones digit is the remainder and the remaining digits are the quotient.",
      `${n}: the ones digit is ${remainder} and the rest is ${quotient}.`,
      `Quotient = ${quotient}, remainder = ${remainder}.`,
    ],
    regenerate: () => {
      let n2 = n;
      while (n2 === n) n2 = n % 10 === 0 ? randomLike(n / 10) * 10 : randomLike(n);
      return divideByTen(id, n2);
    },
  };
}

/** A worded problem with one numeric answer (fixed sentence, so no `regenerate`). */
export function wordDivide(id: string, prompt: string, n: number, d: number, unit: string, label: string): Question {
  return {
    id,
    prompt,
    answer: { kind: "parts", parts: [{ unit, value: Math.floor(n / d) }] },
    solution: [`${label} = ${n} ÷ ${d}`, ...divisionSteps(n, d)],
  };
}

/** A worded problem that wants both quotient and remainder, with its own words for each. */
export function wordDivideWithRemainder(id: string, prompt: string, n: number, d: number, quotientUnit: string, remainderUnit: string): Question {
  return {
    id,
    prompt,
    answer: {
      kind: "parts",
      parts: [{ unit: quotientUnit, value: Math.floor(n / d) }, { unit: remainderUnit, value: n % d }],
      labelled: true,
    },
    solution: [`${n} ÷ ${d}`, ...divisionSteps(n, d)],
  };
}
