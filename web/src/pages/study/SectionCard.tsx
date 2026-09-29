import { useState, type ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import styles from "./Study.module.css";

interface SectionCardProps {
  num: number;
  title: string;
  note?: string;
  /** One node per item; only the first `limit` show until "Show more". */
  nodes: ReactNode[];
  /** Wrapper for the nodes: "ol"/"ul" when they are <li>s. */
  as?: "div" | "ol" | "ul";
  limit?: number;
}

/** The shared frame every section type renders inside: numbered title,
 * optional note, and a "Show N more" cut-off for long lists. */
export default function SectionCard({ num, title, note, nodes, as: Wrapper = "div", limit = 4 }: SectionCardProps) {
  const [all, setAll] = useState(false);
  const shown = all ? nodes : nodes.slice(0, limit);
  return (
    <Card size="sm" className="gap-2">
      <CardHeader>
        <CardTitle>
          {String(num).padStart(2, "0")} · {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {note && <p className={styles.answerLine}>{note}</p>}
        <Wrapper>{shown}</Wrapper>
        {nodes.length > limit && (
          <Button variant="ghost" size="xs" className={styles.moreBtn} onClick={() => setAll(!all)}>
            {all ? "Show fewer" : `Show ${nodes.length - limit} more`}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
