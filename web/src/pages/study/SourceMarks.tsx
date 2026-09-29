import type { SourceMarks as SourceMarksType } from "../../study/types";
import styles from "./Study.module.css";

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
        <span key={t.key} className={styles.srcTag} title={t.title}>
          {t.tag}
        </span>
      ))}
    </>
  );
}
