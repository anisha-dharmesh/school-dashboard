import type { StudySection } from "../../study/types";
import SectionCard from "./SectionCard";
import VocabItemCard from "./items/VocabItemCard";
import BlockItemCard from "./items/BlockItemCard";
import CapitalRowItem from "./items/CapitalRowItem";
import FibItemCard from "./items/FibItemCard";
import MatchSetCard from "./items/MatchSetCard";
import TrueFalseItemCard from "./items/TrueFalseItemCard";
import NameItemCard from "./items/NameItemCard";
import McqItemCard from "./items/McqItemCard";
import QaItemCard from "./items/QaItemCard";
import PassageItemCard from "./items/PassageItemCard";
import PictureItemCard from "./items/PictureItemCard";
import LeaderFigureCard from "./items/LeaderFigureCard";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "../../components/ui/table";

/** Renders one section of a chapter: picks the item component for its
 * `type` and hands it the section's plain data. */
export default function SectionView({ section }: { section: StudySection }) {
  const { title, note } = section;
  const frame = { title, note };
  switch (section.type) {
    case "vocab":
      return <SectionCard {...frame} as="rows" nodes={section.items.map((it, i) => <VocabItemCard key={i} item={it} />)} />;
    case "block":
      return <SectionCard {...frame} nodes={section.items.map((it, i) => <BlockItemCard key={i} item={it} layout={section.layout} />)} />;
    case "capitals":
      return (
        <SectionCard
          {...frame}
         
          nodes={[
            <Table key="t">
              <TableHeader>
                <TableRow>
                  <TableHead>State / UT</TableHead>
                  <TableHead>Capital</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>{section.items.map((row, i) => <CapitalRowItem key={i} row={row} />)}</TableBody>
            </Table>,
          ]}
          count={section.items.length}
        />
      );
    case "fib":
      return (
        <SectionCard
          {...frame}
          as="ol"
          nodes={section.sets.flatMap((set, si) => [
            ...(set.note ? [<p key={`n${si}`} className="-ml-5 list-none text-sm text-muted-foreground">{set.note}</p>] : []),
            ...set.items.map((it, i) => <FibItemCard key={`${si}-${i}`} item={it} />),
          ])}
         
          count={section.sets.reduce((n, set) => n + set.items.length, 0)}
        />
      );
    case "match":
      return <SectionCard {...frame} nodes={section.sets.map((set, i) => <MatchSetCard key={i} set={set} />)} />;
    case "trueFalse":
      return <SectionCard {...frame} as="rows" nodes={section.items.map((it, i) => <TrueFalseItemCard key={i} item={it} />)} />;
    case "name":
      return <SectionCard {...frame} as="rows" nodes={section.items.map((it, i) => <NameItemCard key={i} item={it} />)} />;
    case "mcq":
      return <SectionCard {...frame} as="rows" nodes={section.items.map((it, i) => <McqItemCard key={i} item={it} />)} />;
    case "qa":
      return <SectionCard {...frame} as="rows" nodes={section.items.map((it, i) => <QaItemCard key={i} item={it} layout={section.layout} />)} />;
    case "passage":
      return <SectionCard {...frame} as="rows" nodes={section.items.map((it, i) => <PassageItemCard key={i} item={it} />)} />;
    case "picture":
      return (
        <SectionCard
          {...frame}
          as="rows"
         
          nodes={[
            ...section.items.map((it, i) => <PictureItemCard key={i} item={it} />),
            ...(section.leaderGrid
              ? [
                  <div key="grid">
                    <h4 className="text-xs font-medium text-muted-foreground">{section.leaderGrid.label}</h4>
                    <div className="mt-2 grid grid-cols-[repeat(auto-fill,minmax(74px,1fr))] gap-2">
                      {section.leaderGrid.items.map((fig, i) => (
                        <LeaderFigureCard key={i} item={fig} />
                      ))}
                    </div>
                  </div>,
                ]
              : []),
          ]}
        />
      );
  }
}
