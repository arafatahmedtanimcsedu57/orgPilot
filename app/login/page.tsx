'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { LoginForm } from '@/components/auth/login-form';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

import { useAppSelector } from '@/lib/redux/hooks';
import { selectIsAuthenticated } from '@/lib/redux/features/authSlice';

export default function LoginPage() {
	const router = useRouter();
	const isAuthenticated = useAppSelector(selectIsAuthenticated);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (isAuthenticated) router.push('/dashboard');
		else setIsLoading(false);
	}, [isAuthenticated, router]);

	if (isLoading) return <div>Loading...</div>;
	if (isAuthenticated) return null;

	return (
		<div className="container flex min-h-screen flex-col items-center justify-center">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-2xl">Login</CardTitle>
					<CardDescription>
						Enter your credentials to access your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<LoginForm />
				</CardContent>
			</Card>
		</div>
	);
}
