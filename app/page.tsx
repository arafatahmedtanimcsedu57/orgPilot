import { redirect } from 'next/navigation';
import Link from 'next/link';

import { isAuthenticated } from '@/lib/auth';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

export default async function Home() {
	const authenticated = await isAuthenticated();

	if (authenticated) redirect('/dashboard');

	return (
		<div className="container min-h-screen flex flex-col items-center justify-center">
			<Card className="w-full max-w-2xl">
				<CardHeader>
					<CardTitle className="text-2xl">OrgPilot</CardTitle>
					<CardDescription>
						Your All-in-One Solution for Organization Management.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<p>
						OrgPilot is a powerful admin portal that simplifies organization
						management. Effortlessly create, update, and oversee organizations,
						locations, providers, and appointments—all in one seamless platform.
						🚀
					</p>
				</CardContent>
				<CardFooter className="flex justify-between">
					<div></div>
					<Button variant="outline" asChild>
						<Link href="/login">Login</Link>
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
