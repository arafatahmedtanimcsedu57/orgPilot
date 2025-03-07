import { MonitorCogIcon } from 'lucide-react';

import { SettingsLayout } from '@/components/settings/settings-layout';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

export default function SettingsPage() {
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
							<BreadcrumbLink href="/settings">General</BreadcrumbLink>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>{' '}
				<Card>
					<CardHeader>
						<div className="flex gap-4 items-center">
							<MonitorCogIcon className="h-12 w-12" />
							<div className="flex flex-col gap-1">
								<CardTitle>System Settings</CardTitle>
								<CardDescription>
									Manage your system settings and configurations
								</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<p>Select a settings category from the sidebar to get started.</p>
					</CardContent>
				</Card>
			</div>
		</SettingsLayout>
	);
}
