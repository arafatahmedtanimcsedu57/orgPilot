'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, ChevronRight, Building2, InfoIcon } from 'lucide-react';

import { OrganizationDetails } from './organization-details';
import { UpdateOrganizationAction } from '../organization-table-action';

import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';

import { cn } from '@/lib/utils';
import type { Organization } from '@/types/organization';
import { OrganizationAppointments } from './organization-appointments';

export function OrganizationRow({ org }: { org: Organization }) {
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
					className="h-8 w-8 p-0 rounded-full border border-muted-foreground/10 bg-muted-foreground/10 shadow-xl"
					onClick={toggleExpand}
				>
					{expanded ? (
						<ChevronDown className="h-4 w-4" />
					) : (
						<ChevronRight className="h-4 w-4" />
					)}
				</Button>

				<div className="flex justify-between items-center gap-6 flex-1 ">
					<div className="flex items-center gap-2">
						{org.multimediaFile ? (
							<div className="relative min-h-8 min-w-8 max-h-fit overflow-hidden rounded-full">
								<Image
									className="object-cover"
									fill
									alt={org.name}
									src={`/api/multimedia/${org.multimediaFile.id}`}
								/>
							</div>
						) : (
							<div className="relative flex min-h-8 min-w-8 max-h-fit items-center justify-center rounded-full bg-muted">
								<Building2 className="h-5 w-5 text-muted-foreground" />
							</div>
						)}

						<div className="flex flex-col flex-wrap">
							<div className="flex flex-wrap gap-2 items-center">
								<p className="text-sm font-semibold">{org.name}</p>
								<p className="text-xs font-normal text-muted-foreground">
									#{org.id}
								</p>
								<StatusBadge type={org.active ? 'ACTIVE' : 'INACTIVE'} />
							</div>
							{org.locations.length ? (
								<div className="flex text-xs font-light items-center gap-1">
									{org.locations.length > 1 ? (
										<span className="inline-flex items-center gap-1">
											<InfoIcon className="h-3 w-3" /> This organization is
											located in {org.locations.length} different places
										</span>
									) : (
										<span className="text-muted-foreground inline-flex items-center gap-1">
											<InfoIcon className="h-3 w-3" />
											This organization is located in a single place
										</span>
									)}
								</div>
							) : (
								<></>
							)}
						</div>
					</div>

					<UpdateOrganizationAction org={org} />
				</div>
			</div>

			{expanded && (
				<div className="bg-muted-foreground/10 flex-auto">
					<div className="flex flex-wrap p-6 gap-6">
						<OrganizationDetails org={org} />

						<OrganizationAppointments org={org} />
					</div>
				</div>
			)}
		</div>
	);
}
