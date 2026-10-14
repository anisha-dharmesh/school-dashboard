import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { SUBJECT_META, subjectAbbr } from "../../lib/subjects";
import { noticeSubjects } from "../../lib/notices";
import { ToggleGroup, ToggleGroupItem } from "../../components/ui/toggle-group";
import EmptyState from "../../components/ui/EmptyState";
import Timeline from "../../components/ui/Timeline";
import HistoryItem from "../history/HistoryItem";

/** Class III F's day-by-day Daily Class Update (classwork + homework, per
 * period) -- kept as its own tab rather than folded into History's mixed,
 * category-filtered feed, since this is the one category a parent reads
 * front-to-back as a continuous school-day diary rather than something to
 * filter down to a handful of items. Deliberately no date-range control:
 * Timeline already groups every day under its own divider and scrolls as
 * far back as there's data, so a filter would only hide days rather than
 * narrow a list worth narrowing. */
export default function DailyUpdatesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const notices = useAppSelector((s) => s.data.notices);

  const dailyUpdates = useMemo(() => notices.filter((r) => r.category === "Daily Class Update"), [notices]);

  const requestedSubject = searchParams.get("subject") || "All";
  const allSubjects = useMemo(() => {
    const s = new Set<string>();
    dailyUpdates.forEach((r) => noticeSubjects(r).forEach((subj) => { if (SUBJECT_META[subj]) s.add(subj); }));
    return [...s].sort();
  }, [dailyUpdates]);

  const activeSubject = allSubjects.length === 0 ? "All" : requestedSubject;
  const filtered = activeSubject === "All" ? dailyUpdates : dailyUpdates.filter((r) => noticeSubjects(r).has(activeSubject));

  const setSubject = (s: string) =>
    setSearchParams((p) => {
      const next = new URLSearchParams(p);
      if (s === "All") next.delete("subject");
      else next.set("subject", s);
      return next;
    });

  return (
    <>
      {allSubjects.length > 0 && (
        <div className="-mx-4 overflow-x-auto px-4 md:-mx-6 md:px-6">
          <ToggleGroup size="sm" value={[activeSubject]} onValueChange={(v) => setSubject(v[0] ?? "All")} className="w-max">
            <ToggleGroupItem value="All">All</ToggleGroupItem>
            {allSubjects.map((s) => (
              <ToggleGroupItem key={s} value={s} title={s}>
                {subjectAbbr(s)}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState>No daily updates yet.</EmptyState>
      ) : (
        <Timeline items={filtered} dateIso={(r) => r.posted_date_iso}>
          {(r) => <HistoryItem key={r.id} notice={r} />}
        </Timeline>
      )}
    </>
  );
}
