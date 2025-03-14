'use client';
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

import {
	useGetSpecializationsQuery,
	useCreateProviderMutation,
} from '@/lib/redux/services/organizationsApi';

const formSchema = z.object({
	name: z
		.string()
		.min(2, { message: 'Provider name must be at least 2 characters' }),
	email: z
		.string()
		.email({ message: 'Please enter a valid email address' })
		.or(z.string().length(0)),
	phone: z.string().optional(),
	ehrProviderId: z.string().min(1, { message: 'EHR Provider ID is required' }),
	specialization: z.object({
		id: z.number(),
	}),
	activeStatus: z.boolean().default(true),
	enableEmailPdf: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface ProviderFormModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	locationId: number | null;
}

export function ProviderFormModal({
	open,
	locationId,
	onOpenChange,
}: ProviderFormModalProps) {
	const [createProvider, { isLoading: isCreating }] =
		useCreateProviderMutation();

	const { data: specializationsData, isLoading: isLoadingSpecializations } =
		useGetSpecializationsQuery({ page: 0, size: 100 }, { skip: !open });

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			email: '',
			phone: '',
			ehrProviderId: '',
			specialization: {
				id: 0,
			},
			activeStatus: true,
			enableEmailPdf: true,
		},
	});

	const onSubmit = async (values: FormValues) => {
		if (!locationId) return;

		try {
			const providerData = {
				...values,
				location: { id: locationId },
				logo: null, // Empty object as per the API requirement
			};

			const result = await createProvider(providerData).unwrap();

			if (result.success) {
				toast.info('Provider added', {
					description:
						'The provider has been created and added to the location successfully',
				});

				// Reset form and close modal
				form.reset();
				onOpenChange(false);
			} else {
				toast.error('Creation failed', {
					className: '!bg-destructive',
					description: result.message || 'Failed to create provider',
				});
			}
		} catch (error: any) {
			toast.error('Error', {
				className: '!bg-destructive',
				description: error?.data?.message || 'An error occurred',
			});
		}
	};

	const isLoading = isCreating || isLoadingSpecializations;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Add Provider to Location</DialogTitle>
				</DialogHeader>

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
									<FormLabel>Email (Optional)</FormLabel>
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
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select a specialization" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{specializationsData?.data?.content &&
											specializationsData?.data?.content.length ? (
												specializationsData?.data?.content.map(
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
											<FormDescription>Set provider as active</FormDescription>
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
								disabled={isLoading}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isLoading}>
								{isLoading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										{isCreating ? 'Creating...' : 'Adding to location...'}
									</>
								) : (
									'Add Provider'
								)}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
