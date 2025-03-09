'use client';

import { InfoIcon, ShieldEllipsis, ShieldIcon } from 'lucide-react';
import { OrganizationLocations } from './organization-locations';

import type { Organization } from '@/types/organization';

export function OrganizationDetails({ org }: { org: Organization }) {
	return (
		<div className="flex flex-col gap-6 flex-wrap flex-1">
			<div className="shadow-xl bg-muted-foreground/10 p-6 rounded-2xl border border-muted-foreground/10 flex flex-col gap-6">
				<div className="flex flex-wrap gap-6 items-center justify-between">
					<h5 className="text-xs font-medium text-muted-foreground">
						Administrators
					</h5>
					{!org.organizationAdmins.length ? (
						<span className="text-xs inline-flex gap-1 items-center text-destructive ">
							<InfoIcon className="h-3 w-3" /> Admins are not assigned here yet
						</span>
					) : org.organizationAdmins.length > 1 ? (
						<span className="text-xs inline-flex gap-1 items-center">
							<InfoIcon className="h-3 w-3" />
							{org.organizationAdmins.length} admins are assigned here
						</span>
					) : (
						<span className="text-xs inline-flex gap-1 items-center text-orange-600">
							<InfoIcon className="h-3 w-3" />
							One admin single-handedly handles it
						</span>
					)}
				</div>

				<div className="flex flex-col gap-2 ">
					{org.organizationAdmins.length ? (
						org.organizationAdmins.map((admin: any, idx: number) => (
							<div key={idx} className="flex items-center gap-2">
								<ShieldIcon className="min-h-6 min-w-6 text-primary" />
								<span className="text-sm font-normal">{admin.email}</span>
							</div>
						))
					) : (
						<div className="text-sm text-muted-foreground flex items-center gap-2">
							<ShieldEllipsis className="min-h-6 min-w-6 text-muted-foreground" />
							No Admin assigned
						</div>
					)}
				</div>
			</div>

			<OrganizationLocations org={org} />
		</div>
	);
}
