import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchStudyChapter, studyKey } from "../../features/study/studySlice";
import type { SectionType, StudySection } from "../../study/types";
import { Switch } from "../../components/ui/switch";
import { ChevronLeft, Layers } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "../../components/ui/toggle-group";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "../../components/ui/card";
import EmptyState from "../../components/ui/EmptyState";
import SubjectBadge from "../../components/subjects/SubjectBadge";
import { Checkbox } from "../../components/ui/checkbox";
import SectionView, { MergedSectionView, type SectionMember } from "./SectionView";

// Sections are grouped into four parts, in this order; a part with no
// sections in the chapter is left out.
const PARTS: { value: string; label: string; blurb: string; unit: string; dot: string; text: string; types: SectionType[] }[] = [
  { value: "learn", label: "Learn", blurb: "Words, meanings and facts to remember", unit: "facts & words", dot: "bg-blue-500", text: "text-blue-600 dark:text-blue-400", types: ["vocab", "block", "capitals"] },
  { value: "practice", label: "Practice", blurb: "Short, quick-answer questions", unit: "quick questions", dot: "bg-amber-500", text: "text-amber-600 dark:text-amber-400", types: ["fib", "match", "trueFalse", "name", "mcq"] },
  { value: "write", label: "Write", blurb: "Longer answers in your own words", unit: "written answers", dot: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400", types: ["qa", "passage"] },
  { value: "activity", label: "Activity", blurb: "Pictures, maps and diagrams", unit: "picture tasks", dot: "bg-purple-500", text: "text-purple-600 dark:text-purple-400", types: ["picture"] },
];

function itemCount(section: StudySection): number {
  if (section.type === "fib") return section.sets.reduce((n, set) => n + set.items.length, 0);
  if (section.type === "match") return section.sets.reduce((n, set) => n + set.pairs.length, 0);
  if (section.type === "block") return section.items.reduce((n, b) => n + (section.layout === "text" || !section.layout ? 1 : b.lines.length), 0);
  return section.items.length;
}

// A colour per chapter for the combined view's headings.
const CHAPTER_DOTS = ["bg-blue-500", "bg-amber-500", "bg-emerald-500", "bg-purple-500", "bg-rose-500", "bg-cyan-500", "bg-orange-500", "bg-lime-500"];

interface Entry {
  label: string;
  dot: string;
  sections: StudySection[];
}

// Sections of the same type, layout and title (ignoring case and punctuation)
// merge into one card; first appearance decides the order.
function mergeSections(entries: Entry[], types: SectionType[]): SectionMember[][] {
  const merged = new Map<string, SectionMember[]>();
  for (const e of entries) {
    for (const section of e.sections) {
      if (!types.includes(section.type)) continue;
      const layout = "layout" in section ? (section.layout ?? "") : "";
      const key = `${section.type}|${layout}|${section.title.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "")}`;
      merged.set(key, [...(merged.get(key) ?? []), { label: e.label, dot: e.dot, section }]);
    }
  }
  return [...merged.values()];
}

/** /study, /study/:subject, /study/:subject/:chapter and
 * /study/:subject?chapters=a,b -- browse by subject, then chapter (or several
 * chapters together), then the sections. */
export default function StudyPage() {
  const { subject: subjectSlug, chapter: chapterSlug } = useParams<{ subject?: string; chapter?: string }>();
  const [params] = useSearchParams();
  const index = useAppSelector((s) => s.data.studyIndex);
  const navigate = useNavigate();

  const activeSlug = subjectSlug ?? index.subjects.find((s) => s.subject === "English")?.slug ?? index.subjects[0]?.slug;
  const subject = index.subjects.find((s) => s.slug === activeSlug);
  const together = (params.get("chapters") ?? "").split(",").filter(Boolean);

  return (
    <>
      <ToggleGroup size="sm" value={activeSlug ? [activeSlug] : []} onValueChange={(v) => v[0] && navigate(`/study/${v[0]}`)}>
        {index.subjects.map((s) => (
          <ToggleGroupItem key={s.slug} value={s.slug}>
            {s.subject}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      {!subject ? (
        <EmptyState>Nothing to study yet.</EmptyState>
      ) : chapterSlug ? (
        <ChapterView subjectSlug={subject.slug} chapterSlug={chapterSlug} />
      ) : together.length > 0 ? (
        <CombinedView subjectSlug={subject.slug} slugs={together} />
      ) : (
        <ChapterList subjectSlug={subject.slug} />
      )}
    </>
  );
}

function ChapterList({ subjectSlug }: { subjectSlug: string }) {
  const subject = useAppSelector((s) => s.data.studyIndex.subjects.find((x) => x.slug === subjectSlug));
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);
  if (!subject) return null;
  const tests = [...new Set(subject.chapters.flatMap((c) => c.tests))];
  const terms = [...new Set(subject.chapters.map((c) => c.term).filter(Boolean) as string[])].sort();
  const test = params.get("test") ?? "All";
  const term = params.get("term") ?? "All";
  const chapters = subject.chapters.filter((c) => (test === "All" || c.tests.includes(test)) && (term === "All" || c.term === term));
  const setFilter = (key: "test" | "term", value: string | undefined) => {
    const next = new URLSearchParams(params);
    if (value && value !== "All") next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };
  const picked = chapters.filter((c) => selected.includes(c.slug));
  const toggle = (slug: string, on: boolean) => setSelected(on ? [...selected, slug] : selected.filter((s) => s !== slug));

  return (
    <div className="flex flex-col gap-2">
      {terms.length > 1 && (
        <ToggleGroup size="sm" value={[term]} onValueChange={(v) => setFilter("term", v[0])}>
          <ToggleGroupItem value="All">All terms</ToggleGroupItem>
          {terms.map((t) => (
            <ToggleGroupItem key={t} value={t}>
              {t}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      )}
      {tests.length > 0 && (
        <ToggleGroup size="sm" value={[test]} onValueChange={(v) => setFilter("test", v[0])}>
          <ToggleGroupItem value="All">All</ToggleGroupItem>
          {tests.map((t) => (
            <ToggleGroupItem key={t} value={t}>
              {t}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      )}
      {chapters.map((c) => (
        <div key={c.slug} className="flex items-center gap-3">
          <Checkbox checked={selected.includes(c.slug)} onCheckedChange={(on) => toggle(c.slug, on)} aria-label={`Select ${c.title}`} />
          <Link to={`/study/${subject.slug}/${c.slug}`} className="min-w-0 flex-1">
            <Card size="sm">
              <CardHeader>
                <CardTitle>
                  {c.number ? `${c.number}. ` : ""}
                  {c.title}
                </CardTitle>
                <CardAction className="flex flex-wrap gap-1">
                  {terms.length > 1 && c.term && <Badge variant="outline">{c.term}</Badge>}
                  {c.tests.map((t) => (
                    <Badge key={t} variant="secondary">
                      {t}
                    </Badge>
                  ))}
                </CardAction>
              </CardHeader>
            </Card>
          </Link>
        </div>
      ))}
      {chapters.length > 1 && (
        <div className="sticky bottom-3 z-10 mt-2 flex flex-wrap items-center gap-2 rounded-xl bg-card p-3 shadow-md ring-1 ring-foreground/10">
          <span className="text-sm text-muted-foreground">
            {picked.length === 0 ? "Tick chapters to study them together" : `${picked.length} selected`}
          </span>
          <div className="ml-auto flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setSelected(picked.length === chapters.length ? [] : chapters.map((c) => c.slug))}>
              {picked.length === chapters.length ? "Clear" : "Select all"}
            </Button>
            <Button
              size="sm"
              disabled={picked.length < 2}
              onClick={() => navigate(`/study/${subject.slug}?chapters=${picked.map((c) => c.slug).join(",")}`)}
            >
              <Layers />
              Study together
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function useChapters(subjectSlug: string, slugs: string[]) {
  const dispatch = useAppDispatch();
  const loaded = useAppSelector((s) => s.study.chapters);
  const keys = slugs.map((slug) => studyKey(subjectSlug, slug));
  const missing = keys.filter((k) => !loaded[k]).join(",");
  useEffect(() => {
    missing.split(",").filter(Boolean).forEach((k) => dispatch(fetchStudyChapter(k)));
  }, [missing, dispatch]);
  return keys.map((k) => loaded[k]);
}

function ChapterView({ subjectSlug, chapterSlug }: { subjectSlug: string; chapterSlug: string }) {
  const [entry] = useChapters(subjectSlug, [chapterSlug]);
  if (!entry || entry.status === "loading") return <EmptyState>Loading…</EmptyState>;
  const chapter = entry.chapter;
  if (!chapter) return <EmptyState>{entry.error ?? "Not found."}</EmptyState>;
  return (
    <StudyContent
      key={chapterSlug}
      backTo={`/study/${subjectSlug}`}
      entries={[{ label: chapter.chapter, dot: CHAPTER_DOTS[0], sections: chapter.sections }]}
      header={
        <>
          <div className="flex flex-wrap gap-2">
            <SubjectBadge subject={chapter.subject} />
            {chapter.tests.map((t) => (
              <Badge key={t} variant="secondary">
                {t}
              </Badge>
            ))}
          </div>
          <h2 className="text-3xl leading-tight font-bold tracking-tight">{chapter.chapter}</h2>
          <p className="text-sm text-muted-foreground">Chapter revision · {chapter.sections.length} sections</p>
        </>
      }
    />
  );
}

function CombinedView({ subjectSlug, slugs }: { subjectSlug: string; slugs: string[] }) {
  const subject = useAppSelector((s) => s.data.studyIndex.subjects.find((x) => x.slug === subjectSlug));
  // Chapters always appear in the index's order, whatever order the URL lists them in.
  const ordered = subject ? subject.chapters.filter((c) => slugs.includes(c.slug)).map((c) => c.slug) : [];
  const entries = useChapters(subjectSlug, ordered);
  if (!subject || ordered.length === 0) return <EmptyState>Not found.</EmptyState>;
  if (entries.some((e) => !e || e.status === "loading")) return <EmptyState>Loading…</EmptyState>;
  const failed = entries.find((e) => !e.chapter);
  if (failed) return <EmptyState>{failed.error ?? "Not found."}</EmptyState>;
  const built: Entry[] = entries.map((e, i) => ({ label: e.chapter!.chapter, dot: CHAPTER_DOTS[i % CHAPTER_DOTS.length], sections: e.chapter!.sections }));
  return (
    <StudyContent
      key={ordered.join(",")}
      backTo={`/study/${subjectSlug}`}
      entries={built}
      header={
        <>
          <div className="flex flex-wrap gap-2">
            <SubjectBadge subject={subject.subject} />
          </div>
          <h2 className="text-3xl leading-tight font-bold tracking-tight">{built.length} chapters together</h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {built.map((b) => (
              <span key={b.label} className="flex items-center gap-1.5">
                <span className={`size-2 rounded-[2px] ${b.dot}`} />
                {b.label}
              </span>
            ))}
          </div>
        </>
      }
    />
  );
}

/** The study page body shared by one chapter and several together: Hide
 * answers switch, stat tiles, sticky section bar and the four parts. */
function StudyContent({ backTo, header, entries }: { backTo: string; header: ReactNode; entries: Entry[] }) {
  const [hide, setHide] = useState(false);
  const [active, setActive] = useState("learn");
  const combined = entries.length > 1;

  const parts = useMemo(
    () =>
      PARTS.map((p) => {
        const merged = mergeSections(entries, p.types);
        const total = merged.reduce((n, members) => n + members.reduce((m, x) => m + itemCount(x.section), 0), 0);
        return { ...p, merged, total };
      }).filter((p) => p.merged.length > 0),
    [entries],
  );

  // Scroll-spy: the part whose section sits in the upper part of the viewport
  // is the active tab. Paused briefly after a tab tap so the smooth scroll
  // doesn't flicker through the parts it passes.
  const lockUntil = useRef(0);
  const partValues = parts.map((p) => p.value).join(",");
  useEffect(() => {
    if (!partValues) return;
    // Any section crossing the band re-evaluates: the active part is the last
    // one whose top has reached the band line, or the first at the very top.
    const observer = new IntersectionObserver(
      () => {
        if (Date.now() < lockUntil.current) return;
        const line = window.innerHeight * 0.2;
        const values = partValues.split(",");
        let current = values[0];
        for (const v of values) {
          const top = document.getElementById(`part-${v}`)?.getBoundingClientRect().top;
          if (top !== undefined && top <= line) current = v;
        }
        setActive(current);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    partValues.split(",").forEach((v) => {
      const el = document.getElementById(`part-${v}`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [partValues]);

  const goTo = (value: string) => {
    setActive(value);
    lockUntil.current = Date.now() + 900;
    document.getElementById(`part-${value}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="group/study flex flex-col gap-6" data-hide={hide}>
      <header className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" className="-ml-2" nativeButton={false} render={<Link to={backTo} />}>
            <ChevronLeft />
            All chapters
          </Button>
          <label className="flex min-h-11 cursor-pointer items-center gap-2.5 text-sm font-medium">
            Hide answers
            <Switch checked={hide} onCheckedChange={setHide} aria-label="Hide answers" />
          </label>
        </div>
        {header}
      </header>

      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
        {parts.map((p) => (
          <Card key={p.value} size="sm" className="gap-1">
            <CardHeader>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className={`size-2 rounded-[2px] ${p.dot}`} />
                {p.label}
              </div>
            </CardHeader>
            <CardContent className="text-2xl font-bold">
              {p.total} <span className="text-[13px] font-normal text-muted-foreground">{p.unit}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={active} onValueChange={goTo} className="sticky top-0 z-10 bg-background py-2">
        <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${parts.length}, minmax(0, 1fr))` }}>
          {parts.map((p) => (
            <TabsTrigger key={p.value} value={p.value}>
              {p.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {parts.length === 0 ? (
        <EmptyState>Nothing here yet.</EmptyState>
      ) : (
        <div className="flex flex-col gap-10">
          {parts.map((p, i) => (
            <section key={p.value} id={`part-${p.value}`} className="flex scroll-mt-16 flex-col gap-3.5">
              <div className="flex items-end justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <div className={`flex items-center gap-2 text-xs font-semibold tracking-widest uppercase ${p.text}`}>
                    <span className={`size-2 rounded-[2px] ${p.dot}`} />
                    Part {String.fromCharCode(65 + i)}
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight">{p.label}</h3>
                  <p className="text-sm text-muted-foreground">{p.blurb}</p>
                </div>
                <Badge variant="outline" className="shrink-0 text-muted-foreground">
                  {p.merged.length} {p.merged.length === 1 ? "part" : "parts"}
                </Badge>
              </div>
              {p.merged.map((members, j) =>
                combined ? <MergedSectionView key={j} members={members} /> : <SectionView key={j} section={members[0].section} />,
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
