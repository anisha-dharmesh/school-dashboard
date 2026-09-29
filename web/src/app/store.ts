import { configureStore } from "@reduxjs/toolkit";
import dataReducer from "../features/data/dataSlice";
import hwReducer from "../features/hw/hwSlice";
import practiceReducer from "../features/practice/practiceSlice";
import studyReducer from "../features/study/studySlice";

export const store = configureStore({
  reducer: {
    data: dataReducer,
    hw: hwReducer,
    practice: practiceReducer,
    study: studyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
