import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { NavigationGuardProvider } from "./context/NavigationGuardContext";
import AppLayout from "./routes/AppLayout";
import UpcomingPage from "./pages/upcoming/UpcomingPage";
import TimetablePage from "./pages/timetable/TimetablePage";
import HwPage from "./pages/hw/HwPage";
import NotesPage from "./pages/notes/NotesPage";
import PracticePage from "./pages/practice/PracticePage";
import TablesPage from "./pages/tables/TablesPage";
import HistoryPage from "./pages/history/HistoryPage";
import StudyPage from "./pages/study/StudyPage";

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <NavigationGuardProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to="/upcoming" replace />} />
            <Route path="upcoming" element={<UpcomingPage />} />
            <Route path="timetable" element={<TimetablePage />} />
            <Route path="hw" element={<HwPage />} />
            <Route path="notes" element={<NotesPage />} />
            <Route path="notes/:subject" element={<NotesPage />} />
            <Route path="study" element={<StudyPage />} />
            <Route path="study/:subject" element={<StudyPage />} />
            <Route path="study/:subject/:chapter" element={<StudyPage />} />
            <Route path="practice" element={<PracticePage />} />
            <Route path="tables" element={<TablesPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="feed" element={<Navigate to="/history" replace />} />
          </Route>
        </Routes>
      </NavigationGuardProvider>
    </BrowserRouter>
  );
}
