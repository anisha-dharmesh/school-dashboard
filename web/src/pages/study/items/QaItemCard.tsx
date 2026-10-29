import type { ReactNode } from "react";
import type { QaItem } from "../../../study/types";
import { resolveImage } from "../../../study/resolveImage";
import { HIDE } from "../answer";
import SourceMarks from "../SourceMarks";

// A line that already carries its own label from the notebook: "(a) ...",
// "a) ...", "1. ...", "(i) ...", or a heading such as "Clothing -". Those are shown exactly as written, one per
// line, so the labels the child sees match the notes.
const LABELLED = /^\s*(\(?[a-zA-Z0-9]{1,4}\)|\([a-zA-Z0-9]{1,4}\)?|\d{1,2}\.)\s|\s-$/;

const AnsLabel = () => <span className="mr-1 font-semibold text-muted-foreground">Ans:</span>;

function AnswerText({ answer, label }: { answer: string | string[]; label?: boolean }) {
  if (!Array.isArray(answer))
    return (
      <p>
        {label && <AnsLabel />}
        {answer}
      </p>
    );
  const head = label ? <AnsLabel /> : null;
  if (answer.some((line) => LABELLED.test(line))) {
    return (
      <div className="flex flex-col gap-1">
        {head && <p>{head}</p>}
        {answer.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    );
  }
  return (
    <ul className="flex list-disc flex-col gap-1 pl-5">
      {head && <li className="list-none -ml-5">{head}</li>}
      {answer.map((line, i) => (
        <li key={i}>{line}</li>
      ))}
    </ul>
  );
}

/** The answer box; with "Hide answers" on it turns into a grey placeholder. */
function AnswerBox({ children }: { children: ReactNode }) {
  return <div className={`${HIDE} rounded-lg bg-muted/60 px-3 py-2 text-[15px] leading-relaxed`}>{children}</div>;
}

/** "Difference between": a two-column table with a numbered row per point, like the notebook. */
function CompareTable({ compare }: { compare: NonNullable<QaItem["compare"]> }) {
  return (
    <div className={`${HIDE} overflow-hidden rounded-lg border text-[15px] leading-relaxed`}>
      <div className="grid grid-cols-2 divide-x bg-muted/60 font-semibold">
        {compare.columns.map((c) => (
          <div key={c} className="px-3 py-2">
            {c}
          </div>
        ))}
      </div>
      {compare.rows.map((row, i) => (
        <div key={i} className="grid grid-cols-2 divide-x border-t">
          {row.map((cell, j) => (
            <div key={j} className="px-3 py-2">
              {i + 1}. {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

const Num = ({ n }: { n?: number }) => (n ? <span className="mr-1.5 font-semibold text-muted-foreground">{n}.</span> : null);

/** A numbered question and its answer. A list answer keeps its own (a)/(1)
 * labels, one per line; a "difference between" answer is a two-column table;
 * a stem question (a quoted passage) renders its sub-questions, each with its
 * own answer. In the "terms" layout (Define) it is a term with its meaning beside it. */
export default function QaItemCard({ item, layout, number }: { item: QaItem; layout?: "terms"; number?: number }) {
  if (layout === "terms" && item.answer) {
    return (
      <div className="flex flex-col gap-0.5 py-3">
        <div className="font-semibold">
          <Num n={number} />
          {item.question}
          <SourceMarks sources={item.sources} />
        </div>
        <div className={`${HIDE} rounded text-[15px] leading-relaxed`}>
          <AnswerText answer={item.answer} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 py-3">
      {item.image && <img className="max-h-56 max-w-full self-start rounded-lg" src={resolveImage(item.image)} alt="" />}
      <p className="text-[15px] leading-snug font-medium">
        <Num n={number} />
        {item.question}
        <SourceMarks sources={item.sources} />
      </p>
      {item.answer && (
        <AnswerBox>
          <AnswerText answer={item.answer} label />
        </AnswerBox>
      )}
      {item.compare && <CompareTable compare={item.compare} />}
      {item.parts && (
        <div className="flex flex-col gap-3 border-l-2 pl-3">
          {item.parts.map((part, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <p className="text-[15px] leading-snug">{part.question}</p>
              <AnswerBox>
                <AnswerText answer={part.answer} />
              </AnswerBox>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
