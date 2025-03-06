'use client';
import { Stethoscope, BadgeInfo } from 'lucide-react';

import { StatusBadge } from '@/components/ui/status-badge';
import { UpdateProviderAction } from '../../organization/organizationTable/organization-table-action';

import type { Provider, Location } from '@/types/organization';

export function ProviderItem({
	provider,
	location,
}: {
	provider: Provider;
	location: Location;
}) {
	return (
		<div className="shadow-xl bg-muted-foreground/10 p-6 rounded-2xl border border-muted-foreground/10 flex-1">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Stethoscope className="h-4 w-4 text-primary" />
					<span className="font-medium">{provider.name}</span>
				</div>
				<div className="flex items-center gap-2">
					<StatusBadge type={provider.activeStatus ? 'ACTIVE' : 'INACTIVE'} />

					<UpdateProviderAction provider={provider} location={location} />
				</div>
			</div>

			<div className="pl-6 text-xs flex flex-col gap-1">
				<p className="text-muted-foreground">Email: {provider.email}</p>
				<p className="text-muted-foreground">Phone: {provider.phone}</p>
				{provider.specialization && (
					<div className="flex items-center gap-1">
						<BadgeInfo className="h-3 w-3 text-muted-foreground" />
						<span>
							Specialization: {provider.specialization.name || 'Not specified'}
						</span>
					</div>
				)}
			</div>
		</div>
	);
}
