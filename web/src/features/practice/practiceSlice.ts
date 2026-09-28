import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { PRACTICE_HISTORY_KEY, PRACTICE_HISTORY_LIMIT } from "../../lib/constants";
import type { PracticeSession } from "../../practice/types";

interface PracticeState {
  /** Newest first. */
  sessions: PracticeSession[];
}

function load(): PracticeSession[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(PRACTICE_HISTORY_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(sessions: PracticeSession[]) {
  try {
    localStorage.setItem(PRACTICE_HISTORY_KEY, JSON.stringify(sessions));
  } catch {
    // localStorage unavailable (private browsing, etc.) -- history just
    // won't persist across reloads.
  }
}

const practiceSlice = createSlice({
  name: "practice",
  initialState: { sessions: load() } as PracticeState,
  reducers: {
    addSession(state, action: PayloadAction<PracticeSession>) {
      state.sessions = [action.payload, ...state.sessions].slice(0, PRACTICE_HISTORY_LIMIT);
      save(state.sessions);
    },
    clearHistory(state) {
      state.sessions = [];
      save(state.sessions);
    },
  },
});

export const { addSession, clearHistory } = practiceSlice.actions;
export default practiceSlice.reducer;
