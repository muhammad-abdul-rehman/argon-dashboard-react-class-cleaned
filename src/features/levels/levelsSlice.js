import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	levels: [],
};

const levelsSlice = createSlice({
	name: 'levels',
	initialState,
	reducers: {
		setMembershipLevels: (state, { payload }) => {
			state.levels = payload;
		},
	},
});

export const { setMembershipLevels } = levelsSlice.actions;

export const selectMembershipLevels = state => state.levels;

export default levelsSlice.reducer;
