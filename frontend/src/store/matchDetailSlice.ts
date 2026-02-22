import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { MatchDetail, MatchDetailResponse } from '../types/matches';

interface MatchDetailState {
	match: MatchDetail | null;
	loading: boolean;
	error: string | null;
}

const initialState: MatchDetailState = {
	match: null,
	loading: false,
	error: null,
};

export const fetchMatchDetail = createAsyncThunk<MatchDetail, number, { rejectValue: string }>(
	'matchDetail/fetchMatchDetail',
	async (matchId, { rejectWithValue }) => {
		try {
			const response = await axios.get<MatchDetailResponse>(`/api/matches/${matchId}`);
			return response.data.match;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const message = error.response?.data?.message || error.message || 'Failed to fetch match details';
				return rejectWithValue(message);
			}
			return rejectWithValue('Failed to fetch match details');
		}
	}
);

const matchDetailSlice = createSlice({
	name: 'matchDetail',
	initialState,
	reducers: {
		clearMatchDetail: (state) => {
			state.match = null;
			state.loading = false;
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchMatchDetail.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchMatchDetail.fulfilled, (state, action: PayloadAction<MatchDetail>) => {
				state.loading = false;
				state.match = action.payload;
			})
			.addCase(fetchMatchDetail.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || 'Something went wrong';
			});
	},
});

export const { clearMatchDetail } = matchDetailSlice.actions;
export default matchDetailSlice.reducer;
