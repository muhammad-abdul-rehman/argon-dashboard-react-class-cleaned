import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	name: '',
	id: null,
	token: null,
	user_nicename: null,
	user_email: null,
	is_admin: false,
	roles: [],
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUserLoginDetails: (state, action) => {
			state.name = action.payload.user_display_name;
			state.id = action.payload.user_id;
			state.user_nicename = action.payload.user_nicename;
			state.user_email = action.payload.user_email;
			state.is_admin = action.payload.is_admin;
			state.roles = action.payload.roles;
			state.token = action.payload.token;
		},
		setUserSignoutState: state => {
			state.name = null;
			state.id = null;
			state.user_email = null;
			state.is_admin = null;
			state.roles = null;
			state.user_nicename = null;
			state.token = null;
		},
	},
});

export const { setUserLoginDetails, setUserSignoutState } = userSlice.actions;

export const selectUserName = state => state.user.name;
export const selectUserId = state => state.user.id;
export const selectUserToken = state => state.user.token;

export default userSlice.reducer;
