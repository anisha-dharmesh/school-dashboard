import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  EventsCalendar,
  Holidays,
  LastUpdated,
  Notice,
  PortionSchedules,
  Timetable,
} from "../../types";
import type { StudyIndex } from "../../study/types";
import { nameBareChapters } from "../../lib/study";

interface DashboardData {
  notices: Notice[];
  portionSchedules: PortionSchedules;
  studyIndex: StudyIndex;
  holidays: Holidays;
  eventsCalendar: EventsCalendar;
  lastUpdated: LastUpdated | null;
  timetable: Timetable | null;
}

interface DataState extends DashboardData {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const EMPTY_STUDY_INDEX: StudyIndex = { subjects: [] };
const EMPTY_HOLIDAYS: Holidays = { holidays: [], vacations: [] };
const EMPTY_EVENTS_CALENDAR: EventsCalendar = { events: [], ptm: [], exam_windows: [] };

const dataDir = `${import.meta.env.BASE_URL}data`;

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${dataDir}/${path}?_=${Date.now()}`);
  if (!res.ok) throw new Error(`${path}: ${res.status}`);
  return res.json() as Promise<T>;
}

/** Same shape as the old fallback-to-default `.catch()` in every non-notices
 * fetch: a missing/broken optional data file degrades just that section
 * instead of failing the whole load. */
async function fetchJsonOr<T>(path: string, fallback: T): Promise<T> {
  try {
    return await fetchJson<T>(path);
  } catch {
    return fallback;
  }
}

export const fetchDashboardData = createAsyncThunk<DashboardData>("data/fetchDashboardData", async () => {
  const [notices, portionSchedules, studyIndex, holidays, eventsCalendar, lastUpdated, timetable] = await Promise.all([
    fetchJson<Notice[]>("notices.json"),
    fetchJsonOr<PortionSchedules>("portion_schedules.json", {}),
    fetchJsonOr<StudyIndex>("study/index.json", EMPTY_STUDY_INDEX),
    fetchJsonOr<Holidays>("holidays.json", EMPTY_HOLIDAYS),
    fetchJsonOr<EventsCalendar>("events_calendar.json", EMPTY_EVENTS_CALENDAR),
    fetchJsonOr<LastUpdated | null>("last_updated.json", null),
    fetchJsonOr<Timetable | null>("timetable.json", null),
  ]);

  return {
    notices: nameBareChapters([...notices], studyIndex, portionSchedules).sort(
      (a, b) => parseDMYms(b.posted_date) - parseDMYms(a.posted_date),
    ),
    portionSchedules,
    studyIndex,
    holidays: { ...EMPTY_HOLIDAYS, ...holidays },
    eventsCalendar: { ...EMPTY_EVENTS_CALENDAR, ...eventsCalendar },
    lastUpdated,
    timetable,
  };
});

function parseDMYms(d: string): number {
  const [dd, mm, yyyy] = d.split("-").map(Number);
  return new Date(yyyy, mm - 1, dd).getTime();
}

const initialState: DataState = {
  notices: [],
  portionSchedules: {},
  studyIndex: EMPTY_STUDY_INDEX,
  holidays: EMPTY_HOLIDAYS,
  eventsCalendar: EMPTY_EVENTS_CALENDAR,
  lastUpdated: null,
  timetable: null,
  status: "idle",
  error: null,
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action: PayloadAction<DashboardData>) => {
        state.status = "succeeded";
        Object.assign(state, action.payload);
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to load notices.json";
      });
  },
});

export default dataSlice.reducer;
