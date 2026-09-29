import type { McqItem } from "../../../study/types";
import { HIDE } from "../answer";
import SourceMarks from "../SourceMarks";

// "(a) globe (b) atlas (c) map" -> [["a","globe"], ["b","atlas"], ...]
function parseOptions(options: string): [string, string][] {
  const found = [...options.matchAll(/\(([a-zA-Z])\)\s*([^()]*?)(?=\s*\([a-zA-Z]\)|\s*$)/g)];
  return found.map((m) => [m[1].toLowerCase(), m[2].trim()]);
}

/** One MCQ: the options as a list, with the correct one marked. */
export default function McqItemCard({ item }: { item: McqItem }) {
  const options = parseOptions(item.options);
  const correct = item.answer.match(/^\(?([a-zA-Z])\)?/)?.[1].toLowerCase();
  return (
    <div className="flex flex-col gap-2 py-3">
      <p className="text-[15px] leading-snug font-medium">
        {item.question}
        <SourceMarks sources={item.sources} />
      </p>
      {options.length >= 2 ? (
        <ul className="flex flex-col gap-1.5">
          {options.map(([letter, text]) => {
            const ok = letter === correct;
            return (
              <li
                key={letter}
                className={`flex items-center gap-2.5 rounded-lg border px-3 py-2 text-sm ${
                  ok
                    ? `${HIDE} border-emerald-500/40 bg-emerald-500/10 group-data-[hide=true]/study:border-border group-data-[hide=true]/study:bg-transparent`
                    : ""
                }`}
              >
                <span className="font-mono text-xs text-muted-foreground uppercase">{letter}</span>
                <span className={ok ? "group-data-[hide=true]/study:text-foreground" : ""}>{text}</span>
              </li>
            );
          })}
        </ul>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">{item.options}</p>
          <p className="text-sm">
            Answer: <span className={`${HIDE} font-semibold`}>{item.answer}</span>
          </p>
        </>
      )}
    </div>
  );
}
