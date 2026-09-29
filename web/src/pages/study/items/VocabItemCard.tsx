import type { VocabItem } from "../../../study/types";
import SourceMarks from "../SourceMarks";

/** One word, its meaning and (where the source gave one) an example sentence. */
export default function VocabItemCard({ item }: { item: VocabItem }) {
  return (
    <div className="flex flex-col gap-0.5 py-2.5">
      <p className="font-semibold text-blue-600 dark:text-blue-400">
        {item.word}
        <SourceMarks sources={item.sources} />
      </p>
      <p className="text-[15px] leading-relaxed">{item.meaning}</p>
      {item.example && <p className="text-sm text-muted-foreground italic">{item.example}</p>}
    </div>
  );
}
