import { configureStore } from "@reduxjs/toolkit";
import dataReducer from "../features/data/dataSlice";
import hwReducer from "../features/hw/hwSlice";
import practiceReducer from "../features/practice/practiceSlice";
import revisionReducer from "../features/revision/revisionSlice";

export const store = configureStore({
  reducer: {
    data: dataReducer,
    hw: hwReducer,
    practice: practiceReducer,
    revision: revisionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
