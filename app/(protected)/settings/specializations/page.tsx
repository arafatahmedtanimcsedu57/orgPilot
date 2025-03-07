import { StethoscopeIcon } from 'lucide-react';

import { SpecializationsTable } from '@/components/settings/specializations/specializationTable';
import { SettingsLayout } from '@/components/settings/settings-layout';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default function SpecializationsPage() {
	return (
		<SettingsLayout>
			<div className="space-y-6">
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbPage>Settings</BreadcrumbPage>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbLink href="/settings">Specializations</BreadcrumbLink>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>

				<Card className="rounded-2xl border border-muted-foreground/10 bg-muted-foreground/10">
					<CardHeader>
						<div className="flex gap-4 items-center">
							<StethoscopeIcon className="h-12 w-12" />
							<div className="flex flex-col gap-1">
								<CardTitle>Manage Specializations</CardTitle>
								<CardDescription>
									Create, update, and manage provider specializations
								</CardDescription>
							</div>
						</div>
					</CardHeader>

					<CardContent>
						<SpecializationsTable />
					</CardContent>
				</Card>
			</div>
		</SettingsLayout>
	);
}
