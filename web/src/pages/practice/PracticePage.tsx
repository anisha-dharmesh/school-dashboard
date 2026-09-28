import { useState } from "react";
import { collectItems, findChapter, findSubject } from "../../practice/registry";
import { drawQueue } from "../../practice/session";
import type { PracticeItem, PracticeSession } from "../../practice/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import HistoryPanel from "./HistoryPanel";
import SessionPanel from "./SessionPanel";
import SetupPanel, { type Scope } from "./SetupPanel";
import SummaryPanel from "./SummaryPanel";

type View =
  | { name: "setup"; scope?: Scope }
  | { name: "running"; scope: Scope; queue: PracticeItem[] }
  | { name: "done"; scope: Scope; session: PracticeSession | null };

export default function PracticePage() {
  const [tab, setTab] = useState("practice");
  const [view, setView] = useState<View>({ name: "setup" });

  function start(scope: Scope) {
    const subject = findSubject(scope.subjectId);
    const chapter = findChapter(subject, scope.chapterId);
    if (!subject || !chapter) return;
    const queue = drawQueue(collectItems(subject, chapter, scope.exerciseIds), scope.count, scope.numbers);
    if (queue.length > 0) setView({ name: "running", scope, queue });
  }

  return (
    // The session lives in this component, not the tab panel, so peeking at
    // History mid-session doesn't lose the question you were on.
    <Tabs value={tab} onValueChange={setTab} className="w-full flex-1">
      <TabsList variant="line">
        <TabsTrigger value="practice">Practice</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>

      <TabsContent value="practice" className="flex flex-col">
        {view.name === "setup" && <SetupPanel initial={view.scope} onStart={start} />}
        {view.name === "running" && (
          <SessionPanel
            subject={findSubject(view.scope.subjectId)!}
            chapter={findChapter(findSubject(view.scope.subjectId), view.scope.chapterId)!}
            queue={view.queue}
            onFinish={(session) => setView({ name: "done", scope: view.scope, session })}
          />
        )}
        {view.name === "done" && (
          <SummaryPanel
            session={view.session}
            onAgain={() => start(view.scope)}
            onNew={() => setView({ name: "setup", scope: view.scope })}
            onHistory={() => setTab("history")}
          />
        )}
      </TabsContent>

      <TabsContent value="history">
        <HistoryPanel />
      </TabsContent>
    </Tabs>
  );
}
