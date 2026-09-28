import { useState } from "react";
import { Play } from "lucide-react";
import { collectItems, findChapter, findSubject, SUBJECTS } from "../../practice/registry";
import { countRegenerable } from "../../practice/session";
import type { Chapter, Subject } from "../../practice/types";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "../../components/ui/field";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "../../components/ui/toggle-group";

export interface Scope {
  subjectId: string;
  chapterId: string;
  exerciseIds: string[];
  /** How many questions to ask; 0 means every question in the selection. */
  count: number;
  /**
   * "textbook" asks the exact questions from the book. "random" gives fresh
   * numbers each time to every question that supports it -- same digit
   * lengths, and a subtraction always bigger-first so it can't go negative
   * -- while worded problems (fixed numbers baked into a sentence) come
   * through unchanged either way.
   */
  numbers: "textbook" | "random";
}

const COUNTS = [
  { value: 5, label: "5" },
  { value: 10, label: "10" },
  { value: 20, label: "20" },
  { value: 0, label: "All" },
];

const NUMBER_MODES: { value: Scope["numbers"]; label: string }[] = [
  { value: "textbook", label: "Textbook" },
  { value: "random", label: "New each time" },
];

const allExercises = (chapter: Chapter) => chapter.exercises.map((e) => e.id);

export default function SetupPanel({ initial, onStart }: { initial?: Scope; onStart: (scope: Scope) => void }) {
  const [subjectId, setSubjectId] = useState(initial?.subjectId ?? SUBJECTS[0].id);
  const subject: Subject = findSubject(subjectId) ?? SUBJECTS[0];
  const [chapterId, setChapterId] = useState(initial?.chapterId ?? subject.chapters[0].id);
  const chapter: Chapter = findChapter(subject, chapterId) ?? subject.chapters[0];
  const [selected, setSelected] = useState<string[]>(initial?.exerciseIds ?? allExercises(chapter));
  const [count, setCount] = useState(initial?.count ?? 10);
  const [numbers, setNumbers] = useState<Scope["numbers"]>(initial?.numbers ?? "textbook");

  const items = collectItems(subject, chapter, selected);
  const available = items.length;
  const regenerable = countRegenerable(items);
  const allSelected = selected.length === chapter.exercises.length;

  function changeSubject(id: string) {
    const next = findSubject(id) ?? SUBJECTS[0];
    setSubjectId(next.id);
    setChapterId(next.chapters[0].id);
    setSelected(allExercises(next.chapters[0]));
  }

  function changeChapter(id: string) {
    const next = findChapter(subject, id) ?? subject.chapters[0];
    setChapterId(next.id);
    setSelected(allExercises(next));
  }

  function toggleExercise(id: string, on: boolean) {
    setSelected((cur) => (on ? [...cur, id] : cur.filter((x) => x !== id)));
  }

  const subjectItems = SUBJECTS.map((s) => ({ value: s.id, label: s.name }));
  const chapterItems = subject.chapters.map((c) => ({ value: c.id, label: `Chapter ${c.number}: ${c.title}` }));

  return (
    <Card className="w-full max-w-2xl self-center">
      <CardHeader>
        <CardTitle>Start a practice session</CardTitle>
        <CardDescription>Pick what to practise. Questions come up in random order, and any you get wrong show the solution.</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <div className="grid gap-4 sm:grid-cols-[1fr_2fr]">
            <Field>
              <Label htmlFor="practice-subject">Subject</Label>
              <Select items={subjectItems} value={subjectId} onValueChange={(v) => v && changeSubject(v)}>
                <SelectTrigger id="practice-subject" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {subjectItems.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <Label htmlFor="practice-chapter">Chapter</Label>
              <Select items={chapterItems} value={chapterId} onValueChange={(v) => v && changeChapter(v)}>
                <SelectTrigger id="practice-chapter" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {chapterItems.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <FieldSet>
            <div className="flex items-center justify-between gap-2">
              <FieldLegend variant="label" className="mb-0">
                Exercises
              </FieldLegend>
              <Button type="button" variant="ghost" size="xs" onClick={() => setSelected(allSelected ? [] : allExercises(chapter))}>
                {allSelected ? "Clear all" : "Select all"}
              </Button>
            </div>
            <FieldGroup className="gap-3">
              {chapter.exercises.map((ex) => (
                <Field key={ex.id} orientation="horizontal">
                  <Checkbox id={`ex-${ex.id}`} checked={selected.includes(ex.id)} onCheckedChange={(on) => toggleExercise(ex.id, on)} />
                  <FieldContent>
                    <FieldLabel htmlFor={`ex-${ex.id}`}>{ex.title}</FieldLabel>
                    <FieldDescription>
                      {ex.questions.length} questions{ex.description ? ` · ${ex.description}` : ""}
                    </FieldDescription>
                  </FieldContent>
                </Field>
              ))}
            </FieldGroup>
          </FieldSet>

          <Field>
            <Label>How many questions</Label>
            <ToggleGroup variant="outline" value={[String(count)]} onValueChange={(v) => v[0] !== undefined && setCount(Number(v[0]))}>
              {COUNTS.map((c) => (
                <ToggleGroupItem key={c.value} value={String(c.value)}>
                  {c.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </Field>

          <Field>
            <Label>Numbers</Label>
            <ToggleGroup variant="outline" value={[numbers]} onValueChange={(v) => v[0] && setNumbers(v[0] as Scope["numbers"])}>
              {NUMBER_MODES.map((m) => (
                <ToggleGroupItem key={m.value} value={m.value}>
                  {m.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <FieldDescription>
              {numbers === "random"
                ? regenerable > 0
                  ? `${regenerable} of ${available} questions get new numbers each time (same number of digits; subtraction stays biggest-first). Worded problems are unaffected and stay as printed.`
                  : "None of the selected questions support new numbers -- they'll come through as printed."
                : "The exact questions from the book, every time."}
            </FieldDescription>
          </Field>
        </FieldGroup>
      </CardContent>
      <CardFooter className="flex-wrap justify-between gap-3">
        <span className="text-sm text-muted-foreground">
          {available === 0 ? "Select at least one exercise." : `${available} questions available${count > 0 && available > count ? ` · ${count} will be asked` : ""}`}
        </span>
        <Button disabled={available === 0} onClick={() => onStart({ subjectId, chapterId, exerciseIds: selected, count, numbers })}>
          <Play />
          Start session
        </Button>
      </CardFooter>
    </Card>
  );
}
