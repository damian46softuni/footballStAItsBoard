import { configureStore } from '@reduxjs/toolkit';
import matchesReducer from './matchesSlice';
import matchDetailReducer from './matchDetailSlice';

export const store = configureStore({
  reducer: {
    matches: matchesReducer,
    matchDetail: matchDetailReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
