'use client';

import { StethoscopeIcon } from 'lucide-react';

import { ProviderItem } from '@/components/provider/providerItem';
import { CreateProviderAction } from '@/components/organization/organizationTable/organization-table-action';

import type { Location } from '@/types/organization';

export function LocationProviders({ location }: { location: Location }) {
	return (
		<div className="shadow-xl bg-muted-foreground/10 p-6 rounded-2xl border border-muted-foreground/10 flex-1">
			<div className="flex items-center justify-between">
				<h5 className="text-xs font-medium text-muted-foreground">
					Providers ({location.providers.length})
				</h5>

				<CreateProviderAction location={location} />
			</div>
			<div className="mt-2 flex flex-col gap-2">
				{location.providers.map((provider: any) => (
					<ProviderItem
						key={provider.id}
						provider={provider}
						location={location}
					/>
				))}
				{location.providers.length === 0 && (
					<div className="text-sm text-muted-foreground flex items-center gap-4">
						<StethoscopeIcon /> No Provider assigned
					</div>
				)}
			</div>
		</div>
	);
}
