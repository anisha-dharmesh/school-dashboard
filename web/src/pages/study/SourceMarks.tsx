import type { SourceMarks as SourceMarksType } from "../../study/types";

// Each source gets its own colour so the tags stand out from the text.
const TAGS = [
  { key: "notes", tag: "N", title: "From her own notebook", cls: "bg-blue-500/15 text-blue-700 border-blue-500/30 dark:text-blue-300" },
  { key: "textbook", tag: "T", title: "From the textbook", cls: "bg-violet-500/15 text-violet-700 border-violet-500/30 dark:text-violet-300" },
  { key: "worksheet", tag: "W", title: "Also asked in a school worksheet", cls: "bg-amber-500/20 text-amber-800 border-amber-500/40 dark:text-amber-300" },
  { key: "revisionSheet", tag: "R", title: "Also asked in a revision sheet", cls: "bg-rose-500/15 text-rose-700 border-rose-500/30 dark:text-rose-300" },
] as const;

/** Small N / T / W / R tags showing where an item came from. */
export default function SourceMarks({ sources }: { sources?: SourceMarksType }) {
  if (!sources) return null;
  return (
    <>
      {TAGS.filter((t) => sources[t.key]).map((t) => (
        <span
          key={t.key}
          title={t.title}
          className={`ml-1 inline-flex h-4 min-w-4 cursor-help items-center justify-center rounded border px-1 align-middle font-mono text-[10px] font-semibold ${t.cls}`}
        >
          {t.tag}
        </span>
      ))}
    </>
  );
}
