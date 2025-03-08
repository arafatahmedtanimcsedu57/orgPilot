'use client';

import { InfoIcon, StethoscopeIcon } from 'lucide-react';

import { ProviderItem } from '@/components/provider/providerItem';
import { CreateProviderAction } from '@/components/organization/organizationTable/organization-table-action';

import type { Location } from '@/types/organization';

export function LocationProviders({ location }: { location: Location }) {
	return (
		<div className="p-6 flex flex-col gap-6 flex-wrap justify-between">
			<div className="shadow-xl bg-muted-foreground/10 p-6 rounded-2xl border border-muted-foreground/10 flex flex-col gap-6">
				<div className="flex items-center justify-between">
					<h5 className="text-xs font-medium text-muted-foreground">
						Providers
					</h5>

					<div className="flex gap-4">
						{!location.providers.length ? (
							<span className="text-xs inline-flex gap-1 items-center text-destructive ">
								<InfoIcon className="h-3 w-3" /> Providers are not found
							</span>
						) : location.providers.length > 1 ? (
							<span className="text-xs inline-flex gap-1 items-center">
								<InfoIcon className="h-3 w-3" />
								This located has {location.providers.length} providers
							</span>
						) : (
							<span className="text-xs inline-flex gap-1 items-center text-orange-600">
								<InfoIcon className="h-3 w-3" />
								There is a single provider here
							</span>
						)}
						<CreateProviderAction location={location} />
					</div>
				</div>

				<div className="flex flex-col gap-2 ">
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
		</div>
	);
}
