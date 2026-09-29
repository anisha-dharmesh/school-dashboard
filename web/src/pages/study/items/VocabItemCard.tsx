import type { VocabItem } from "../../../study/types";
import SourceMarks from "../SourceMarks";

/** One word, its meaning and (where the source gave one) an example sentence. */
export default function VocabItemCard({ item }: { item: VocabItem }) {
  return (
    <div className="flex flex-col gap-0.5 py-2.5 md:flex-row md:flex-wrap md:items-baseline md:gap-x-5">
      <p className="font-semibold whitespace-nowrap md:w-48 md:shrink-0">
        {item.word}
        <SourceMarks sources={item.sources} />
      </p>
      <p className="text-[15px] leading-relaxed">{item.meaning}</p>
      {item.example && <p className="text-sm text-muted-foreground italic">{item.example}</p>}
    </div>
  );
}
