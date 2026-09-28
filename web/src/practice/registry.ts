// The one place that knows which subjects and chapters exist. To add a
// chapter: create its file under content/<subject>/ and list it here.
import type { Chapter, PracticeItem, Subject } from "./types";
import { measurement } from "./content/maths/ch09-measurement";

export const SUBJECTS: Subject[] = [
  {
    id: "maths",
    name: "Maths",
    chapters: [measurement],
  },
];

export function findSubject(id: string): Subject | undefined {
  return SUBJECTS.find((s) => s.id === id);
}

export function findChapter(subject: Subject | undefined, id: string): Chapter | undefined {
  return subject?.chapters.find((c) => c.id === id);
}

/** Every question in the chosen exercises, tagged with where it came from. */
export function collectItems(subject: Subject, chapter: Chapter, exerciseIds: string[]): PracticeItem[] {
  return chapter.exercises
    .filter((e) => exerciseIds.includes(e.id))
    .flatMap((e) =>
      e.questions.map((question) => ({
        uid: `${subject.id}/${chapter.id}/${e.id}/${question.id}`,
        exerciseId: e.id,
        exerciseTitle: e.title,
        question,
      })),
    );
}
