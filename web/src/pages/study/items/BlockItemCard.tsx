import type { BlockItem } from "../../../study/types";
import { Badge } from "../../../components/ui/badge";
import SourceMarks from "../SourceMarks";

/** A heading plus lines: a run of chips (words), a numbered list (points to
 * remember) or plain paragraphs (a worked letter, a grammar note). */
export default function BlockItemCard({ item, layout = "text" }: { item: BlockItem; layout?: "text" | "list" | "chips" }) {
  return (
    <div className="flex flex-col gap-2 py-2.5">
      {item.heading && (
        <p className="text-xs font-medium text-muted-foreground">
          {item.heading}
          <SourceMarks sources={item.sources} />
        </p>
      )}
      {layout === "chips" ? (
        <div className="flex flex-wrap gap-1.5">
          {item.lines.map((line, i) => (
            <Badge key={i} variant="secondary" className="h-7 rounded-md px-2.5 text-sm font-normal">
              {line}
            </Badge>
          ))}
        </div>
      ) : layout === "list" ? (
        <ol className="flex list-decimal flex-col gap-1.5 pl-5 text-[15px] leading-relaxed">
          {item.lines.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ol>
      ) : (
        <div className="text-[15px] leading-relaxed whitespace-pre-line">{item.lines.join("\n")}</div>
      )}
    </div>
  );
}
