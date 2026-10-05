import type { Notice, PortionSchedules } from "../types";
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

/** A notice that only says "Chapter 1" (no name) is scraped with `chapter: "1"`.
 * Put the real name back from the Study index: the chapter with that number in
 * the term the notice was posted in -- Term 2 starts once the Half Yearly
 * schedule's last exam is over. Left as-is when nothing matches. */
export function nameBareChapters(notices: Notice[], index: StudyIndex, schedules: PortionSchedules): Notice[] {
  const halfYearlyEnd = schedules["Half Yearly"]?.schedule.reduce((max, r) => (r.date_iso > max ? r.date_iso : max), "");
  if (!halfYearlyEnd) return notices;
  return notices.map((n) => {
    if (!n.subject || !n.chapter || !/^\d+$/.test(n.chapter.trim())) return n;
    const term = n.posted_date_iso > halfYearlyEnd ? "Term 2" : "Term 1";
    const number = n.chapter_number ?? Number(n.chapter);
    const match = index.subjects.find((x) => x.subject === n.subject)?.chapters.find((c) => c.term === term && c.number === number);
    return match ? { ...n, chapter: match.title } : n;
  });
}
