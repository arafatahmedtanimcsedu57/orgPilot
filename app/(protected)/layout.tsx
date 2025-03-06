import type React from 'react';
import { redirect } from 'next/navigation';

import { Navbar } from '@/components/layout/navbar';
import { AppSidebar } from '@/components/layout/sidebar';

import { getServerSession } from '@/lib/auth';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default async function ProtectedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getServerSession();

	if (!session) redirect('/login');

	return (
		<SidebarProvider>
			<div className="flex flex-1 min-h-screen overflow-x-hidden ">
				<AppSidebar />
				<SidebarInset className="flex flex-col w-full overflow-auto m-4 border border-muted-foreground/10 rounded-3xl bg-muted-foreground/10">
					<Navbar />
					<main className="flex-1 p-6 rounded-2xl mx-6 mb-6 border border-muted-foreground/10 bg-muted-foreground/10">
						{children}
					</main>
				</SidebarInset>
			</div>
		</SidebarProvider>
	);
}
