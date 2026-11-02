import { useState } from "react";
import type { Fact, FactGroup } from "../../gk/data";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

// Photo cards show only the picture; tapping turns the card over to the details.
function FlipCard({ fact }: { fact: Fact }) {
  const [flipped, setFlipped] = useState(false);
  const src = `${import.meta.env.BASE_URL}leaders/${fact.photo}`;
  const face = "absolute inset-0 overflow-hidden rounded-xl [backface-visibility:hidden]";
  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      aria-pressed={flipped}
      aria-label={`${fact.title}. Tap to ${flipped ? "show the photo" : "see the details"}`}
      className="relative mx-auto aspect-[3/4] w-full max-w-xs cursor-pointer text-left [perspective:1000px] outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
    >
      <div className={`relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] ${flipped ? "[transform:rotateY(180deg)]" : ""}`}>
        <div className={`${face} bg-muted ring-1 ring-foreground/10`}>
          {/* A blurred copy fills the space around the photo so the whole picture shows. */}
          <img src={src} alt="" aria-hidden className="absolute inset-0 h-full w-full scale-125 object-cover blur-xl brightness-75" />
          <img src={src} alt={fact.title} loading="lazy" className="relative h-full w-full object-contain" />
        </div>
        <div className={`${face} flex flex-col gap-2 bg-card p-4 text-sm ring-1 ring-foreground/10 [transform:rotateY(180deg)]`}>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-base font-medium">
            {fact.title}
            {fact.tag && <Badge variant="secondary">{fact.tag}</Badge>}
          </div>
          <ul className="flex flex-col gap-1 overflow-auto">
            {fact.lines.map((line) => (
              <li key={line} className="flex gap-2">
                <span aria-hidden className="text-muted-foreground">
                  •
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </button>
  );
}

export function FactCard({ fact }: { fact: Fact }) {
  if (fact.photo) return <FlipCard fact={fact} />;
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
