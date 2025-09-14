import { configureStore } from '@reduxjs/toolkit';
import contentsReducer from '../slice/contentsSlice';

export const store = configureStore({
  reducer: {
    contents: contentsReducer,
  },
});
