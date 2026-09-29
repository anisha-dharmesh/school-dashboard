import type { SourceMarks as SourceMarksType } from "../../study/types";

const TAGS = [
  { key: "notes", tag: "N", title: "From her own notebook" },
  { key: "textbook", tag: "T", title: "From the textbook" },
  { key: "worksheet", tag: "W", title: "Also asked in a school worksheet" },
  { key: "revisionSheet", tag: "R", title: "Also asked in a revision sheet" },
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
          className="ml-1 inline-flex h-4 min-w-4 cursor-help items-center justify-center rounded border px-1 align-middle font-mono text-[10px] font-medium text-muted-foreground"
        >
          {t.tag}
        </span>
      ))}
    </>
  );
}
