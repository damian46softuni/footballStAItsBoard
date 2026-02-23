import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { Match, MatchesResponse } from '../types/matches';

interface MatchesState {
  matches: Match[];
  filters: Record<string, unknown>;
  resultSet: Record<string, unknown>;
  loading: boolean;
  error: string | null;
}

const initialState: MatchesState = {
  matches: [],
  filters: {},
  resultSet: {},
  loading: false,
  error: null,
};

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

export const fetchMatches = createAsyncThunk('matches/fetchAll', async () => {
  const { data } = await axios.get<MatchesResponse>(`${API_BASE_URL}/api/matches`);
  return data;
});

const matchesSlice = createSlice({
  name: 'matches',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.loading = false;
        state.matches = action.payload.matches;
        state.filters = action.payload.filters;
        state.resultSet = action.payload.resultSet;
      })
      .addCase(fetchMatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch matches';
      });
  },
});

export default matchesSlice.reducer;