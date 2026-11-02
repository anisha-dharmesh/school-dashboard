import type { Fact, FactGroup } from "../../gk/data";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

export function FactCard({ fact }: { fact: Fact }) {
  return (
    <Card size="sm" className="gap-2">
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {fact.title}
          {fact.tag && <Badge variant="secondary">{fact.tag}</Badge>}
        </CardTitle>
      </CardHeader>
      {fact.lines.length > 0 && (
        <CardContent>
          <ul className="flex flex-col gap-1 text-sm">
            {fact.lines.map((line) => (
              <li key={line} className="flex gap-2">
                <span aria-hidden className="text-muted-foreground">
                  •
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      )}
    </Card>
  );
}

export function FactSection({ group }: { group: FactGroup }) {
  return (
    <section className="flex flex-col gap-3">
      <div>
        <h2 className="text-lg font-semibold">{group.title}</h2>
        {group.blurb && <p className="text-sm text-muted-foreground">{group.blurb}</p>}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {group.facts.map((f) => (
          <FactCard key={f.title} fact={f} />
        ))}
      </div>
    </section>
  );
}
