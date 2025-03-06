import {
	configureStore,
	isRejectedWithValue,
	type Middleware,
} from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import { authApi } from './services/authApi';
import { userApi } from './services/userApi';
import { dashboardApi } from './services/dashboardApi';
import { organizationsApi } from './services/organizationsApi';

import authReducer, { clearCredentials } from './features/authSlice';

const unauthorizedMiddleware: Middleware =
	({ dispatch }) =>
	(next) =>
	(action) => {
		if (isRejectedWithValue(action)) {
			const payload = action.payload as { status?: number }; // Type assertion

			if (payload.status === 401) {
				dispatch(clearCredentials());
			}
		}
		return next(action);
	};

export const store = configureStore({
	reducer: {
		auth: authReducer,
		[authApi.reducerPath]: authApi.reducer,
		[userApi.reducerPath]: userApi.reducer,
		[dashboardApi.reducerPath]: dashboardApi.reducer,
		[organizationsApi.reducerPath]: organizationsApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(
			authApi.middleware,
			userApi.middleware,
			dashboardApi.middleware,
			organizationsApi.middleware,
			unauthorizedMiddleware,
		),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
