'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useGetSpecializationsQuery } from '@/lib/redux/services/organizationsApi';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
	clearCredentials,
	selectIsAuthenticated,
} from '@/lib/redux/features/authSlice';
import { Plus, Pencil } from 'lucide-react';
import { DataPagination } from '@/components/ui/data-pagination';
import { PageSizeSelector } from '@/components/ui/page-size-selector';
import { SpecializationFormModal } from '@/components/settings/specializations/specialization-form-modal';
import { SpecializationUpdateModal } from '@/components/settings/specializations/specialization-update-modal';

type Specialization = {
	id: number;
	name: string | null;
	creationDate: string;
	modificationDate: string;
};

export function SpecializationsTable() {
	const [currentPage, setCurrentPage] = useState(0);
	const [pageSize, setPageSize] = useState(10);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
	const [selectedSpecialization, setSelectedSpecialization] =
		useState<Specialization | null>(null);

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

	const specializations = data?.data || [];
	const totalPages = data?.data?.totalPages || 0;

	const handlePageChange = (newPage: number) => {
		setCurrentPage(newPage);
	};

	const handlePageSizeChange = (newSize: number) => {
		setPageSize(newSize);
		setCurrentPage(0); // Reset to first page when changing page size
	};

	const handleUpdateClick = (specialization: Specialization) => {
		setSelectedSpecialization(specialization);
		setIsUpdateModalOpen(true);
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
			<div className="flex items-center justify-between">
				<div></div>
				<div className="flex items-center gap-2">
					<Button
						onClick={() => setIsFormOpen(true)}
						className="flex items-center gap-1"
					>
						<Plus className="h-4 w-4" />
						Add Specialization
					</Button>
				</div>
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>ID</TableHead>
							<TableHead>NAME</TableHead>
							<TableHead>CREATED</TableHead>
							<TableHead>LAST UPDATED</TableHead>
							<TableHead className="w-20">ACTIONS</TableHead>
						</TableRow>
					</TableHeader>
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
									<Button
										variant="ghost"
										size="icon"
										onClick={() => handleUpdateClick(specialization)}
										className="h-8 w-8"
									>
										<Pencil className="h-4 w-4" />
									</Button>
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

			<SpecializationFormModal open={isFormOpen} onOpenChange={setIsFormOpen} />
			<SpecializationUpdateModal
				open={isUpdateModalOpen}
				onOpenChange={setIsUpdateModalOpen}
				specialization={selectedSpecialization}
			/>
		</div>
	);
}
