import type { StudySection } from "../../study/types";
import type { ReactNode } from "react";
import SectionCard, { type SectionGroup } from "./SectionCard";
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

export interface SectionParts {
  nodes: ReactNode[];
  as?: "div" | "rows" | "ol";
  count: number;
}

/** Picks the item component for a section's `type` and hands it the
 * section's plain data; returns the rendered items. */
export function sectionParts(section: StudySection): SectionParts {
  switch (section.type) {
    case "vocab":
      return { as: "rows", count: section.items.length, nodes: section.items.map((it, i) => <VocabItemCard key={i} item={it} />) };
    case "block":
      return { count: section.items.length, nodes: section.items.map((it, i) => <BlockItemCard key={i} item={it} layout={section.layout} />) };
    case "capitals":
      return {
        count: section.items.length,
        nodes: [
          <Table key="t">
            <TableHeader>
              <TableRow>
                <TableHead>State / UT</TableHead>
                <TableHead>Capital</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{section.items.map((row, i) => <CapitalRowItem key={i} row={row} />)}</TableBody>
          </Table>,
        ],
      };
    case "fib":
      return {
        as: "ol",
        count: section.sets.reduce((n, set) => n + set.items.length, 0),
        nodes: section.sets.flatMap((set, si) => [
          ...(set.note ? [<p key={`n${si}`} className="-ml-5 list-none text-sm text-muted-foreground">{set.note}</p>] : []),
          ...set.items.map((it, i) => <FibItemCard key={`${si}-${i}`} item={it} />),
        ]),
      };
    case "match":
      return { count: section.sets.length, nodes: section.sets.map((set, i) => <MatchSetCard key={i} set={set} />) };
    case "trueFalse":
      return { as: "rows", count: section.items.length, nodes: section.items.map((it, i) => <TrueFalseItemCard key={i} item={it} />) };
    case "name":
      return { as: "rows", count: section.items.length, nodes: section.items.map((it, i) => <NameItemCard key={i} item={it} />) };
    case "mcq":
      return { as: "rows", count: section.items.length, nodes: section.items.map((it, i) => <McqItemCard key={i} item={it} />) };
    case "qa":
      return { as: "rows", count: section.items.length, nodes: section.items.map((it, i) => <QaItemCard key={i} item={it} layout={section.layout} />) };
    case "passage":
      return { as: "rows", count: section.items.length, nodes: section.items.map((it, i) => <PassageItemCard key={i} item={it} />) };
    case "picture":
      return {
        as: "rows",
        count: section.items.length,
        nodes: [
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
        ],
      };
  }
}

/** One section of one chapter. */
export default function SectionView({ section }: { section: StudySection }) {
  const { nodes, as, count } = sectionParts(section);
  return <SectionCard title={section.title} note={section.note} nodes={nodes} as={as} count={count} />;
}

export interface SectionMember {
  label: string;
  /** Tailwind background class for the chapter's colour dot. */
  dot: string;
  section: StudySection;
}

/** Sections of the same kind from several chapters as one card, with each
 * chapter's items under its own small heading. */
export function MergedSectionView({ members }: { members: SectionMember[] }) {
  const groups: SectionGroup[] = members.map((m) => ({ label: m.label, dot: m.dot, nodes: sectionParts(m.section).nodes }));
  const first = sectionParts(members[0].section);
  const count = members.reduce((n, m) => n + sectionParts(m.section).count, 0);
  const notes = members.map((m) => m.section.note).filter(Boolean);
  return <SectionCard title={members[0].section.title} note={notes[0]} groups={groups} as={first.as} count={count} />;
}
