'use client';

import { LocationProviders } from '@/components/organization/organizationTable/organizationRow/location-providers';

import type { Location } from '@/types/organization';

export function LocationDetails({ location }: { location: Location }) {
	return (
		<div className="p-6 bg-muted-foreground/10 rounded-b-2xl">
			<div className="grid gap-4">
				<LocationProviders location={location} />
			</div>
		</div>
	);
}
