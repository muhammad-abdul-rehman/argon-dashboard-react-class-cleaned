import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	name: '',
	id: null,
	token: null,
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUserLoginDetails: (state, action) => {
			state.name = action.payload.user_display_name;
			state.id = action.payload.user_email;
			state.token = action.payload.token;
		},
		setUserSignoutState: state => {
			state.name = null;
			state.id = null;
			state.token = null;
		},
	},
});

export const { setUserLoginDetails, setUserSignoutState } = userSlice.actions;

export const selectUserName = state => state.user.name;
export const selectUserId = state => state.user.id;
export const selectUserToken = state => state.user.token;

export default userSlice.reducer;
