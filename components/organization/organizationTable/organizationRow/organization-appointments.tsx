'use client';

import { useState } from 'react';
import { Calendar, CalendarIcon, InfoIcon } from 'lucide-react';
import { format } from 'date-fns';

import type { Organization } from '@/types/organization';
import { useGetOrgAppointmentsQuery } from '@/lib/redux/services/organizationsApi';
import { PageSizeSelector } from '@/components/ui/page-size-selector';
import { DataPagination } from '@/components/ui/data-pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import type { Appointment } from '@/types/appointment';

export function OrganizationAppointments({ org }: { org: Organization }) {
	const [currentPage, setCurrentPage] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(5);
	const [startDate, setStartDate] = useState<string>('2021-02-07T00:00:00Z');
	const [endDate, setEndDate] = useState<string>('2025-03-07T23:59:59Z');
	const [tempStartDate, setTempStartDate] = useState<string>(startDate);
	const [tempEndDate, setTempEndDate] = useState<string>(endDate);
	const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

	const handlePageChange = (newPage: number) => setCurrentPage(newPage);
	const handlePageSizeChange = (newSize: number) => {
		setPageSize(newSize);
		setCurrentPage(0); // Reset to first page when changing page size
	};

	const applyDateFilter = () => {
		setStartDate(tempStartDate);
		setEndDate(tempEndDate);
		setIsFilterOpen(false);
		setCurrentPage(0); // Reset to first page when applying filter
	};

	const { data: appointments, isFetching } = useGetOrgAppointmentsQuery({
		page: currentPage,
		size: pageSize,
		id: org.id,
		startDate,
		endDate,
	});
	const { data } = appointments || {};

	const formatDisplayDate = (dateString: string) => {
		try {
			return format(new Date(dateString), 'MMM dd, yyyy');
		} catch (e) {
			return dateString;
		}
	};

	return (
		<div className="shadow-xl bg-muted-foreground/10 p-6 rounded-2xl border border-muted-foreground/10 flex flex-col gap-6">
			<div className="flex items-center gap-6 justify-between">
				<h5 className="text-xs font-medium text-muted-foreground">
					Appointments
				</h5>

				<div className="flex gap-4">
					{!isFetching ? (
						!data?.totalElements ? (
							<span className="text-xs inline-flex gap-1 items-center text-destructive ">
								<InfoIcon className="h-3 w-3" /> No appointment yet
							</span>
						) : (data?.totalElements || 0) > 1 ? (
							<span className="text-xs inline-flex gap-1 items-center">
								<InfoIcon className="h-3 w-3" />
								This organization has {data?.totalElements} appointments
							</span>
						) : (
							<span className="text-xs inline-flex gap-1 items-center text-orange-600">
								<InfoIcon className="h-3 w-3" />
								This organization has a single appointments
							</span>
						)
					) : (
						<>Loading...</>
					)}

					<Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
						<PopoverTrigger asChild>
							<Button variant="outline" size="sm" className="gap-2">
								<CalendarIcon className="h-4 w-4" />
								<span>
									{formatDisplayDate(startDate)} - {formatDisplayDate(endDate)}
								</span>
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-4" align="end">
							<div className="grid gap-4">
								<div className="space-y-2">
									<h4 className="font-medium">Date Range</h4>
									<div className="grid gap-2">
										<div className="grid gap-1">
											<Label htmlFor="start-date">Start Date</Label>
											<Input
												id="start-date"
												type="datetime-local"
												value={tempStartDate.slice(0, 16)}
												onChange={(e) =>
													setTempStartDate(`${e.target.value}:00Z`)
												}
											/>
										</div>
										<div className="grid gap-1">
											<Label htmlFor="end-date">End Date</Label>
											<Input
												id="end-date"
												type="datetime-local"
												value={tempEndDate.slice(0, 16)}
												onChange={(e) =>
													setTempEndDate(`${e.target.value}:00Z`)
												}
											/>
										</div>
									</div>
								</div>
								<Button onClick={applyDateFilter}>Apply Filter</Button>
							</div>
						</PopoverContent>
					</Popover>
				</div>
			</div>

			<Card className="max-h-[500px] overflow-auto min-w-fit shadow-xl bg-muted-foreground/10 rounded-2xl border border-muted-foreground/10 flex flex-col gap-6">
				<CardContent className="p-6 min-w-fit">
					{!isFetching ? (
						<>
							{data?.content && data.content.length > 0 ? (
								<div className="shadow-xl bg-muted-foreground/10 p-6 rounded-2xl border border-muted-foreground/10 flex flex-col gap-6">
									{data.content.map(
										(appointment: Appointment, index: number) => (
											<div
												key={index}
												className="shadow-xl bg-muted-foreground/10 p-6 rounded-2xl border border-muted-foreground/10 flex flex-col gap-6"
											>
												<div className="flex justify-between items-center">
													<div>
														<p className="font-medium">
															{appointment.name.first} {appointment.name.last}
														</p>
														<p className="text-sm text-muted-foreground">
															{appointment.appointmentDate &&
																format(
																	new Date(appointment.appointmentDate),
																	'PPP p',
																)}
														</p>
													</div>
												</div>
											</div>
										),
									)}
								</div>
							) : (
								<div className="text-sm text-muted-foreground flex items-center gap-4">
									<Calendar className="min-h-6 min-w-6 text-muted-foreground" />
									No appointments found for the selected date range
								</div>
							)}
						</>
					) : (
						<>Loading...</>
					)}
				</CardContent>
			</Card>

			<div className="flex flex-wrap gap-4 items-center justify-between">
				<PageSizeSelector
					type="select"
					options={[5, 10, 20, 50, 100]}
					pageSize={pageSize}
					disabled={isFetching}
					onPageSizeChange={handlePageSizeChange}
				/>

				<DataPagination
					totalPages={data?.totalPages || 0}
					currentPage={currentPage}
					disabled={isFetching}
					onPageChange={handlePageChange}
				/>
			</div>
		</div>
	);
}

// Add a StatusBadge component if it doesn't exist
function StatusBadge({ type }: { type: string }) {
	const getStatusConfig = (status: string) => {
		switch (status.toUpperCase()) {
			case 'ACTIVE':
			case 'COMPLETED':
				return { bg: 'bg-green-100', text: 'text-green-800' };
			case 'SCHEDULED':
				return { bg: 'bg-blue-100', text: 'text-blue-800' };
			case 'CANCELLED':
				return { bg: 'bg-red-100', text: 'text-red-800' };
			case 'INACTIVE':
				return { bg: 'bg-gray-100', text: 'text-gray-800' };
			default:
				return { bg: 'bg-gray-100', text: 'text-gray-800' };
		}
	};

	const { bg, text } = getStatusConfig(type);

	return (
		<span
			className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}
		>
			{type}
		</span>
	);
}
