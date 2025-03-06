import { SpecializationsTable } from '@/components/settings/specializations/specializations-table';
import { SettingsLayout } from '@/components/settings/settings-layout';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

export default function SpecializationsPage() {
	return (
		<SettingsLayout>
			<div className="space-y-6">
				<h1 className="text-3xl font-bold">Specializations</h1>
				<Card>
					<CardHeader>
						<CardTitle>Manage Specializations</CardTitle>
						<CardDescription>
							Create, update, and manage provider specializations
						</CardDescription>
					</CardHeader>
					<CardContent>
						<SpecializationsTable />
					</CardContent>
				</Card>
			</div>
		</SettingsLayout>
	);
}
