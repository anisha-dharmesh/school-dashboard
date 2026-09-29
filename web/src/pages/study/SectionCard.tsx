import { useState, type ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

interface SectionCardProps {
  title: string;
  note?: string;
  /** One node per item; only the first `limit` show until "Show more". */
  nodes: ReactNode[];
  /** Number shown top-right; defaults to the node count. */
  count?: number;
  /** How the nodes are wrapped: plain, divided rows, or a numbered list. */
  as?: "div" | "rows" | "ol";
  limit?: number;
}

/** The frame every section renders inside: title with an item count, an
 * optional note, and a "Show N more" cut-off for long lists. */
export default function SectionCard({ title, note, nodes, count, as = "div", limit = 6 }: SectionCardProps) {
  const [all, setAll] = useState(false);
  const shown = all ? nodes : nodes.slice(0, limit);
  const body =
    as === "ol" ? (
      <ol className="flex list-decimal flex-col gap-2.5 pl-5 text-[15px] leading-relaxed">{shown}</ol>
    ) : (
      <div className={as === "rows" ? "flex flex-col divide-y" : "flex flex-col"}>{shown}</div>
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
        {nodes.length > limit && (
          <Button variant="ghost" size="sm" className="mt-2" onClick={() => setAll(!all)}>
            {all ? "Show fewer" : `Show ${nodes.length - limit} more`}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
