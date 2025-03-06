'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

import {
	useCreateLocationMutation,
	useUpdateOrganizationMutation,
	useGetOrganizationByIdQuery,
} from '@/lib/redux/services/organizationsApi';
import { defaultTimeZones, timeZones } from '@/constant/timeZones';

const formSchema = z.object({
	name: z
		.string()
		.min(2, { message: 'Location name must be at least 2 characters' }),
	activeStatus: z.boolean().default(true),
	timeZone: z.string().min(1, { message: 'Time zone is required' }),
	address: z.object({
		detail: z.string().min(1, { message: 'Address detail is required' }),
		city: z.string().min(1, { message: 'City is required' }),
		state: z.string().min(1, { message: 'State is required' }),
		zip: z.string().min(1, { message: 'ZIP code is required' }),
	}),
});

type FormValues = z.infer<typeof formSchema>;

interface LocationFormModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	organizationId?: number;
}

// Common time zones

export function LocationFormModal({
	open,
	onOpenChange,
	organizationId,
}: LocationFormModalProps) {
	const [createLocation, { isLoading: isCreating }] =
		useCreateLocationMutation();
	const [updateOrganization, { isLoading: isUpdating }] =
		useUpdateOrganizationMutation();

	// Replace the problematic query with this fixed version
	// Fetch organization data if organizationId is provided
	const { data: organizationData } = useGetOrganizationByIdQuery(
		organizationId as number,
		{
			skip: !organizationId,
			refetchOnMountOrArgChange: true,
		},
	);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			activeStatus: true,
			timeZone: defaultTimeZones,
			address: {
				detail: '',
				city: '',
				state: '',
				zip: '',
			},
		},
	});

	// Reset form when modal opens with a new organizationId
	useEffect(() => {
		if (open) {
			form.reset({
				name: '',
				activeStatus: true,
				timeZone: defaultTimeZones,
				address: {
					detail: '',
					city: '',
					state: '',
					zip: '',
				},
			});
		}
	}, [open, form]);

	// Update the onSubmit function to first create the location, then update the organization
	const onSubmit = async (values: FormValues) => {
		try {
			// Step 1: Create the location
			const locationData = {
				...values,
			};

			const result = await createLocation(locationData).unwrap();

			if (result.success) {
				// Step 2: If organizationId is provided, update the organization
				if (organizationId && organizationData?.data) {
					try {
						// Get the newly created location
						const newLocation = result.data;

						// Prepare the organization update data
						const updateData = {
							...organizationData.data,
							locations: [
								...organizationData.data.locations,
								{
									id: newLocation.id,
									name: newLocation.name,
									address: newLocation.address,
									activeStatus: newLocation.activeStatus,
									timeZone: newLocation.timeZone,
									providers: [],
								},
							],
						};

						// Update the organization
						const updateResult = await updateOrganization(updateData).unwrap();

						if (updateResult.success) {
							toast.info('Location added', {
								description:
									'The location has been created and added to the organization successfully',
							});
						} else {
							toast.error('Warning', {
								className: '!bg-destructive',
								description:
									'Location created but could not be added to the organization',
							});
						}
					} catch (updateError: any) {
						toast.error('Warning', {
							className: '!bg-destructive',
							description:
								'Location created but could not be added to the organization',
						});
						console.error('Error updating organization:', updateError);
					}
				} else {
					toast.info('Location created', {
						description: 'The location has been created successfully',
					});
				}

				// Reset form and close modal
				form.reset();
				onOpenChange(false);
			} else {
				toast.error('Creation failed', {
					className: '!bg-destructive',
					description: result.message || 'Failed to create location',
				});
			}
		} catch (error: any) {
			toast.error('Error', {
				className: '!bg-destructive',
				description: error?.data?.message || 'An error occurred',
			});
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>
						{organizationId
							? 'Add Location to Organization'
							: 'Add New Location'}
					</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Location Name</FormLabel>
									<FormControl>
										<Input placeholder="Enter location name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="activeStatus"
							render={({ field }) => (
								<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<div className="space-y-1 leading-none">
										<FormLabel>Active</FormLabel>
										<FormDescription>
											Set the location as active or inactive
										</FormDescription>
									</div>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="timeZone"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Time Zone</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select a time zone" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{timeZones.map((zone) => (
												<SelectItem key={zone} value={zone}>
													{zone}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="space-y-4 rounded-md border p-4">
							<h3 className="text-sm font-medium">Address Information</h3>

							<FormField
								control={form.control}
								name="address.detail"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Address Detail</FormLabel>
										<FormControl>
											<Input placeholder="Street address" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="address.city"
									render={({ field }) => (
										<FormItem>
											<FormLabel>City</FormLabel>
											<FormControl>
												<Input placeholder="City" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="address.state"
									render={({ field }) => (
										<FormItem>
											<FormLabel>State</FormLabel>
											<FormControl>
												<Input placeholder="State" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name="address.zip"
								render={({ field }) => (
									<FormItem>
										<FormLabel>ZIP Code</FormLabel>
										<FormControl>
											<Input placeholder="ZIP Code" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => onOpenChange(false)}
								disabled={isCreating || isUpdating}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isCreating || isUpdating}>
								{isCreating || isUpdating ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										{isCreating ? 'Creating...' : 'Adding to organization...'}
									</>
								) : (
									'Create Location'
								)}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
