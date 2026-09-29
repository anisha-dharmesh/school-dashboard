import { BookOpen } from "lucide-react";
import { Button } from "../ui/button";

/** A hand-authored revision notebook (Q&A practice page) for a subject's
 * exam cycle -- optional per portion-schedule row, so most cards never
 * render it. Shared by the Exam tab's subject cards and the Upcoming tab's
 * exam cards, so the link never silently disappears from just one of them. */
export default function RevisionNotebookLink({ url, label = "Revision Notebook (Q&A practice)" }: { url: string | null | undefined; label?: string }) {
  if (!url) return null;
  return (
    <Button
      size="xs"
      className="self-start"
      nativeButton={false}
      render={<a href={`${import.meta.env.BASE_URL}${url}`} target="_blank" rel="noopener noreferrer" />}
    >
      <BookOpen />
      {label}
    </Button>
  );
}
