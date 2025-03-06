'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, ChevronRight, MapPin, Building2 } from 'lucide-react';

import { OrganizationDetails } from './organization-details';
import { UpdateOrganizationAction } from '../organization-table-action';

import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';

import { cn } from '@/lib/utils';
import { formatDate } from '@/utils/date-format';
import type { Organization } from '@/types/organization';

export function OrganizationRow({ org }: { org: Organization }) {
	const [expanded, setExpanded] = useState<boolean>(false);
	const toggleExpand = () => setExpanded((prev) => !prev);

	return (
		<React.Fragment>
			<TableRow
				className={cn(
					'border-b border-muted-foreground/10',
					expanded ? 'shadow-2xl  bg-muted' : '',
				)}
			>
				<TableCell>
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
				</TableCell>

				<TableCell className="whitespace-nowrap">
					<div className="flex items-center gap-2">
						{org.multimediaFile ? (
							<div className="relative h-10 w-10 overflow-hidden rounded-full">
								<Image
									className="object-cover"
									fill
									alt={org.name}
									src={`/api/multimedia/${org.multimediaFile.id}`}
								/>
							</div>
						) : (
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
								<Building2 className="h-5 w-5 text-muted-foreground" />
							</div>
						)}

						<div>
							<p className="text-sm font-semibold">{org.name}</p>
							<p className="text-xs font-light"># {org.id}</p>
						</div>
					</div>
				</TableCell>

				<TableCell className="whitespace-nowrap">
					<StatusBadge type={org.active ? 'ACTIVE' : 'INACTIVE'} />
				</TableCell>

				<TableCell className="whitespace-nowrap">
					{org.locations.length ? (
						<span className="flex font-light items-center gap-1">
							<MapPin className="h-6 w-6 text-primary" />
							{org.locations.length > 1 ? (
								<span>
									This organization is located in {org.locations.length}{' '}
									different places
								</span>
							) : (
								<span className="text-muted-foreground">
									This organization is located in a single place
								</span>
							)}
						</span>
					) : (
						<></>
					)}
				</TableCell>

				<TableCell className="whitespace-nowrap">
					<span className="font-normal text-sm">
						{formatDate(org.creationDate)}
					</span>
				</TableCell>

				<TableCell className="whitespace-nowrap">
					<span className="font-normal text-sm">
						{formatDate(org.modificationDate)}
					</span>
				</TableCell>

				<TableCell className="whitespace-nowrap">
					<UpdateOrganizationAction org={org} />
				</TableCell>
			</TableRow>

			{expanded && (
				<TableRow className="bg-muted-foreground/10">
					<TableCell colSpan={7} className="p-0">
						<OrganizationDetails org={org} />
					</TableCell>
				</TableRow>
			)}
		</React.Fragment>
	);
}
