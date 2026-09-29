import type { CapitalRow } from "../../../study/types";
import { TableCell, TableRow } from "../../../components/ui/table";
import SourceMarks from "../SourceMarks";

export default function CapitalRowItem({ row }: { row: CapitalRow }) {
  return (
    <TableRow>
      <TableCell>{row.state}</TableCell>
      <TableCell className="font-medium">
        {row.capital}
        <SourceMarks sources={row.sources} />
      </TableCell>
    </TableRow>
  );
}
