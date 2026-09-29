import type { MatchSet } from "../../../study/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { HIDE } from "../answer";
import SourceMarks from "../SourceMarks";

export default function MatchSetCard({ set }: { set: MatchSet }) {
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
          {set.pairs.map((pair, i) => (
            <TableRow key={i}>
              <TableCell>{pair.leftSvg ? <span dangerouslySetInnerHTML={{ __html: pair.leftSvg }} /> : pair.left}</TableCell>
              <TableCell>{pair.right}</TableCell>
            </TableRow>
          ))}
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
