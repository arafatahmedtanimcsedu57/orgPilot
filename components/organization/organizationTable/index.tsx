'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { FolderOpenDotIcon } from 'lucide-react';

import { OrganizationTableHeader } from './organization-table-header';
import { OrganizationRow } from './organizationRow';
import { CreateOrganizationAction } from './organization-table-action';

import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { DataPagination } from '@/components/ui/data-pagination';
import { PageSizeSelector } from '@/components/ui/page-size-selector';

import { useGetOrganizationsQuery } from '@/lib/redux/services/organizationsApi';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
	clearCredentials,
	selectIsAuthenticated,
} from '@/lib/redux/features/authSlice';

export function OrganizationTable() {
	const [currentPage, setCurrentPage] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(5);

	const handlePageChange = (newPage: number) => setCurrentPage(newPage);
	const handlePageSizeChange = (newSize: number) => {
		setPageSize(newSize);
		setCurrentPage(0); // Reset to first page when changing page size
	};

	const dispatch = useAppDispatch();
	const router = useRouter();
	const isAuthenticated = useAppSelector(selectIsAuthenticated);

	const { data, error, isLoading, isFetching } = useGetOrganizationsQuery(
		{
			page: currentPage,
			size: pageSize,
		},
		{ skip: !isAuthenticated },
	);

	const organizations = data?.data.content || [];
	const totalPages = data?.data.totalPages || 0;
	const totalElements = data?.data.totalElements || 0;

	const handleError = useCallback(
		(error: any) => {
			if (error && 'status' in error && error.status === 401) {
				toast.error('Error', {
					className: '!bg-destructive',
					description: 'Your session has expired. Please log in again.',
				});
				dispatch(clearCredentials());
				router.push('/login');
			} else {
				toast.error('Error', {
					className: '!bg-destructive',
					description: 'Failed to fetch organizations',
				});
			}
		},
		[dispatch, router],
	);

	useEffect(() => {
		if (error) handleError(error);
	}, [error, handleError]);

	useEffect(() => {
		if (!isAuthenticated) router.push('/login');
	}, [isAuthenticated, router]);

	if (!isAuthenticated) return null;
	if (isLoading) return <div>Loading...</div>;

	return (
		<div className="space-y-4">
			<div className="flex flex-wrap gap-4 items-center justify-between">
				<div>
					<p className="text-sm">Total organizations {totalElements}</p>
					<p className="text-xs text-muted-foreground">
						{pageSize * currentPage + 1} ~ {pageSize * (currentPage + 1)} of{' '}
						{totalElements}
					</p>
				</div>

				<div className="flex items-center gap-2">
					<CreateOrganizationAction />
				</div>
			</div>

			<div className="shadow-xl rounded-2xl border border-muted-foreground/10 bg-muted-foreground/10">
				<Table>
					<OrganizationTableHeader />

					<TableBody>
						{organizations.length ? (
							organizations.map((org) => (
								<OrganizationRow key={org.id} org={org} />
							))
						) : (
							<TableRow>
								<TableCell colSpan={7} className="h-24">
									<div className="text-sm text-muted-foreground flex items-center gap-4 justify-center">
										<FolderOpenDotIcon /> No organization found
									</div>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<div className="flex flex-wrap gap-4 items-center justify-between">
				<PageSizeSelector
					type="select"
					options={[5, 10, 20, 50, 100]}
					pageSize={pageSize}
					disabled={isFetching}
					onPageSizeChange={handlePageSizeChange}
				/>

				<DataPagination
					totalPages={totalPages}
					currentPage={currentPage}
					disabled={isFetching}
					onPageChange={handlePageChange}
				/>
			</div>
		</div>
	);
}
