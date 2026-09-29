import type { NameItem } from "../../../study/types";
import { ANSWER_TEXT } from "../answer";
import SourceMarks from "../SourceMarks";

export default function NameItemCard({ item }: { item: NameItem }) {
  return (
    <div className="flex flex-col items-start gap-1 py-2.5">
      <p className="text-sm text-muted-foreground">
        {item.prompt}
        <SourceMarks sources={item.sources} />
      </p>
      <span className={`${ANSWER_TEXT} text-[15px]`}>{item.answer}</span>
    </div>
  );
}
