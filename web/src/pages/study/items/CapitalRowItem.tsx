import type { CapitalRow } from "../../../study/types";
import SourceMarks from "../SourceMarks";

export default function CapitalRowItem({ row }: { row: CapitalRow }) {
  return (
    <tr>
      <td>{row.state}</td>
      <td>{row.capital}</td>
      <td>
        <SourceMarks sources={row.sources} />
      </td>
    </tr>
  );
}
