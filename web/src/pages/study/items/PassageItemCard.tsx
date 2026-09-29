import type { PassageItem } from "../../../study/types";
import SourceMarks from "../SourceMarks";
import QaItemCard from "./QaItemCard";

/** An unseen passage plus the questions asked about it. */
export default function PassageItemCard({ item }: { item: PassageItem }) {
  return (
    <div className="flex flex-col gap-2 py-3">
      <p className="flex items-baseline justify-between gap-2 font-semibold">
        <span>
          {item.title}
          <SourceMarks sources={item.sources} />
        </span>
        {item.date && <span className="font-mono text-xs font-normal text-muted-foreground">{item.date}</span>}
      </p>
      <p className="rounded-lg bg-muted/60 px-3 py-2 text-[15px] leading-relaxed whitespace-pre-line">{item.text}</p>
      <div className="flex flex-col divide-y">
        {item.questions.map((q, i) => (
          <QaItemCard key={i} item={q} />
        ))}
      </div>
    </div>
  );
}
