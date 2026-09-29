import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { StudyChapter } from "../../study/types";

type Status = "loading" | "succeeded" | "failed";

interface StudyState {
  /** Keyed "<subject-slug>/<chapter-slug>". */
  chapters: Record<string, { status: Status; chapter?: StudyChapter; error?: string }>;
}

const initialState: StudyState = { chapters: {} };

export const studyKey = (subjectSlug: string, chapterSlug: string) => `${subjectSlug}/${chapterSlug}`;

// A chapter is just a JSON file at data/study/<subject>/<chapter>.json --
// adding one is dropping in that file and re-running build_study_index.py.
export const fetchStudyChapter = createAsyncThunk<StudyChapter, string>("study/fetchChapter", async (key) => {
  const res = await fetch(`${import.meta.env.BASE_URL}data/study/${key}.json?_=${Date.now()}`);
  // A missing file can come back as 200 with the SPA's index.html, so check
  // the content-type too or it surfaces as a JSON-parse error.
  if (!res.ok || !(res.headers.get("content-type") ?? "").includes("json")) {
    throw new Error(`No study page found for "${key}"`);
  }
  return res.json() as Promise<StudyChapter>;
});

const studySlice = createSlice({
  name: "study",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudyChapter.pending, (state, action) => {
        state.chapters[action.meta.arg] = { status: "loading" };
      })
      .addCase(fetchStudyChapter.fulfilled, (state, action: PayloadAction<StudyChapter, string, { arg: string }>) => {
        state.chapters[action.meta.arg] = { status: "succeeded", chapter: action.payload };
      })
      .addCase(fetchStudyChapter.rejected, (state, action) => {
        state.chapters[action.meta.arg] = { status: "failed", error: action.error.message };
      });
  },
});

export default studySlice.reducer;
