import { ProfileForm } from '@/components/profile/profile-form';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

export default function ProfilePage() {
	return (
		<div className="space-y-6">
			<h1 className="text-3xl font-bold">Profile</h1>
			<Card>
				<CardHeader>
					<CardTitle>Personal Information</CardTitle>
					<CardDescription>Update your personal details</CardDescription>
				</CardHeader>
				<CardContent>
					<ProfileForm />
				</CardContent>
			</Card>
		</div>
	);
}
