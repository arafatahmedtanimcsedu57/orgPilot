'use client';

import { useEffect } from 'react';
import { Provider } from 'react-redux';

import type { AppProps } from 'next/app';

import { store } from '@/lib/redux/store';
import { setCredentials } from '@/lib/redux/features/authSlice';

function MyApp({ Component, pageProps }: AppProps) {
	useEffect(() => {
		const token = localStorage.getItem('auth-token');
		if (token)
			store.dispatch(
				setCredentials({
					token,
					user: {
						login: '',
						permissions: [],
					},
				}),
			);
	}, []);

	return (
		<Provider store={store}>
			<Component {...pageProps} />
		</Provider>
	);
}

export default MyApp;
