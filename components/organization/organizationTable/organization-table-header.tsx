import { memo } from 'react';

import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

function _OrganizationTableHeader() {
	return (
		<TableHeader>
			<TableRow>
				<TableHead className="whitespace-nowrap w-10 rounded-tl-2xl"></TableHead>
				<TableHead className="whitespace-nowrap">ORGANIZATION INFO</TableHead>
				<TableHead className="whitespace-nowrap">STATUS</TableHead>
				<TableHead className="whitespace-nowrap">LOCATIONS</TableHead>
				<TableHead className="whitespace-nowrap">CREATED</TableHead>
				<TableHead className="whitespace-nowrap">LAST UPDATED</TableHead>
				<TableHead className="whitespace-nowrap w-20 rounded-tr-2xl">
					ACTIONS
				</TableHead>
			</TableRow>
		</TableHeader>
	);
}

export const OrganizationTableHeader = memo(_OrganizationTableHeader);
