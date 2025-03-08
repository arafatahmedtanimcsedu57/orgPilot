'use client';

import { InfoIcon, MapPinXInsideIcon } from 'lucide-react';

import { CreateLocationAction } from '../organization-table-action';
import { LocationItem } from '@/components/location/locationItem';

import type { Organization } from '@/types/organization';

export function OrganizationLocations({ org }: { org: Organization }) {
	return (
		<div className="flex-1 shadow-xl bg-muted-foreground/10 p-6 rounded-2xl border border-muted-foreground/10 flex flex-col gap-6">
			<div className="flex items-center gap-6 justify-between">
				<h5 className="text-xs font-medium text-muted-foreground">Locations</h5>

				<div className="flex gap-4">
					{!org.locations.length ? (
						<span className="text-xs inline-flex gap-1 items-center text-destructive ">
							<InfoIcon className="h-3 w-3" /> Location is not found
						</span>
					) : org.locations.length > 1 ? (
						<span className="text-xs inline-flex gap-1 items-center">
							<InfoIcon className="h-3 w-3" />
							This organization is located in {org.locations.length} different
							places
						</span>
					) : (
						<span className="text-xs inline-flex gap-1 items-center text-orange-600">
							<InfoIcon className="h-3 w-3" />
							This organization is located in a single place{' '}
						</span>
					)}

					<CreateLocationAction org={org} />
				</div>
			</div>

			<div className="flex flex-col gap-2 ">
				{org.locations.map((location: any) => (
					<LocationItem key={location.id} location={location} />
				))}
				{org.locations.length === 0 && (
					<div className="text-sm text-muted-foreground flex items-center gap-4">
						<MapPinXInsideIcon className="min-h-6 min-w-6 text-muted-foreground" />
						No Location assigned
					</div>
				)}
			</div>
		</div>
	);
}
