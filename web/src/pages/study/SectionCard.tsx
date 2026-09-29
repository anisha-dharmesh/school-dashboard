import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

interface SectionCardProps {
  title: string;
  note?: string;
  /** One node per item. */
  nodes: ReactNode[];
  /** Number shown top-right; defaults to the node count. */
  count?: number;
  /** How the nodes are wrapped: plain, divided rows, or a numbered list. */
  as?: "div" | "rows" | "ol";
}

/** The frame every section renders inside: title with an item count and an
 * optional note, then every item. */
export default function SectionCard({ title, note, nodes, count, as = "div" }: SectionCardProps) {
  const body =
    as === "ol" ? (
      <ol className="flex list-decimal flex-col gap-2.5 pl-5 text-[15px] leading-relaxed">{nodes}</ol>
    ) : (
      <div className={as === "rows" ? "flex flex-col divide-y" : "flex flex-col"}>{nodes}</div>
    );
  return (
    <Card className="gap-2">
      <CardHeader className="grid-cols-[1fr_auto] items-center">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        <span className="font-mono text-xs text-muted-foreground">{count ?? nodes.length}</span>
      </CardHeader>
      <CardContent>
        {note && <p className="mb-2 text-sm text-muted-foreground">{note}</p>}
        {body}
      </CardContent>
    </Card>
  );
}
