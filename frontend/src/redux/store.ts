import { configureStore } from "@reduxjs/toolkit";
import standardsReducer from "./standardsSlice";

export const store = configureStore({
  reducer: {
    standards: standardsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;