'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { OrganizationTable } from '@/components/organization/organizationTable';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbPage,
} from '@/components/ui/breadcrumb';

import { useAppSelector } from '@/lib/redux/hooks';
import { selectIsAuthenticated } from '@/lib/redux/features/authSlice';
import { HospitalIcon } from 'lucide-react';

export default function DashboardPage() {
	const [isLoading, setIsLoading] = useState(true);

	const router = useRouter();
	const isAuthenticated = useAppSelector(selectIsAuthenticated);

	useEffect(() => {
		if (!isAuthenticated && !isLoading) router.push('/login');
		else if (isAuthenticated) setIsLoading(false);
	}, [isAuthenticated, isLoading, router]);

	if (isLoading) return <div>Loading...</div>;
	if (!isAuthenticated) return null;

	return (
		<div className="space-y-6">
			<Breadcrumb>
				<BreadcrumbItem>
					<BreadcrumbPage>Dashboard</BreadcrumbPage>
				</BreadcrumbItem>
			</Breadcrumb>

			<Card className="rounded-2xl border border-muted-foreground/10 bg-muted-foreground/10">
				<CardHeader>
					<div className="flex gap-4 items-center">
						<HospitalIcon className="h-12 w-12" />
						<div className="flex flex-col gap-1">
							<CardTitle>Organizations</CardTitle>
							<CardDescription>List of all organizations</CardDescription>
						</div>
					</div>
				</CardHeader>

				<CardContent>
					<OrganizationTable />
				</CardContent>
			</Card>
		</div>
	);
}
