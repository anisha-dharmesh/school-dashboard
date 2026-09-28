import { cn } from "cn";
import { CheckCircle2, XCircle } from "lucide-react";
import type { PracticeResult } from "../../practice/types";
import { Badge } from "../../components/ui/badge";

/** The worked solution, one step per line. */
export function Solution({ steps, className }: { steps: string[]; className?: string }) {
  return (
    // divs, not <p>: inside an Alert, <p> picks up paragraph margins that
    // spread a worked solution out to twice its height.
    <div className={cn("flex flex-col gap-1 tabular-nums", className)}>
      {steps.map((step, i) => (
        <div key={i}>{step}</div>
      ))}
    </div>
  );
}

/** Answered questions, each with what was typed and the right answer; a wrong one also shows its solution. */
export default function ResultList({ results }: { results: PracticeResult[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {results.map((r, i) => (
        <li key={i} className="flex gap-3 rounded-lg border p-3">
          {r.ok ? (
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green-600 dark:text-green-400" aria-label="Correct" />
          ) : (
            <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" aria-label="Wrong" />
          )}
          <div className="flex min-w-0 flex-1 flex-col gap-1.5 text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{r.exerciseTitle}</Badge>
              {r.instruction && <span className="text-xs text-muted-foreground">{r.instruction}</span>}
            </div>
            <p className="font-medium">{r.prompt}</p>
            {r.ok ? (
              <p className="text-muted-foreground">
                Answer: <span className="font-medium text-foreground">{r.correct}</span>
              </p>
            ) : (
              <>
                <p className="text-muted-foreground">
                  Your answer: <span className="font-medium text-destructive">{r.given || "—"}</span>
                </p>
                <p className="text-muted-foreground">
                  Correct answer: <span className="font-medium text-green-700 dark:text-green-400">{r.correct}</span>
                </p>
                <div className="mt-1 rounded-md bg-muted/60 p-2 text-muted-foreground">
                  <Solution steps={r.solution} />
                </div>
              </>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
