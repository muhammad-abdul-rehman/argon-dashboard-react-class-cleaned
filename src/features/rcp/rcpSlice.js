import { createSlice } from '@reduxjs/toolkit';
const initialState = {
	base_url: '/wp-json/rcp/v1/',
	auth_url: '/wp-json/jwt-auth/v1/', // for testing purposes only.
	base_wp_url: '/wp-json/wp/v2/',
	route: '',
	proxy_domain: 'http://localhost:8010/proxy',
	domain: 'https://atpi-dev14.grafton.digital', // for testing purposes only.
};
const rcpSlice = createSlice({
	name: 'rcp_url',
	initialState,
	reducers: {
		setRoute: (state, { payload }) => {
			state.route = payload.route;
		},
	},
});
export const setRoute = rcpSlice.action;
export const selectRCPUrl = state =>
	state.domain + state.base_url + state.route;
export const selectAuthUrl = state => state.token_url;
export default rcpSlice.reducer;
