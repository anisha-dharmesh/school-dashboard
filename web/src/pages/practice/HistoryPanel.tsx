import { useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { clearHistory } from "../../features/practice/practiceSlice";
import type { PracticeSession } from "../../practice/types";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import EmptyState from "../../components/ui/EmptyState";
import ResultList from "./ResultList";
import { formatWhen, scoreOf } from "./format";

export default function HistoryPanel() {
  const dispatch = useAppDispatch();
  const sessions = useAppSelector((s) => s.practice.sessions);
  const [open, setOpen] = useState<PracticeSession | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const stats = useMemo(() => {
    const all = sessions.flatMap((s) => s.results);
    const overall = scoreOf(all);
    // Questions missed most often across every session -- the ones worth another go.
    const misses = new Map<string, { prompt: string; exercise: string; count: number }>();
    for (const r of all) {
      if (r.ok) continue;
      const cur = misses.get(r.uid);
      if (cur) cur.count += 1;
      else misses.set(r.uid, { prompt: r.prompt, exercise: r.exerciseTitle, count: 1 });
    }
    const weakest = [...misses.values()].sort((a, b) => b.count - a.count).slice(0, 5);
    return { overall, weakest };
  }, [sessions]);

  if (sessions.length === 0) {
    return <EmptyState>No practice sessions yet. Finish one and it will show up here.</EmptyState>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Sessions" value={String(sessions.length)} />
        <Stat label="Questions answered" value={String(stats.overall.total)} />
        <Stat label="Overall accuracy" value={`${stats.overall.percent}%`} />
      </div>

      {stats.weakest.length > 0 && (
        <Card size="sm">
          <CardHeader>
            <CardTitle>Needs more practice</CardTitle>
            <CardDescription>Missed most often, across all sessions.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-1.5 text-sm">
            {stats.weakest.map((w, i) => (
              <div key={i} className="flex items-center justify-between gap-3">
                <span className="min-w-0 truncate">
                  <span className="text-muted-foreground">{w.exercise} · </span>
                  {w.prompt}
                </span>
                <Badge variant="outline">missed {w.count}×</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="rounded-xl ring-1 ring-foreground/10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>When</TableHead>
              <TableHead>Practised</TableHead>
              <TableHead className="text-right">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map((s) => {
              const { correct, total, percent } = scoreOf(s.results);
              return (
                <TableRow key={s.id} className="cursor-pointer" onClick={() => setOpen(s)}>
                  <TableCell className="whitespace-nowrap">{formatWhen(s.startedAt)}</TableCell>
                  <TableCell className="whitespace-normal">
                    <div>{s.chapterTitle}</div>
                    <div className="text-xs text-muted-foreground">{s.exerciseTitles.join(", ")}</div>
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap tabular-nums">
                    {correct} / {total} · {percent}%
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div>
        <Button variant="outline" size="sm" onClick={() => setConfirmClear(true)}>
          <Trash2 />
          Clear history
        </Button>
      </div>

      <Dialog open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          {open && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {open.chapterTitle} · {scoreOf(open.results).correct} / {open.results.length}
                </DialogTitle>
                <DialogDescription>{formatWhen(open.startedAt)}</DialogDescription>
              </DialogHeader>
              <ResultList results={open.results} />
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={confirmClear} onOpenChange={setConfirmClear}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear all practice history?</DialogTitle>
            <DialogDescription>This removes every saved session from this browser and can't be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter showCloseButton>
            <Button
              variant="destructive"
              onClick={() => {
                dispatch(clearHistory());
                setConfirmClear(false);
              }}
            >
              Clear history
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl tabular-nums">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}
