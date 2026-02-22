import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    // Slices will be added here as features are developed
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
