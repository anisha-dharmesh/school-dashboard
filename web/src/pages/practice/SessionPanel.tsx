import { useEffect, useRef, useState, type FormEvent } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { useAppDispatch } from "../../app/hooks";
import { addSession } from "../../features/practice/practiceSlice";
import { emptyResponse, hasResponse, toResult, type Response } from "../../practice/session";
import type { Chapter, PracticeItem, PracticeResult, PracticeSession, Subject } from "../../practice/types";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "../../components/ui/input-group";
import { Label } from "../../components/ui/label";
import { Progress } from "../../components/ui/progress";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Solution } from "./ResultList";

interface Props {
  subject: Subject;
  chapter: Chapter;
  queue: PracticeItem[];
  /** Null when the session ended before any question was answered (nothing is saved). */
  onFinish: (session: PracticeSession | null) => void;
}

export default function SessionPanel({ subject, chapter, queue, onFinish }: Props) {
  const dispatch = useAppDispatch();
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<PracticeResult[]>([]);
  const [startedAt] = useState(() => new Date().toISOString());

  function finish(finalResults: PracticeResult[]) {
    if (finalResults.length === 0) {
      onFinish(null);
      return;
    }
    const session: PracticeSession = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      startedAt,
      endedAt: new Date().toISOString(),
      subjectName: subject.name,
      chapterTitle: `Chapter ${chapter.number}: ${chapter.title}`,
      exerciseTitles: [...new Set(queue.map((q) => q.exerciseTitle))],
      results: finalResults,
    };
    dispatch(addSession(session));
    onFinish(session);
  }

  const answered = results.length;
  const correct = results.filter((r) => r.ok).length;

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4 self-center">
      <div className="flex items-center gap-3">
        <Progress value={(answered / queue.length) * 100} className="flex-1" aria-label="Session progress" />
        <Badge variant="secondary" className="tabular-nums">
          {correct} / {answered}
        </Badge>
        <Button variant="outline" size="sm" onClick={() => finish(results)}>
          End session
        </Button>
      </div>

      <QuestionCard
        // Remounting per question resets the typed answer and the feedback.
        key={index}
        item={queue[index]}
        number={index + 1}
        total={queue.length}
        isLast={index === queue.length - 1}
        onAnswer={(result) => setResults((r) => [...r, result])}
        onNext={(latest) => (index === queue.length - 1 ? finish(latest) : setIndex(index + 1))}
        results={results}
      />
    </div>
  );
}

interface CardProps {
  item: PracticeItem;
  number: number;
  total: number;
  isLast: boolean;
  results: PracticeResult[];
  onAnswer: (result: PracticeResult) => void;
  onNext: (allResults: PracticeResult[]) => void;
}

function QuestionCard({ item, number, total, isLast, results, onAnswer, onNext }: CardProps) {
  const { question } = item;
  const [response, setResponse] = useState<Response>(() => emptyResponse(question));
  const [result, setResult] = useState<PracticeResult | null>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  // Once answered the inputs lock, so hand focus to "Next" -- Enter then
  // moves on without reaching for the mouse.
  useEffect(() => {
    if (result) nextRef.current?.focus();
  }, [result]);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (result || !hasResponse(response)) return;
    const r = toResult(item, response);
    setResult(r);
    onAnswer(r);
  }

  function setPart(i: number, value: string) {
    setResponse((cur) => cur.map((v, j) => (j === i ? value.replace(/\D/g, "") : v)));
  }

  return (
    <form onSubmit={submit}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <Badge variant="secondary">{item.exerciseTitle}</Badge>
            <span className="text-xs text-muted-foreground tabular-nums">
              Question {number} of {total}
            </span>
          </div>
          {question.instruction && <CardDescription>{question.instruction}</CardDescription>}
          <CardTitle className="text-xl leading-snug">{question.prompt}</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          {question.answer.kind === "choice" ? (
            <RadioGroup value={response[0]} onValueChange={(v) => setResponse([String(v)])} disabled={result !== null}>
              {question.answer.options.map((option, i) => (
                <div key={i} className="flex items-center gap-2">
                  <RadioGroupItem value={String(i)} id={`opt-${i}`} />
                  <Label htmlFor={`opt-${i}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <div className="flex flex-wrap gap-3">
              {question.answer.parts.map((part, i) => (
                <InputGroup key={i} className="w-36">
                  <InputGroupInput
                    inputMode="numeric"
                    autoComplete="off"
                    autoFocus={i === 0}
                    aria-label={`Answer in ${part.unit}`}
                    value={response[i]}
                    onChange={(e) => setPart(i, e.target.value)}
                    disabled={result !== null}
                    className="tabular-nums"
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupText>{part.unit}</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              ))}
            </div>
          )}

          {result &&
            (result.ok ? (
              <Alert className="border-green-500/40 bg-green-500/10 text-green-700 dark:text-green-400">
                <CheckCircle2 />
                <AlertTitle>Correct!</AlertTitle>
                <AlertDescription className="text-green-700 dark:text-green-400">{result.correct}</AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <XCircle />
                <AlertTitle>Not quite</AlertTitle>
                <AlertDescription>
                  <p className="font-medium text-green-700 dark:text-green-400">Correct answer: {result.correct}</p>
                  <Solution steps={result.solution} className="mt-2 text-foreground" />
                </AlertDescription>
              </Alert>
            ))}
        </CardContent>

        <CardFooter className="justify-end">
          {result ? (
            <Button key="next" type="button" ref={nextRef} onClick={() => onNext(results)}>
              {isLast ? "Finish" : "Next question"}
            </Button>
          ) : (
            <Button key="check" type="submit" disabled={!hasResponse(response)}>
              Check answer
            </Button>
          )}
        </CardFooter>
      </Card>
    </form>
  );
}
