// The practice content model. Content is plain data: to add a chapter, write
// a file under content/<subject>/ that exports a Chapter and list it in
// registry.ts -- nothing in the UI or the session engine needs to change.

/** One box the student types into, e.g. the "km" part of "3 km 528 m". */
export interface AnswerPart {
  unit: string;
  value: number;
}

export type Answer =
  // One numeric input per part. A blank part counts as 0, so "7 km" is
  // accepted for "7 km 0 m".
  | { kind: "parts"; parts: AnswerPart[] }
  // Pick one option (matching, multiple choice).
  | { kind: "choice"; options: string[]; correct: number };

export interface Question {
  /** Stable within its exercise. Never renumber: history refers to it. */
  id: string;
  /** What to do, shown small above the prompt, e.g. "Convert into cm". */
  instruction?: string;
  prompt: string;
  answer: Answer;
  /** Worked solution, one step per line. Shown when the answer is wrong. */
  solution: string[];
  /**
   * Produces a fresh instance of this question with new numbers of the same
   * digit-length as the originals (and, for subtraction, the bigger one
   * first so the result is never negative). Only set for questions built
   * purely from numbers -- a conversion or a bare "a + b" -- never for a
   * worded problem, where the numbers are woven into a fixed sentence.
   */
  regenerate?: () => Question;
}

export interface Exercise {
  id: string;
  title: string;
  description?: string;
  /** Textbook page, for reference. */
  page?: number;
  questions: Question[];
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  /** Where the chapter comes from, e.g. "Mathematics-3". */
  source?: string;
  exercises: Exercise[];
}

export interface Subject {
  id: string;
  name: string;
  chapters: Chapter[];
}

/** A question together with where it came from -- what a session draws from. */
export interface PracticeItem {
  uid: string;
  exerciseId: string;
  exerciseTitle: string;
  question: Question;
}

/** A question as it was answered, snapshotted so history survives content edits. */
export interface PracticeResult {
  uid: string;
  exerciseTitle: string;
  instruction?: string;
  prompt: string;
  given: string;
  correct: string;
  ok: boolean;
  solution: string[];
}

export interface PracticeSession {
  id: string;
  startedAt: string;
  endedAt: string;
  subjectName: string;
  chapterTitle: string;
  exerciseTitles: string[];
  results: PracticeResult[];
}
