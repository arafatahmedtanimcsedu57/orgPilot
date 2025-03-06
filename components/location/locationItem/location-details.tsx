'use client';

import { LocationProviders } from '@/components/organization/organizationTable/organizationRow/location-providers';

import type { Location } from '@/types/organization';

export function LocationDetails({ location }: { location: Location }) {
	return (
		<div className="p-6 bg-muted-foreground/10 rounded-b-2xl">
			<div className="grid gap-4">
				<div className="">
					<h6 className="text-xs font-medium text-muted-foreground">Address</h6>
					<div className="mt-2 text-sm">
						<p>{location.address.detail}</p>
						<p className="text-muted-foreground text-xs">
							{location.address.city || '...'},{' '}
							{location.address.state || '...'}{' '}
						</p>
						<p className="text-muted-foreground text-xs">
							{location.address.zip}
						</p>
						<p className="text-xs">{location.timeZone}</p>
					</div>
				</div>

				<LocationProviders location={location} />
			</div>
		</div>
	);
}
