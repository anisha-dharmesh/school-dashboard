import { History, RotateCcw, Settings2 } from "lucide-react";
import type { PracticeSession } from "../../practice/types";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import ResultList from "./ResultList";
import { scoreOf } from "./format";

interface Props {
  /** Null when the session was ended without answering anything. */
  session: PracticeSession | null;
  onAgain: () => void;
  onNew: () => void;
  onHistory: () => void;
}

function verdict(percent: number): string {
  if (percent >= 90) return "Excellent!";
  if (percent >= 70) return "Good job!";
  if (percent >= 50) return "Keep practising!";
  return "Let's go through the solutions.";
}

export default function SummaryPanel({ session, onAgain, onNew, onHistory }: Props) {
  if (!session) {
    return (
      <Card className="w-full max-w-2xl self-center">
        <CardHeader>
          <CardTitle>Session ended</CardTitle>
          <CardDescription>No questions were answered, so nothing was saved.</CardDescription>
        </CardHeader>
        <CardFooter className="gap-2">
          <Button onClick={onNew}>
            <Settings2 />
            New session
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const { correct, total, percent } = scoreOf(session.results);
  const wrong = session.results.filter((r) => !r.ok);

  return (
    <Card className="w-full max-w-2xl self-center">
      <CardHeader>
        <CardDescription>
          {session.subjectName} · {session.chapterTitle}
        </CardDescription>
        <CardTitle className="text-2xl tabular-nums">
          {correct} / {total} correct · {percent}%
        </CardTitle>
        <CardDescription>{verdict(percent)}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {wrong.length > 0 ? (
          <>
            <h3 className="text-sm font-medium">Missed ({wrong.length})</h3>
            <ResultList results={wrong} />
          </>
        ) : (
          <p className="text-sm text-muted-foreground">No mistakes this time.</p>
        )}
      </CardContent>
      <CardFooter className="flex-wrap gap-2">
        <Button onClick={onAgain}>
          <RotateCcw />
          Practise again
        </Button>
        <Button variant="outline" onClick={onNew}>
          <Settings2 />
          Change selection
        </Button>
        <Button variant="ghost" onClick={onHistory}>
          <History />
          History
        </Button>
      </CardFooter>
    </Card>
  );
}
