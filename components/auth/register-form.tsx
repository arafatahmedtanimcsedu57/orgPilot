'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

import { useRegisterMutation } from '@/lib/redux/services/authApi';

const formSchema = z
	.object({
		name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
		email: z.string().email({ message: 'Please enter a valid email address' }),
		password: z
			.string()
			.min(6, { message: 'Password must be at least 6 characters' }),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	});

export function RegisterForm() {
	const router = useRouter();
	const { toast } = useToast();
	const [register, { isLoading }] = useRegisterMutation();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			await register({
				name: values.name,
				email: values.email,
				password: values.password,
			}).unwrap();

			toast({
				title: 'Registration successful',
				description: 'Your account has been created successfully',
			});
			router.push('/login');
		} catch (error) {
			toast({
				variant: 'destructive',
				title: 'Registration failed',
				description: 'An error occurred during registration',
			});
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input placeholder="John Doe" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="email"
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
				<FormField
					control={form.control}
					name="confirmPassword"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Confirm Password</FormLabel>
							<FormControl>
								<Input type="password" placeholder="******" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex flex-col space-y-4">
					<Button type="submit" disabled={isLoading}>
						{isLoading ? 'Registering...' : 'Register'}
					</Button>
					<div className="text-center text-sm">
						Already have an account?{' '}
						<Link href="/login" className="text-primary underline">
							Login
						</Link>
					</div>
				</div>
			</form>
		</Form>
	);
}
