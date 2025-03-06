'use client';

import { ShieldEllipsis, User } from 'lucide-react';
import { OrganizationLocations } from './organization-locations';

import type { Organization } from '@/types/organization';

export function OrganizationDetails({ org }: { org: Organization }) {
	return (
		<div className="p-6 flex flex-col gap-4 flex-wrap justify-between">
			<div className="h-full flex-1">
				<div className="flex flex-col gap-2">
					<h5 className="text-xs font-medium text-muted-foreground">
						Administrators ({org.organizationAdmins.length})
					</h5>
					{org.organizationAdmins.length ? (
						<div className="mt-1 space-y-1">
							{org.organizationAdmins.map((admin: any, idx: number) => (
								<div key={idx} className="flex items-center gap-2 text-sm">
									<div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
										<User className="h-3 w-3" />
									</div>
									<span className="font-light text-xs font-mono">
										{admin.email}
									</span>
								</div>
							))}
						</div>
					) : (
						<div className="text-sm text-muted-foreground flex items-center gap-4">
							<ShieldEllipsis /> No Admin assigned
						</div>
					)}
				</div>
			</div>

			<OrganizationLocations org={org} />
		</div>
	);
}
