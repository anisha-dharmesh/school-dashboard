// Study content: one JSON file per chapter (docs/study/<subject>/<chapter>.json).
// Every string is plain text -- no markdown. Where a picture goes, the item
// has an explicit `image` field; where an answer is a list, it is a string[].

export interface SourceMarks {
  /** Copied out in her own notebook. */
  notes?: boolean;
  /** A printed textbook / workbook exercise page. */
  textbook?: boolean;
  /** A loose school worksheet. */
  worksheet?: boolean;
  /** A "Revision-N" homework handout. */
  revisionSheet?: boolean;
}

export interface FibItem {
  /** The sentence with each blank's position marked by "___". */
  template: string;
  /** One answer per "___" in `template`, in order. */
  answers: string[];
  sources?: SourceMarks;
}
export interface FibSet {
  note?: string;
  items: FibItem[];
}

export interface MatchPair {
  left: string;
  right: string;
  /** Raw inline SVG markup, for a left column that is an icon (road signs). */
  leftSvg?: string;
}
export interface MatchSet {
  label?: string;
  sources?: SourceMarks;
  columns: [string, string];
  pairs: MatchPair[];
  /** "1–c, 2–e, ..." */
  answerLine?: string;
}

export interface TrueFalseItem {
  statement: string;
  answer: boolean;
  /** The correction shown after a False answer. */
  explanation?: string;
  sources?: SourceMarks;
}

export interface NameItem {
  prompt: string;
  answer: string;
  sources?: SourceMarks;
}

export interface QaItem {
  question: string;
  /** A picture the question refers to (path under public/ or a full URL). */
  image?: string;
  /** Absent when the question is a stem (e.g. a quoted passage) with `parts` below. */
  answer?: string | string[];
  /** Sub-questions of a stem question, each with its own answer, e.g. "(a) Who is meant here?". */
  parts?: { question: string; answer: string | string[] }[];
  sources?: SourceMarks;
}

export interface CapitalRow {
  state: string;
  capital: string;
  sources?: SourceMarks;
}

export interface McqItem {
  question: string;
  /** One already-formatted string, e.g. "(a) ... (b) ... (c) ...". */
  options: string;
  answer: string;
  sources?: SourceMarks;
}

export interface PictureItem {
  image: string;
  caption: string;
  sources?: SourceMarks;
}
export interface LeaderGridItem {
  image: string;
  caption: string;
}

export interface VocabItem {
  word: string;
  meaning: string;
  example?: string;
  sources?: SourceMarks;
}

/** A heading plus ordered lines (points to remember, grammar notes, a worked letter). */
export interface BlockItem {
  heading?: string;
  lines: string[];
  sources?: SourceMarks;
}

export interface PassageItem {
  title: string;
  text: string;
  date?: string;
  questions: QaItem[];
  sources?: SourceMarks;
}

interface SectionBase {
  title: string;
  note?: string;
}
export type StudySection =
  | (SectionBase & { type: "vocab"; items: VocabItem[] })
  | (SectionBase & { type: "block"; layout?: "text" | "list" | "chips"; items: BlockItem[] })
  | (SectionBase & { type: "capitals"; items: CapitalRow[] })
  | (SectionBase & { type: "fib"; sets: FibSet[] })
  | (SectionBase & { type: "match"; sets: MatchSet[] })
  | (SectionBase & { type: "trueFalse"; items: TrueFalseItem[] })
  | (SectionBase & { type: "name"; items: NameItem[] })
  | (SectionBase & { type: "mcq"; items: McqItem[] })
  | (SectionBase & { type: "qa"; layout?: "terms"; items: QaItem[] })
  | (SectionBase & { type: "passage"; items: PassageItem[] })
  | (SectionBase & { type: "picture"; items: PictureItem[]; leaderGrid?: { label: string; items: LeaderGridItem[] } });

export type SectionType = StudySection["type"];

export interface StudyChapter {
  subject: string;
  chapter: string;
  number?: number | null;
  /** Exams this chapter is part of, e.g. "Half Yearly", "PT-1", "Class Test". Optional labels only. */
  tests: string[];
  sections: StudySection[];
}

export interface StudyChapterEntry {
  slug: string;
  title: string;
  number?: number | null;
  tests: string[];
}
export interface StudySubjectEntry {
  subject: string;
  slug: string;
  chapters: StudyChapterEntry[];
}
export interface StudyIndex {
  subjects: StudySubjectEntry[];
}
