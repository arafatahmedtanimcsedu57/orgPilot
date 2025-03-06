'use client';

import type React from 'react';
import { useEffect } from 'react';

import { useAppDispatch } from '@/lib/redux/hooks';
import { initializeAuth } from '@/lib/redux/features/authSlice';

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(initializeAuth());
	}, [dispatch]);

	return <>{children}</>;
}
