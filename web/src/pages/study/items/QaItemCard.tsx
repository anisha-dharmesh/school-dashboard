import type { QaItem } from "../../../study/types";
import { resolveImage } from "../../../study/resolveImage";
import SourceMarks from "../SourceMarks";

/** A question and its answer as plain text; a list answer renders as bullets.
 * In the "terms" layout (Define) it is a term with its meaning beside it. */
export default function QaItemCard({ item, layout }: { item: QaItem; layout?: "terms" }) {
  const answer = Array.isArray(item.answer) ? (
    <ul className="flex list-disc flex-col gap-1 pl-5">
      {item.answer.map((line, i) => (
        <li key={i}>{line}</li>
      ))}
    </ul>
  ) : (
    <p>{item.answer}</p>
  );

  if (layout === "terms") {
    return (
      <div className="flex gap-3 py-3">
        <div className="w-20 shrink-0 font-semibold text-blue-600 dark:text-blue-400">
          {item.question}
          <SourceMarks sources={item.sources} />
        </div>
        <div className="text-[15px] leading-relaxed">{answer}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 py-3">
      {item.image && <img className="max-h-56 max-w-full self-start rounded-lg" src={resolveImage(item.image)} alt="" />}
      <p className="text-[15px] leading-snug font-medium">
        {item.question}
        <SourceMarks sources={item.sources} />
      </p>
      <div className="rounded-lg bg-muted/60 px-3 py-2 text-[15px] leading-relaxed">{answer}</div>
    </div>
  );
}
