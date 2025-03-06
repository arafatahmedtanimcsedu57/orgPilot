'use client';

import { Users, ShoppingCart, DollarSign, Activity } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { useGetStatsQuery } from '@/lib/redux/services/dashboardApi';

export function DashboardStats() {
	const { data, isLoading } = useGetStatsQuery();

	if (isLoading) {
		return (
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<Card key={i}>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								<Skeleton className="h-4 w-24" />
							</CardTitle>
							<Skeleton className="h-4 w-4 rounded-full" />
						</CardHeader>
						<CardContent>
							<Skeleton className="h-7 w-16" />
							<Skeleton className="mt-2 h-4 w-full" />
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	const stats = [
		{
			title: 'Total Users',
			value: data?.users || 0,
			icon: Users,
			description: 'Total registered users',
		},
		{
			title: 'Total Orders',
			value: data?.orders || 0,
			icon: ShoppingCart,
			description: 'Orders this month',
		},
		{
			title: 'Revenue',
			value: `$${data?.revenue || 0}`,
			icon: DollarSign,
			description: 'Revenue this month',
		},
		{
			title: 'Active Sessions',
			value: data?.activeSessions || 0,
			icon: Activity,
			description: 'Current active users',
		},
	];

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			{stats.map((stat, index) => (
				<Card key={index}>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
						<stat.icon className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stat.value}</div>
						<p className="text-xs text-muted-foreground">{stat.description}</p>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
