import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchContents } from '../services/dataAPI';

export const loadContents = createAsyncThunk('contents/load', async () => {
  return await fetchContents();
});

const contentsSlice = createSlice({
  name: 'contents',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadContents.pending, (s) => { s.status = 'loading'; })
      .addCase(loadContents.fulfilled, (s, a) => { s.status = 'succeeded'; s.items = a.payload; })
      .addCase(loadContents.rejected, (s, a) => { s.status = 'failed'; s.error = a.error.message; });
  },
});

export default contentsSlice.reducer;
