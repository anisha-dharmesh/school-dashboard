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
import styles from "./Study.module.css";

/** Renders one section of a chapter: picks the item component for its
 * `type` and hands it the section's plain data. */
export default function SectionView({ num, section }: { num: number; section: StudySection }) {
  const { title, note } = section;
  const frame = { num, title, note };
  switch (section.type) {
    case "vocab":
      return <SectionCard {...frame} nodes={section.items.map((it, i) => <VocabItemCard key={i} item={it} />)} />;
    case "block":
      return <SectionCard {...frame} limit={3} nodes={section.items.map((it, i) => <BlockItemCard key={i} item={it} />)} />;
    case "capitals":
      return (
        <SectionCard
          {...frame}
          limit={6}
          nodes={section.items.map((row, i) => (
            <table key={i} className={styles.table}>
              <tbody>
                <CapitalRowItem row={row} />
              </tbody>
            </table>
          ))}
        />
      );
    case "fib":
      return (
        <SectionCard
          {...frame}
          as="ol"
          nodes={section.sets.flatMap((set, si) => [
            ...(set.note ? [<p key={`n${si}`} className={styles.answerLine}>{set.note}</p>] : []),
            ...set.items.map((it, i) => <FibItemCard key={`${si}-${i}`} item={it} />),
          ])}
          limit={6}
        />
      );
    case "match":
      return <SectionCard {...frame} limit={2} nodes={section.sets.map((set, i) => <MatchSetCard key={i} set={set} />)} />;
    case "trueFalse":
      return <SectionCard {...frame} as="ol" limit={6} nodes={section.items.map((it, i) => <TrueFalseItemCard key={i} item={it} />)} />;
    case "name":
      return <SectionCard {...frame} as="ul" limit={6} nodes={section.items.map((it, i) => <NameItemCard key={i} item={it} />)} />;
    case "mcq":
      return <SectionCard {...frame} nodes={section.items.map((it, i) => <McqItemCard key={i} item={it} />)} />;
    case "qa":
      return <SectionCard {...frame} nodes={section.items.map((it, i) => <QaItemCard key={i} item={it} />)} />;
    case "passage":
      return <SectionCard {...frame} limit={1} nodes={section.items.map((it, i) => <PassageItemCard key={i} item={it} />)} />;
    case "picture":
      return (
        <SectionCard
          {...frame}
          limit={3}
          nodes={[
            ...section.items.map((it, i) => <PictureItemCard key={i} item={it} />),
            ...(section.leaderGrid
              ? [
                  <div key="grid">
                    <h4 className={styles.setLabel}>{section.leaderGrid.label}</h4>
                    <div className={styles.leaderGrid}>
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
