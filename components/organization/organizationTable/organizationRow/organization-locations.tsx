'use client';

import { MapPinXInsideIcon } from 'lucide-react';

import { CreateLocationAction } from '../organization-table-action';
import { LocationItem } from '@/components/location/locationItem';

import type { Organization } from '@/types/organization';

export function OrganizationLocations({ org }: { org: Organization }) {
	return (
		<div className="shadow-xl bg-muted-foreground/10 p-6 rounded-2xl border border-muted-foreground/10 flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<h5 className="text-xs font-medium text-muted-foreground">
					Locations ({org.locations.length})
				</h5>

				<CreateLocationAction org={org} />
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
