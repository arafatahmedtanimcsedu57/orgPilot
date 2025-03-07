'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { useGetSpecializationsQuery } from '@/lib/redux/services/organizationsApi';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
	clearCredentials,
	selectIsAuthenticated,
} from '@/lib/redux/features/authSlice';
import { DataPagination } from '@/components/ui/data-pagination';
import { PageSizeSelector } from '@/components/ui/page-size-selector';
import { SpecializationTableHeader } from './specialization-table-header';
import {
	CreateSpecializationAction,
	UpdateSpecializationAction,
} from './specialization-table-action';

type Specialization = {
	id: number;
	name: string | null;
	creationDate: string;
	modificationDate: string;
};

export function SpecializationsTable() {
	const [currentPage, setCurrentPage] = useState(0);
	const [pageSize, setPageSize] = useState(10);

	const { toast } = useToast();
	const router = useRouter();
	const dispatch = useAppDispatch();
	const isAuthenticated = useAppSelector(selectIsAuthenticated);

	const { data, error, isLoading, isFetching } = useGetSpecializationsQuery(
		{ page: currentPage, size: pageSize },
		{ skip: !isAuthenticated },
	);

	const handleError = useCallback(
		(error: any) => {
			if (error && 'status' in error && error.status === 401) {
				toast({
					variant: 'destructive',
					title: 'Error',
					description: 'Your session has expired. Please log in again.',
				});
				dispatch(clearCredentials());
				router.push('/login');
			} else {
				toast({
					variant: 'destructive',
					title: 'Error',
					description: 'Failed to fetch specializations',
				});
			}
		},
		[toast, dispatch, router],
	);

	if (error) {
		handleError(error);
	}

	if (!isAuthenticated) {
		return null;
	}

	if (isLoading) {
		return <div>Loading...</div>;
	}

	const specializations = data?.data?.content || [];
	const totalPages = data?.data.totalPages || 0;
	const totalElements = data?.data.totalElements || 0;

	const handlePageChange = (newPage: number) => {
		setCurrentPage(newPage);
	};

	const handlePageSizeChange = (newSize: number) => {
		setPageSize(newSize);
		setCurrentPage(0); // Reset to first page when changing page size
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	};

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
					<CreateSpecializationAction />
				</div>
			</div>

			<div className="shadow-xl rounded-2xl border border-muted-foreground/10 bg-muted-foreground/10">
				<Table>
					<SpecializationTableHeader />
					<TableBody>
						{specializations.map((specialization) => (
							<TableRow key={specialization.id} className="hover:bg-muted/50">
								<TableCell className="font-mono text-sm">
									{specialization.id}
								</TableCell>
								<TableCell>
									{specialization.name || (
										<span className="text-muted-foreground italic">
											Not specified
										</span>
									)}
								</TableCell>
								<TableCell>
									<span className="text-sm text-muted-foreground">
										{formatDate(specialization.creationDate)}
									</span>
								</TableCell>
								<TableCell>
									<span className="text-sm text-muted-foreground">
										{formatDate(specialization.modificationDate)}
									</span>
								</TableCell>
								<TableCell>
									<UpdateSpecializationAction specialization={specialization} />
								</TableCell>
							</TableRow>
						))}

						{specializations.length === 0 && (
							<TableRow>
								<TableCell colSpan={5} className="h-24 text-center">
									No specializations found
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<div className="flex items-center justify-between">
				<PageSizeSelector
					pageSize={pageSize}
					onPageSizeChange={handlePageSizeChange}
					disabled={isFetching}
					type="select"
					options={[5, 10, 20, 50, 100]}
				/>

				<div className="flex items-center gap-2">
					<DataPagination
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={handlePageChange}
						disabled={isFetching}
					/>
				</div>
			</div>
		</div>
	);
}
