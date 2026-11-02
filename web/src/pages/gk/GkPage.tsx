import { useState } from "react";
import { Eye } from "lucide-react";
import { GEOGRAPHY, GOVERNMENT, PEOPLE, PLACES, REGIONS } from "../../gk/data";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { FactCard, FactSection } from "./FactGrid";
import IndiaMap from "./IndiaMap";

export default function GkPage() {
  return (
    <Tabs defaultValue="map" className="w-full flex-1">
      <TabsList variant="line">
        <TabsTrigger value="map">India Map</TabsTrigger>
        <TabsTrigger value="people">People</TabsTrigger>
        <TabsTrigger value="places">Places</TabsTrigger>
        <TabsTrigger value="geography">Geography</TabsTrigger>
      </TabsList>

      <TabsContent value="map">
        <MapTab />
      </TabsContent>

      <TabsContent value="people" className="flex flex-col gap-6">
        {PEOPLE.map((g) => (
          <FactSection key={g.title} group={g} />
        ))}
      </TabsContent>

      <TabsContent value="places" className="flex flex-col gap-6">
        {PLACES.map((g) => (
          <FactSection key={g.title} group={g} />
        ))}
      </TabsContent>

      <TabsContent value="geography" className="flex flex-col gap-6">
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">India at a glance</h2>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {GOVERNMENT.map((f) => (
              <FactCard key={f.title} fact={f} />
            ))}
          </div>
        </section>
        {GEOGRAPHY.map((g) => (
          <FactSection key={g.title} group={g} />
        ))}
      </TabsContent>
    </Tabs>
  );
}

function MapTab() {
  const [selected, setSelected] = useState<string | null>(null);
  const [showCapitals, setShowCapitals] = useState(true);
  // Self-test: hide every capital until it's tapped.
  const [quiz, setQuiz] = useState(false);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  const current = REGIONS.find((r) => r.shape === selected);
  const number = current ? REGIONS.indexOf(current) + 1 : 0;
  const shown = (shape: string) => !quiz || revealed.has(shape);
  const reveal = (shape: string) => setRevealed((cur) => new Set(cur).add(shape));
  const choose = (shape: string) => setSelected(shape);

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]">
      <div className="flex flex-col gap-3">
        <Card size="sm">
          <CardContent className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <div className="flex items-center gap-2">
              <Switch id="gk-capitals" checked={showCapitals} onCheckedChange={setShowCapitals} />
              <Label htmlFor="gk-capitals">Show capitals on the map (red dots)</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="gk-quiz"
                checked={quiz}
                onCheckedChange={(on) => {
                  setQuiz(on);
                  setRevealed(new Set());
                }}
              />
              <Label htmlFor="gk-quiz">Test myself: hide the capitals</Label>
            </div>
          </CardContent>
        </Card>

        <div className="min-h-14 rounded-lg border bg-card px-4 py-3 text-sm">
          {current ? (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="text-base font-semibold">
                {number}. {current.name}
              </span>
              <Badge variant="secondary">{current.kind === "ut" ? "Union Territory" : "State"}</Badge>
              <span>
                Capital:{" "}
                {shown(current.shape) ? (
                  <strong>{current.capital}</strong>
                ) : (
                  <Button size="xs" variant="outline" onClick={() => reveal(current.shape)}>
                    <Eye /> Show
                  </Button>
                )}
              </span>
              {shown(current.shape) && current.note && <span className="text-muted-foreground">({current.note})</span>}
            </div>
          ) : (
            <span className="text-muted-foreground">Tap a state on the map, or a name in the list, to see its capital.</span>
          )}
        </div>

        <div className="mx-auto w-full max-w-2xl">
          <IndiaMap selected={selected} onSelect={choose} showCapitals={showCapitals && !quiz} />
        </div>
        <p className="text-xs text-muted-foreground">
          28 States (coloured) and 8 Union Territories (tan). Numbers match the list. Red dots mark the capitals.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {(["state", "ut"] as const).map((kind) => (
          <section key={kind} className="flex flex-col gap-1">
            <h2 className="text-base font-semibold">{kind === "state" ? "28 States and their capitals" : "8 Union Territories and their capitals"}</h2>
            <ul className="divide-y rounded-lg border bg-card text-sm">
              {REGIONS.map((r, i) =>
                r.kind !== kind ? null : (
                  <li key={r.shape}>
                    <button
                      type="button"
                      onClick={() => choose(r.shape)}
                      className={`flex w-full items-baseline gap-2 px-3 py-1.5 text-left hover:bg-muted ${r.shape === selected ? "bg-muted font-medium" : ""}`}
                    >
                      <span className="w-6 shrink-0 text-right tabular-nums text-muted-foreground">{i + 1}</span>
                      <span className="min-w-0 flex-1">{r.name}</span>
                      {shown(r.shape) ? (
                        <span className="text-right font-medium">{r.capital}</span>
                      ) : (
                        <span
                          className="text-right text-muted-foreground underline decoration-dotted"
                          onClick={(e) => (e.stopPropagation(), reveal(r.shape), choose(r.shape))}
                        >
                          tap to show
                        </span>
                      )}
                    </button>
                  </li>
                ),
              )}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
