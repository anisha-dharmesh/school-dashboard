// Session mechanics that don't depend on the UI: drawing questions, checking
// an answer, and turning answers into readable text.
import type { Answer, PracticeItem, PracticeResult, Question } from "./types";

/** Uniform random order, so a session isn't the textbook order every time. */
export function shuffled<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** A random selection of `count` questions (0 = all of them), no repeats. */
function pick(items: PracticeItem[], count: number): PracticeItem[] {
  const all = shuffled(items);
  return count > 0 ? all.slice(0, count) : all;
}

/**
 * The chosen questions, ready for a session. In "random" mode, every
 * question that supports it (see `Question.regenerate`) gets fresh numbers;
 * a worded problem has no `regenerate` and comes through unchanged either way.
 */
export function drawQueue(items: PracticeItem[], count: number, numbers: "textbook" | "random" = "textbook"): PracticeItem[] {
  const picked = pick(items, count);
  if (numbers === "textbook") return picked;
  return picked.map((item) => (item.question.regenerate ? { ...item, question: item.question.regenerate() } : item));
}

/** How many of these questions can actually get new numbers -- for the setup screen's helper text. */
export function countRegenerable(items: PracticeItem[]): number {
  return items.filter((i) => i.question.regenerate).length;
}

/**
 * The student's raw input: one string per box for a numeric answer, or the
 * chosen option's index (as a string) for a choice.
 */
export type Response = string[];

export function hasResponse(response: Response): boolean {
  return response.some((r) => r.trim() !== "");
}

export function isCorrect(answer: Answer, response: Response): boolean {
  if (answer.kind === "choice") return Number(response[0]) === answer.correct;
  return answer.parts.every((part, i) => Number(response[i]?.trim() || "0") === part.value);
}

function joinParts(parts: { unit: string; value: number }[]): string {
  const shown = parts.filter((p) => p.value > 0);
  const use = shown.length ? shown : parts.slice(-1).map((p) => ({ ...p, value: 0 }));
  return use.map((p) => `${p.value} ${p.unit}`).join(" ");
}

export function formatCorrect(answer: Answer): string {
  return answer.kind === "choice" ? answer.options[answer.correct] : joinParts(answer.parts);
}

export function formatResponse(answer: Answer, response: Response): string {
  if (answer.kind === "choice") return answer.options[Number(response[0])] ?? "";
  return joinParts(answer.parts.map((part, i) => ({ unit: part.unit, value: Number(response[i]?.trim() || "0") })));
}

export function toResult(item: PracticeItem, response: Response): PracticeResult {
  const { question } = item;
  return {
    uid: item.uid,
    exerciseTitle: item.exerciseTitle,
    instruction: question.instruction,
    prompt: question.prompt,
    given: formatResponse(question.answer, response),
    correct: formatCorrect(question.answer),
    ok: isCorrect(question.answer, response),
    solution: question.solution,
  };
}

export const emptyResponse = (q: Question): Response => (q.answer.kind === "choice" ? [""] : q.answer.parts.map(() => ""));
