import type { MatchPair, MatchSet } from "../../../study/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { HIDE } from "../answer";
import SourceMarks from "../SourceMarks";

// One colour per pair, applied to the whole cell. With answers hidden the
// colour goes away (the group-data-[hide] classes).
const NEUTRAL =
  "group-data-[hide=true]/study:border-transparent group-data-[hide=true]/study:bg-transparent group-data-[hide=true]/study:text-foreground";
const PAIR_COLORS = [
  "border-blue-500/40 bg-blue-500/15 text-blue-800 dark:text-blue-200",
  "border-amber-500/40 bg-amber-500/15 text-amber-800 dark:text-amber-200",
  "border-emerald-500/40 bg-emerald-500/15 text-emerald-800 dark:text-emerald-200",
  "border-purple-500/40 bg-purple-500/15 text-purple-800 dark:text-purple-200",
  "border-rose-500/40 bg-rose-500/15 text-rose-800 dark:text-rose-200",
  "border-cyan-500/40 bg-cyan-500/15 text-cyan-800 dark:text-cyan-200",
  "border-orange-500/40 bg-orange-500/15 text-orange-800 dark:text-orange-200",
  "border-lime-500/40 bg-lime-500/15 text-lime-800 dark:text-lime-200",
];

// "1. Nagaland" / "(c) Kohima" / "(ii) How ..." -> label + text.
function splitLabel(text: string): { label?: string; text: string } {
  const m = text.match(/^\(?([A-Za-z0-9]{1,4})[).]\s+(.*)$/s);
  return m ? { label: m[1].toLowerCase(), text: m[2] } : { text };
}

// The data lists each pair on its own row (so the answers are right there).
// To make an exercise of it, the right column is re-ordered: by its own
// letters when it has them, otherwise a fixed shuffle that is never the
// original order.
function displayOrder(count: number, lettered: boolean, labels: (string | undefined)[]): number[] {
  const idx = Array.from({ length: count }, (_, i) => i);
  if (lettered) return idx.sort((a, b) => labels[a]!.localeCompare(labels[b]!));
  if (count < 2) return idx;
  if (count === 2) return [1, 0];
  const shuffled = idx.map((_, i) => (count - 1 - i + Math.floor(count / 2)) % count);
  return shuffled.every((v, i) => v === i) ? idx.reverse() : shuffled;
}

/** One side of a pair: its number/letter and its text, coloured as a whole. */
function Cell({ pair, label, children }: { pair: number; label: string; children: React.ReactNode }) {
  return (
    <div
      className={`flex items-baseline gap-2 rounded-lg border px-2.5 py-1.5 transition-colors ${PAIR_COLORS[pair % PAIR_COLORS.length]} ${NEUTRAL}`}
    >
      <span className="min-w-4 shrink-0 font-mono text-xs font-semibold opacity-80">{label}</span>
      <span>{children}</span>
    </div>
  );
}

function leftCell(pair: MatchPair, text: string) {
  return pair.leftSvg ? <span dangerouslySetInnerHTML={{ __html: pair.leftSvg }} /> : text;
}

/** A match-the-following table. Left items stay in order; the right items
 * are re-ordered. With answers shown, both cells of a pair share a colour;
 * with answers hidden there is no colour. */
export default function MatchSetCard({ set }: { set: MatchSet }) {
  const lefts = set.pairs.map((p) => splitLabel(p.left));
  const rights = set.pairs.map((p) => splitLabel(p.right));
  const lettered = rights.every((r) => r.label);
  const order = displayOrder(set.pairs.length, lettered, rights.map((r) => r.label));

  return (
    <div className="flex flex-col gap-2 py-2">
      {set.label && (
        <h4 className="text-xs font-medium text-muted-foreground">
          {set.label}
          <SourceMarks sources={set.sources} />
        </h4>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{set.columns[0]}</TableHead>
            <TableHead>{set.columns[1]}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {order.map((pairAtRight, row) => {
            const right = rights[pairAtRight];
            return (
              <TableRow key={row}>
                <TableCell className="align-top whitespace-normal">
                  <Cell pair={row} label={lefts[row].label ?? String(row + 1)}>
                    {leftCell(set.pairs[row], lefts[row].text)}
                  </Cell>
                </TableCell>
                <TableCell className="align-top whitespace-normal">
                  <Cell pair={pairAtRight} label={right.label ?? String.fromCharCode(97 + row)}>
                    {right.text}
                  </Cell>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {set.answerLine && (
        <p className="text-sm">
          <span className="text-muted-foreground">Answer: </span>
          <span className={`${HIDE} rounded px-1 font-medium`}>{set.answerLine}</span>
        </p>
      )}
    </div>
  );
}
