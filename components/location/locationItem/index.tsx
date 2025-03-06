'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';

import { UpdateLocationAction } from '@/components/organization/organizationTable/organization-table-action';
import { LocationDetails } from './location-details';

import { cn } from '@/lib/utils';
import type { Location } from '@/types/organization';

export function LocationItem({ location }: { location: Location }) {
	const [expanded, setExpanded] = useState<boolean>(false);
	const toggleExpand = () => setExpanded((prev) => !prev);

	return (
		<div
			className={cn(
				'shadow-xl rounded-xl border border-muted-foreground/10 bg-muted-foreground/10',
				expanded ? 'bg-muted' : '',
			)}
		>
			<div className="flex items-center justify-between p-3">
				<div className="flex items-center gap-2 flex-1">
					<Button
						variant="ghost"
						size="icon"
						className="shadow-xl h-6 w-6 p-0 rounded-full border border-muted-foreground/10 bg-muted-foreground/10"
						onClick={toggleExpand}
					>
						{expanded ? (
							<ChevronDown className="h-3 w-3" />
						) : (
							<ChevronRight className="h-3 w-3" />
						)}
					</Button>

					<MapPin className="h-6 w-6 text-primary" />

					<span className="">{location.name}</span>
				</div>
				<div className="flex items-center gap-2">
					<StatusBadge type={location.activeStatus ? 'ACTIVE' : 'INACTIVE'} />

					<UpdateLocationAction location={location} />
				</div>
			</div>

			{expanded && <LocationDetails location={location} />}
		</div>
	);
}
