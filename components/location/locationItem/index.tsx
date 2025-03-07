'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';

import { UpdateLocationAction } from '@/components/organization/organizationTable/organization-table-action';
import { LocationProviders } from '@/components/organization/organizationTable/organizationRow/location-providers';

import { cn } from '@/lib/utils';
import type { Location } from '@/types/organization';

export function LocationItem({ location }: { location: Location }) {
	const [expanded, setExpanded] = useState<boolean>(false);
	const toggleExpand = () => setExpanded((prev) => !prev);

	return (
		<div className="shadow-xl border border-muted-foreground/10 bg-muted-foreground/10 flex flex-col rounded-2xl overflow-hidden">
			<div
				className={cn(
					'flex items-center flex-wrap gap-6 p-6 w-full',
					expanded ? 'shadow-2xl bg-muted' : '',
				)}
			>
				<Button
					size="icon"
					variant="ghost"
					className="shadow-xl h-6 w-6 p-0 rounded-full border border-muted-foreground/10 bg-muted-foreground/10"
					onClick={toggleExpand}
				>
					{expanded ? (
						<ChevronDown className="h-3 w-3" />
					) : (
						<ChevronRight className="h-3 w-3" />
					)}
				</Button>

				<div className="flex justify-between items-center gap-6 flex-1 ">
					<div className="flex items-center gap-4">
						<div className="relative flex min-h-6 min-w-6 max-h-fit items-center justify-center rounded-full bg-muted/40">
							<MapPin className="h-4 w-4" />
						</div>

						<div className="flex flex-col flex-wrap">
							<div className="flex flex-wrap gap-2 items-center">
								<p className="text-sm font-semibold">{location.name}</p>
								<p className="text-xs font-normal text-muted-foreground">
									#{location.timeZone}
								</p>
								<StatusBadge
									type={location.activeStatus ? 'ACTIVE' : 'INACTIVE'}
								/>
							</div>

							<div className="flex items-center flex-wrap gap-2">
								<p className="text-xs">{location.address.detail}</p>
								<p className="text-muted-foreground text-xs">
									{location.address.city || '...'},{' '}
									{location.address.state || '...'}{' '}
								</p>
								<p className="text-muted-foreground text-xs">
									{location.address.zip}
								</p>
							</div>
						</div>
					</div>

					<UpdateLocationAction location={location} />
				</div>
			</div>

			{expanded && (
				<div className="bg-muted-foreground/10 flex-1">
					<LocationProviders location={location} />
				</div>
			)}
		</div>
	);
}
