import type { ReactNode } from "react";
import type { QaItem } from "../../../study/types";
import { resolveImage } from "../../../study/resolveImage";
import { HIDE } from "../answer";
import SourceMarks from "../SourceMarks";

function AnswerText({ answer }: { answer: string | string[] }) {
  return Array.isArray(answer) ? (
    <ul className="flex list-disc flex-col gap-1 pl-5">
      {answer.map((line, i) => (
        <li key={i}>{line}</li>
      ))}
    </ul>
  ) : (
    <p>{answer}</p>
  );
}

/** The answer box; with "Hide answers" on it turns into a grey placeholder. */
function AnswerBox({ children }: { children: ReactNode }) {
  return <div className={`${HIDE} rounded-lg bg-muted/60 px-3 py-2 text-[15px] leading-relaxed`}>{children}</div>;
}

/** A question and its answer as plain text. A list answer renders as bullets;
 * a stem question (a quoted passage) renders its sub-questions, each with its
 * own answer. In the "terms" layout (Define) it is a term with its meaning beside it. */
export default function QaItemCard({ item, layout }: { item: QaItem; layout?: "terms" }) {
  if (layout === "terms" && item.answer) {
    return (
      <div className="flex gap-3 py-3">
        <div className="w-20 shrink-0 font-semibold">
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
        {item.question}
        <SourceMarks sources={item.sources} />
      </p>
      {item.answer && (
        <AnswerBox>
          <AnswerText answer={item.answer} />
        </AnswerBox>
      )}
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
