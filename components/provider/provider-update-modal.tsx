'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { Loader2 } from 'lucide-react';
import {
	useGetProviderByIdQuery,
	useGetSpecializationsQuery,
	useUpdateProviderMutation,
} from '@/lib/redux/services/organizationsApi';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
	id: z.number(),
	name: z
		.string()
		.min(2, { message: 'Provider name must be at least 2 characters' }),
	email: z.string().email({ message: 'Please enter a valid email address' }),
	phone: z.string().optional(),
	specialization: z.object({
		id: z.number(),
	}),
	activeStatus: z.boolean().default(true),
	enableEmailPdf: z.boolean().default(true),
	ehrProviderId: z.string().min(1, { message: 'EHR Provider ID is required' }),
});

type FormValues = z.infer<typeof formSchema>;

interface ProviderUpdateModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	providerId: number | null;
	locationId: number | null;
}

export function ProviderUpdateModal({
	open,
	onOpenChange,
	providerId,
	locationId,
}: ProviderUpdateModalProps) {
	const [updateProvider, { isLoading: isUpdating }] =
		useUpdateProviderMutation();

	// Fetch provider data if providerId is provided
	const { data: providerData, isLoading: isLoadingProvider } =
		useGetProviderByIdQuery(providerId as number, {
			skip: !providerId,
			refetchOnMountOrArgChange: true,
		});

	// Fetch specializations for the dropdown
	const { data: specializationsData, isLoading: isLoadingSpecializations } =
		useGetSpecializationsQuery({ page: 0, size: 100 }, { skip: !open });

	// Debug logging
	useEffect(() => {
		if (specializationsData) {
			console.log('Specializations data:', specializationsData);
		}
	}, [specializationsData]);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: 0,
			name: '',
			email: '',
			phone: '',
			specialization: {
				id: 0,
			},
			activeStatus: true,
			enableEmailPdf: true,
			ehrProviderId: '',
		},
	});

	// Update form when provider data is loaded
	useEffect(() => {
		if (providerData?.data) {
			const provider = providerData.data;
			form.reset({
				id: provider.id,
				name: provider.name,
				email: provider.email,
				phone: provider.phone || '',
				specialization: {
					id: provider.specialization?.id || 0,
				},
				activeStatus: provider.activeStatus,
				enableEmailPdf: provider.enableEmailPdf,
				ehrProviderId: provider.ehrProviderId,
			});
		}
	}, [providerData, form]);

	const onSubmit = async (values: FormValues) => {
		if (!providerId) return;

		try {
			// Prepare provider update data
			const providerData = {
				...values,
				logo: null, // We're not handling logo updates in this example
				location: locationId ? { id: locationId } : null,
			};

			const result = await updateProvider(providerData).unwrap();

			if (result.success) {
				toast.info('Provider updated', {
					description: 'The provider has been updated successfully',
				});

				// Close modal
				onOpenChange(false);
			} else {
				toast.error('Update failed', {
					className: '!bg-destructive',
					description: result.message || 'Failed to update provider',
				});
			}
		} catch (error: any) {
			toast.error('Error', {
				className: '!bg-destructive',
				description: error?.data?.message || 'An error occurred',
			});
		}
	};

	const isLoading = isLoadingProvider || isLoadingSpecializations;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Update Provider</DialogTitle>
				</DialogHeader>

				{isLoading ? (
					<div className="flex items-center justify-center p-6">
						<Loader2 className="h-6 w-6 animate-spin mr-2" />
						<p>Loading provider data...</p>
					</div>
				) : (
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Provider Name</FormLabel>
										<FormControl>
											<Input placeholder="Enter provider name" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												placeholder="Enter email address"
												type="email"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="phone"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Phone (Optional)</FormLabel>
										<FormControl>
											<Input placeholder="Enter phone number" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="ehrProviderId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>EHR Provider ID</FormLabel>
										<FormControl>
											<Input placeholder="Enter EHR Provider ID" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="specialization.id"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Specialization</FormLabel>
										<Select
											onValueChange={(value) =>
												field.onChange(Number.parseInt(value))
											}
											defaultValue={field.value?.toString() || '0'}
											value={field.value?.toString() || '0'}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select a specialization" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{specializationsData?.data?.content &&
												specializationsData?.data?.content.length ? (
													specializationsData.data.content.map(
														(specialization) => (
															<SelectItem
																key={specialization.id}
																value={specialization.id.toString()}
															>
																{specialization.name ||
																	`Specialization #${specialization.id}`}
															</SelectItem>
														),
													)
												) : (
													<SelectItem value="0" disabled>
														Loading specializations...
													</SelectItem>
												)}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="grid grid-cols-2 gap-4">
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
													Set provider as active
												</FormDescription>
											</div>
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="enableEmailPdf"
									render={({ field }) => (
										<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
											<FormControl>
												<Checkbox
													checked={field.value}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
											<div className="space-y-1 leading-none">
												<FormLabel>Enable Email PDF</FormLabel>
												<FormDescription>Allow PDF emails</FormDescription>
											</div>
										</FormItem>
									)}
								/>
							</div>

							<DialogFooter>
								<Button
									type="button"
									variant="outline"
									onClick={() => onOpenChange(false)}
									disabled={isUpdating}
								>
									Cancel
								</Button>
								<Button type="submit" disabled={isUpdating}>
									{isUpdating ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Updating...
										</>
									) : (
										'Update Provider'
									)}
								</Button>
							</DialogFooter>
						</form>
					</Form>
				)}
			</DialogContent>
		</Dialog>
	);
}
