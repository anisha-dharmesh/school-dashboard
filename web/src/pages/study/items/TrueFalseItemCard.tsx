import type { TrueFalseItem } from "../../../study/types";
import { ANSWER_FALSE, ANSWER_TRUE } from "../answer";
import SourceMarks from "../SourceMarks";

export default function TrueFalseItemCard({ item }: { item: TrueFalseItem }) {
  return (
    <div className="flex flex-col gap-1 py-3">
      <div className="flex items-start justify-between gap-3 md:justify-start">
        <span className="text-[15px] leading-snug">
          {item.statement}
          <SourceMarks sources={item.sources} />
        </span>
        <span className={item.answer ? ANSWER_TRUE : ANSWER_FALSE}>{item.answer ? "True" : "False"}</span>
      </div>
      {item.explanation && <p className={`${HIDE_EXPLANATION} text-sm text-muted-foreground`}>{item.explanation}</p>}
    </div>
  );
}

const HIDE_EXPLANATION = "group-data-[hide=true]/study:invisible";
