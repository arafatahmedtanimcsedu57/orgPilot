import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '../services/authApi';

import type { User } from '@/types/user';

interface AuthState {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
}

const initialState: AuthState = {
	user: null,
	token: null,
	isAuthenticated: false,
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setCredentials: (
			state,
			action: PayloadAction<{
				user: User;
				token: string;
			}>,
		) => {
			state.user = action.payload.user;
			state.token = action.payload.token;
			state.isAuthenticated = true;
			if (typeof window !== 'undefined')
				localStorage.setItem('auth-token', action.payload.token);
		},

		clearCredentials: (state) => {
			state.user = null;
			state.token = null;
			state.isAuthenticated = false;
			if (typeof window !== 'undefined') {
				localStorage.removeItem('auth-token');
			}
		},

		initializeAuth: (state) => {
			const token =
				typeof window !== 'undefined'
					? localStorage.getItem('auth-token')
					: null;
			if (token) {
				state.token = token;
				state.isAuthenticated = true;
				// Note: We don't have user info here, so we'll need to fetch it separately
			}
		},
	},

	extraReducers: (builder) => {
		builder
			.addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
				if (action.payload.success) {
					state.token = action.payload.data.token;
					state.isAuthenticated = true;
					state.user = {
						login: action.meta.arg.originalArgs.login,
						permissions: action.payload.data.permissions || [],
					};
					if (typeof window !== 'undefined')
						localStorage.setItem('auth-token', action.payload.data.token);
				}
			})
			.addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
				state.user = null;
				state.token = null;
				state.isAuthenticated = false;
				if (typeof window !== 'undefined')
					localStorage.removeItem('auth-token');
			});
	},
});

export const { setCredentials, clearCredentials, initializeAuth } =
	authSlice.actions;

export const selectIsAuthenticated = (state: { auth: AuthState }) =>
	state.auth.isAuthenticated && !!state.auth.token;

export default authSlice.reducer;
