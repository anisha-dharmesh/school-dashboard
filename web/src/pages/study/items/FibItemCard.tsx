import type { ReactNode } from "react";
import type { FibItem } from "../../../study/types";
import { ANSWER_TEXT } from "../answer";
import SourceMarks from "../SourceMarks";

/** One fill-in-the-blank sentence with each answer inline. */
export default function FibItemCard({ item }: { item: FibItem }) {
  return (
    <li>
      {renderTemplate(item.template, item.answers)}
      <SourceMarks sources={item.sources} />
    </li>
  );
}

function renderTemplate(template: string, answers: string[]) {
  const parts = template.split("___");
  const out: ReactNode[] = [parts[0]];
  parts.slice(1).forEach((part, i) => {
    out.push(
      <span key={i} className={ANSWER_TEXT}>
        {answers[i]}
      </span>,
    );
    out.push(part);
  });
  return out;
}
