import { memo } from 'react';

import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

function _SpecializationTableHeader() {
	return (
		<TableHeader>
			<TableRow>
				<TableHead className="whitespace-nowrap w-10 rounded-tl-2xl">
					ID
				</TableHead>
				<TableHead className="whitespace-nowrap">NAME</TableHead>
				<TableHead className="whitespace-nowrap">CREATED</TableHead>
				<TableHead className="whitespace-nowrap">LAST UPDATED</TableHead>
				<TableHead className="whitespace-nowrap w-20 rounded-tr-2xl">
					ACTIONS
				</TableHead>
			</TableRow>
		</TableHeader>
	);
}

export const SpecializationTableHeader = memo(_SpecializationTableHeader);
