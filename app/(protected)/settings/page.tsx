import { SettingsLayout } from '@/components/settings/settings-layout';
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
				<h1 className="text-3xl font-bold">Settings</h1>
				<Card>
					<CardHeader>
						<CardTitle>System Settings</CardTitle>
						<CardDescription>
							Manage your system settings and configurations
						</CardDescription>
					</CardHeader>
					<CardContent>
						<p>Select a settings category from the sidebar to get started.</p>
					</CardContent>
				</Card>
			</div>
		</SettingsLayout>
	);
}
