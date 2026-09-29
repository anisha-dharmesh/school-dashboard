import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

export interface SectionGroup {
  label: string;
  dot: string;
  nodes: ReactNode[];
}

interface SectionCardProps {
  title: string;
  note?: string;
  /** One node per item. */
  nodes?: ReactNode[];
  /** Items grouped under a chapter heading (the combined view). */
  groups?: SectionGroup[];
  /** Number shown top-right. */
  count?: number;
  /** How the nodes are wrapped: plain, divided rows, or a numbered list. */
  as?: "div" | "rows" | "ol";
}

function Wrap({ as, children }: { as: SectionCardProps["as"]; children: ReactNode }) {
  return as === "ol" ? (
    <ol className="flex list-decimal flex-col gap-2.5 pl-5 text-[15px] leading-relaxed">{children}</ol>
  ) : (
    <div className={as === "rows" ? "flex flex-col divide-y" : "flex flex-col"}>{children}</div>
  );
}

/** The frame every section renders inside: title with an item count and an
 * optional note, then every item (under chapter headings when combined). */
export default function SectionCard({ title, note, nodes = [], groups, count, as = "div" }: SectionCardProps) {
  return (
    <Card className="gap-2">
      <CardHeader className="grid-cols-[1fr_auto] items-center">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        <span className="font-mono text-xs text-muted-foreground">{count ?? nodes.length}</span>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {note && <p className="text-sm text-muted-foreground">{note}</p>}
        {groups ? (
          groups.map((g) => (
            <div key={g.label} className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <span className={`size-2 rounded-[2px] ${g.dot}`} />
                {g.label}
              </div>
              <Wrap as={as}>{g.nodes}</Wrap>
            </div>
          ))
        ) : (
          <Wrap as={as}>{nodes}</Wrap>
        )}
      </CardContent>
    </Card>
  );
}
