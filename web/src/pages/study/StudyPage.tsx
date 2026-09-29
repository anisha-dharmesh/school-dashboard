import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchStudyChapter, studyKey } from "../../features/study/studySlice";
import type { SectionType, StudySection } from "../../study/types";
import { Switch } from "../../components/ui/switch";
import { ChevronLeft } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "../../components/ui/toggle-group";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "../../components/ui/card";
import EmptyState from "../../components/ui/EmptyState";
import SubjectBadge from "../../components/subjects/SubjectBadge";
import SectionView from "./SectionView";

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

/** /study, /study/:subject and /study/:subject/:chapter -- browse by
 * subject, then chapter, then that chapter's sections. */
export default function StudyPage() {
  const { subject: subjectSlug, chapter: chapterSlug } = useParams<{ subject?: string; chapter?: string }>();
  const index = useAppSelector((s) => s.data.studyIndex);
  const navigate = useNavigate();

  const activeSlug = subjectSlug ?? index.subjects.find((s) => s.subject === "English")?.slug ?? index.subjects[0]?.slug;
  const subject = index.subjects.find((s) => s.slug === activeSlug);

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
      ) : (
        <ChapterList subjectSlug={subject.slug} />
      )}
    </>
  );
}

function ChapterList({ subjectSlug }: { subjectSlug: string }) {
  const subject = useAppSelector((s) => s.data.studyIndex.subjects.find((x) => x.slug === subjectSlug));
  const [params, setParams] = useSearchParams();
  if (!subject) return null;
  const tests = [...new Set(subject.chapters.flatMap((c) => c.tests))];
  const test = params.get("test") ?? "All";
  const chapters = test === "All" ? subject.chapters : subject.chapters.filter((c) => c.tests.includes(test));

  return (
    <div className="flex flex-col gap-2">
      {tests.length > 0 && (
        <ToggleGroup
          size="sm"
          value={[test]}
          onValueChange={(v) => setParams(v[0] && v[0] !== "All" ? { test: v[0] } : {}, { replace: true })}
        >
          <ToggleGroupItem value="All">All</ToggleGroupItem>
          {tests.map((t) => (
            <ToggleGroupItem key={t} value={t}>
              {t}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      )}
      {chapters.map((c) => (
        <Link key={c.slug} to={`/study/${subject.slug}/${c.slug}`}>
          <Card size="sm">
            <CardHeader>
              <CardTitle>
                {c.number ? `${c.number}. ` : ""}
                {c.title}
              </CardTitle>
              <CardAction className="flex flex-wrap gap-1">
                {c.tests.map((t) => (
                  <Badge key={t} variant="secondary">
                    {t}
                  </Badge>
                ))}
              </CardAction>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  );
}

function ChapterView({ subjectSlug, chapterSlug }: { subjectSlug: string; chapterSlug: string }) {
  const dispatch = useAppDispatch();
  const key = studyKey(subjectSlug, chapterSlug);
  const entry = useAppSelector((s) => s.study.chapters[key]);
  const [hide, setHide] = useState(false);
  const [active, setActive] = useState("learn");

  useEffect(() => {
    if (!entry) dispatch(fetchStudyChapter(key));
  }, [entry, key, dispatch]);

  const chapter = entry?.status === "succeeded" ? entry.chapter : undefined;
  const parts = useMemo(() => {
    if (!chapter) return [];
    return PARTS.map((p) => {
      const sections = chapter.sections.filter((s) => p.types.includes(s.type));
      return { ...p, sections, total: sections.reduce((n, s) => n + itemCount(s), 0) };
    }).filter((p) => p.sections.length > 0);
  }, [chapter]);

  if (!entry || entry.status === "loading") return <EmptyState>Loading…</EmptyState>;
  if (!chapter) return <EmptyState>{entry.error ?? "Not found."}</EmptyState>;

  const goTo = (value: string) => {
    setActive(value);
    document.getElementById(`part-${value}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="group/study flex flex-col gap-6" data-hide={hide}>
      <header className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" className="-ml-2" nativeButton={false} render={<Link to={`/study/${subjectSlug}`} />}>
            <ChevronLeft />
            All chapters
          </Button>
          <label className="flex min-h-11 cursor-pointer items-center gap-2.5 text-sm font-medium">
            Hide answers
            <Switch checked={hide} onCheckedChange={setHide} aria-label="Hide answers" />
          </label>
        </div>
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
                  {p.sections.length} {p.sections.length === 1 ? "part" : "parts"}
                </Badge>
              </div>
              {p.sections.map((section, j) => (
                <SectionView key={j} section={section} />
              ))}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
