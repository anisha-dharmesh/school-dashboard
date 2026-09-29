import type { StudyIndex } from "../study/types";

/** /study/<subject>[?test=<label>] -- undefined when the subject has no
 * study chapters (or none labelled with `test`). */
export function subjectStudyPath(index: StudyIndex, subject: string | null | undefined, test?: string | null): string | undefined {
  const s = index.subjects.find((x) => x.subject === subject);
  if (!s) return undefined;
  if (!test) return `/study/${s.slug}`;
  return s.chapters.some((c) => c.tests.includes(test)) ? `/study/${s.slug}?test=${encodeURIComponent(test)}` : undefined;
}

/** /study/<subject>/<chapter> for a chapter matched by subject + title. */
export function chapterStudyPath(index: StudyIndex, subject: string | null | undefined, chapter: string | null | undefined): string | undefined {
  const s = index.subjects.find((x) => x.subject === subject);
  const c = s?.chapters.find((x) => x.title.toLowerCase() === chapter?.toLowerCase());
  return s && c ? `/study/${s.slug}/${c.slug}` : undefined;
}
