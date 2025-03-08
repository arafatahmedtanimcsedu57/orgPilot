'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { FolderOpenDotIcon, InfoIcon } from 'lucide-react';

import { OrganizationRow } from './organizationRow';
import { CreateOrganizationAction } from './organization-table-action';

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
		<div>
			<div className="flex flex-wrap gap-4 items-center justify-between mb-6">
				<div>
					<p className="text-sm text-muted-foreground">
						Showing {pageSize * currentPage + 1} ~{' '}
						{pageSize * (currentPage + 1)} of {totalElements}
					</p>
				</div>

				<div className="flex items-center flex-wrap gap-4">
					<p className="text-sm inline-flex items-center gap-2">
						<InfoIcon className="h-4 w-4" /> Total organizations {totalElements}
					</p>
					<CreateOrganizationAction />
				</div>
			</div>

			<div className="mb-6 flex flex-col gap-2 p-6 shadow-xl rounded-2xl border border-muted-foreground/10 bg-muted-foreground/10">
				{organizations.length ? (
					organizations.map((org) => <OrganizationRow key={org.id} org={org} />)
				) : (
					<div className="text-sm text-muted-foreground flex  items-center gap-4 justify-center">
						<FolderOpenDotIcon /> No organization found
					</div>
				)}
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
