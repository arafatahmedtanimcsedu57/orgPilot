'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

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
import { useUpdateLocationMutation } from '@/lib/redux/services/organizationsApi';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

import { defaultTimeZones, timeZones } from '@/constant/timeZones';

const formSchema = z.object({
	id: z.number(),
	name: z
		.string()
		.min(2, { message: 'Location name must be at least 2 characters' }),
	activeStatus: z.boolean().default(true),
	timeZone: z.string().min(1, { message: 'Time zone is required' }),
	address: z.object({
		id: z.number(),
		detail: z.string().optional(),
		city: z.string().min(1, { message: 'City is required' }),
		state: z.string().min(1, { message: 'State is required' }),
		zip: z.string().min(1, { message: 'ZIP code is required' }),
	}),
});

type FormValues = z.infer<typeof formSchema>;

type Location = {
	id: number;
	name: string;
	address: {
		id: number;
		detail: string;
		city: string;
		state: string;
		zip: string;
		creationDate: string;
		modificationDate: string;
	};
	activeStatus: boolean;
	timeZone: string;
	organization: any;
	providers: any[];
	creationDate: string;
	modificationDate: string;
};

interface LocationUpdateModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	location: Location | null;
}

export function LocationUpdateModal({
	open,
	onOpenChange,
	location,
}: LocationUpdateModalProps) {
	const { toast } = useToast();
	const [updateLocation, { isLoading: isUpdating }] =
		useUpdateLocationMutation();

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: location?.id || 0,
			name: location?.name || '',
			activeStatus: location?.activeStatus || true,
			timeZone: location?.timeZone || defaultTimeZones,
			address: {
				id: location?.address?.id || 0,
				detail: location?.address?.detail || '',
				city: location?.address?.city || '',
				state: location?.address?.state || '',
				zip: location?.address?.zip || '',
			},
		},
	});

	// Update form when location changes
	useEffect(() => {
		if (location) {
			form.reset({
				id: location.id,
				name: location.name,
				activeStatus: location.activeStatus,
				timeZone: location.timeZone,
				address: {
					id: location.address.id,
					detail: location.address.detail,
					city: location.address.city,
					state: location.address.state,
					zip: location.address.zip,
				},
			});
		}
	}, [location, form]);

	const onSubmit = async (values: FormValues) => {
		try {
			const result = await updateLocation(values).unwrap();

			if (result.success) {
				toast({
					title: 'Location updated',
					description: 'The location has been updated successfully',
				});

				// Reset form and close modal
				form.reset();
				onOpenChange(false);
			} else {
				toast({
					variant: 'destructive',
					title: 'Update failed',
					description: result.message || 'Failed to update location',
				});
			}
		} catch (error: any) {
			toast({
				variant: 'destructive',
				title: 'Error',
				description: error?.data?.message || 'An error occurred',
			});
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Update Location</DialogTitle>
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
									'Update Location'
								)}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
