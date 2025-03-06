'use client';
import { useForm } from 'react-hook-form';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { useLoginMutation } from '@/lib/redux/services/authApi';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setCredentials } from '@/lib/redux/features/authSlice';

const formSchema = z.object({
	login: z.string().email({ message: 'Please enter a valid email address' }),
	password: z
		.string()
		.min(6, { message: 'Password must be at least 6 characters' }),
});

export function LoginForm() {
	const router = useRouter();
	const { toast } = useToast();
	const [login, { isLoading }] = useLoginMutation();
	const dispatch = useAppDispatch();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			login: '',
			password: '',
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const response = await login(values).unwrap();

			if (response.success) {
				// Update Redux store with the token and user info
				dispatch(
					setCredentials({
						user: {
							login: values.login,
							permissions: response.data.permissions,
						},
						token: response.data.token,
					}),
				);

				// Set the token in a cookie
				document.cookie = `auth-token=${response.data.token}; path=/; max-age=86400; secure; samesite=strict`;

				toast({
					title: 'Login successful',
					description:
						response.message || 'You have been logged in successfully',
				});
				router.push('/dashboard');
			} else {
				toast({
					variant: 'destructive',
					title: 'Login failed',
					description:
						response.message || 'Please check your credentials and try again',
				});
			}
		} catch (error: any) {
			toast({
				variant: 'destructive',
				title: 'Login failed',
				description:
					error?.data?.message || 'Please check your credentials and try again',
			});
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="login"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input placeholder="email@example.com" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input type="password" placeholder="******" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex flex-col space-y-4">
					<Button type="submit" disabled={isLoading}>
						{isLoading ? 'Logging in...' : 'Login'}
					</Button>
					<div className="text-center text-sm">
						Don&apos;t have an account?{' '}
						<Link href="/register" className="text-primary underline">
							Register
						</Link>
					</div>
				</div>{' '}
			</form>
		</Form>
	);
}
