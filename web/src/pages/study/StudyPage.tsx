import { useEffect, useMemo } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchStudyChapter, studyKey } from "../../features/study/studySlice";
import type { SectionType } from "../../study/types";
import { ToggleGroup, ToggleGroupItem } from "../../components/ui/toggle-group";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import { Card, CardHeader, CardTitle, CardAction } from "../../components/ui/card";
import EmptyState from "../../components/ui/EmptyState";
import SubjectBadge from "../../components/subjects/SubjectBadge";
import SectionView from "./SectionView";
import styles from "./Study.module.css";

// Sections are grouped into four parts, in this order; a part with no
// sections in the chapter doesn't get a tab.
const PARTS: { value: string; label: string; types: SectionType[] }[] = [
  { value: "learn", label: "Learn", types: ["vocab", "block", "capitals"] },
  { value: "practice", label: "Practice", types: ["fib", "match", "trueFalse", "name", "mcq"] },
  { value: "write", label: "Write", types: ["qa", "passage"] },
  { value: "picture", label: "Picture", types: ["picture"] },
];

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

  useEffect(() => {
    if (!entry) dispatch(fetchStudyChapter(key));
  }, [entry, key, dispatch]);

  const chapter = entry?.status === "succeeded" ? entry.chapter : undefined;
  const parts = useMemo(() => {
    if (!chapter) return [];
    let n = 0;
    return PARTS.map((p) => ({
      ...p,
      sections: chapter.sections.filter((s) => p.types.includes(s.type)).map((section) => ({ section, num: ++n })),
    })).filter((p) => p.sections.length > 0);
  }, [chapter]);

  if (!entry || entry.status === "loading") return <EmptyState>Loading…</EmptyState>;
  if (!chapter) return <EmptyState>{entry.error ?? "Not found."}</EmptyState>;

  return (
    <>
      <header className={styles.chapterHead}>
        <Link className={styles.backLink} to={`/study/${subjectSlug}`}>
          ← All chapters
        </Link>
        <h2 className={styles.chapterTitle}>
          <SubjectBadge subject={chapter.subject} /> {chapter.chapter}
        </h2>
        <div className={styles.chips}>
          {chapter.tests.map((t) => (
            <Badge key={t} variant="secondary">
              {t}
            </Badge>
          ))}
        </div>
      </header>
      {parts.length === 0 ? (
        <EmptyState>Nothing here yet.</EmptyState>
      ) : (
        <Tabs key={key} defaultValue={parts[0].value} className="w-full">
          <TabsList variant="line">
            {parts.map((p) => (
              <TabsTrigger key={p.value} value={p.value}>
                {p.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {parts.map((p) => (
            <TabsContent key={p.value} value={p.value} className="flex flex-col gap-3">
              {p.sections.map(({ section, num }) => (
                <SectionView key={num} num={num} section={section} />
              ))}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </>
  );
}
