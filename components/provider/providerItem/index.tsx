'use client';
import {
	Stethoscope,
	BadgeInfo,
	MailIcon,
	PhoneCall,
	MailCheck,
} from 'lucide-react';

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
		<div className="shadow-xl border border-muted-foreground/10 bg-muted-foreground/10 flex flex-col rounded-2xl overflow-hidden">
			<div className="flex items-center flex-wrap gap-6 p-6 w-full">
				<></>

				<div className="flex justify-between items-center gap-6 flex-1 ">
					<div className="flex items-center gap-4">
						<div className="relative flex min-h-6 min-w-6 max-h-fit items-center justify-center rounded-full bg-muted/40">
							<Stethoscope className="h-3 w-3" />
						</div>

						<div className="flex flex-col flex-wrap">
							<div className="flex flex-wrap gap-2 items-center">
								<p className="text-sm font-semibold">{provider.name}</p>

								{provider.specialization && (
									<div className="flex items-center gap-1">
										<BadgeInfo className="h-3 w-3 text-muted-foreground" />
										<p className="text-xs font-normal text-muted-foreground">
											{provider.specialization.name || 'Not specified'}
										</p>
										<StatusBadge
											type={provider.activeStatus ? 'ACTIVE' : 'INACTIVE'}
										/>
									</div>
								)}
							</div>

							<div className="flex items-center flex-wrap gap-2">
								{provider.email ? (
									<div className="text-muted-foreground flex gap-1 items-center">
										<MailCheck className="h-3 w-3" />
										<p className=" text-xs">{provider.email}</p>
									</div>
								) : (
									<></>
								)}
								{provider.phone ? (
									<div className="text-muted-foreground flex gap-1 items-center">
										<PhoneCall className="h-3 w-3" />
										<p className="text-xs">{provider.phone}</p>
									</div>
								) : (
									<></>
								)}
							</div>
						</div>
					</div>
					<UpdateProviderAction provider={provider} location={location} />

					<></>
				</div>
			</div>
		</div>
	);
}
