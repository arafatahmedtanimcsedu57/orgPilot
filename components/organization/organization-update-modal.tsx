'use client';

import type React from 'react';
import { useState, useEffect } from 'react';

import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Upload, Loader2, Check } from 'lucide-react';

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
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

import {
	useGetLocationsQuery,
	useUploadMultimediaMutation,
	useUpdateOrganizationMutation,
} from '@/lib/redux/services/organizationsApi';
import type { Organization } from '@/types/organization';

const formSchema = z.object({
	id: z.number(),
	name: z
		.string()
		.min(2, { message: 'Organization name must be at least 2 characters' }),
	active: z.boolean().default(true),
	multimediaId: z.number().optional(),
	locationIds: z.array(z.number()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface OrganizationUpdateModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	organization: Organization | null;
}

export function OrganizationUpdateModal({
	open,
	onOpenChange,
	organization,
}: OrganizationUpdateModalProps) {
	const { toast } = useToast();
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [uploadedFile, setUploadedFile] = useState<File | null>(null);
	const [keepExistingImage, setKeepExistingImage] = useState(true);
	const [selectedLocationIds, setSelectedLocationIds] = useState<number[]>([]);

	const { data: locationsData, isLoading: isLoadingLocations } =
		useGetLocationsQuery({ page: 0, size: 100 });
	const [uploadMultimedia, { isLoading: isUploading }] =
		useUploadMultimediaMutation();
	const [updateOrganization, { isLoading: isUpdating }] =
		useUpdateOrganizationMutation();

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: organization?.id || 0,
			name: organization?.name || '',
			active: organization?.active || true,
			multimediaId: organization?.multimediaFile?.id,
			locationIds: organization?.locations?.map((loc) => loc.id) || [],
		},
	});

	// Update form when organization changes
	useEffect(() => {
		if (organization) {
			const locationIds = organization.locations?.map((loc) => loc.id) || [];

			form.reset({
				id: organization.id,
				name: organization.name,
				active: organization.active,
				multimediaId: organization.multimediaFile?.id,
				locationIds: locationIds,
			});

			setSelectedLocationIds(locationIds);
			setKeepExistingImage(!!organization.multimediaFile);
			setImagePreview(null);
			setUploadedFile(null);
		}
	}, [organization, form]);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Check file type
		if (!file.type.startsWith('image/')) {
			toast({
				variant: 'destructive',
				title: 'Invalid file type',
				description: 'Please upload an image file',
			});
			return;
		}

		// Check file size (max 1MB)
		if (file.size > 1 * 1024 * 1024) {
			toast({
				variant: 'destructive',
				title: 'File too large',
				description: 'Image must be less than 1MB',
			});
			return;
		}

		setUploadedFile(file);
		setKeepExistingImage(false);

		// Create preview
		const reader = new FileReader();
		reader.onloadend = () => {
			setImagePreview(reader.result as string);
		};
		reader.readAsDataURL(file);
	};

	const removeImage = () => {
		setImagePreview(null);
		setUploadedFile(null);
		setKeepExistingImage(false);
		form.setValue('multimediaId', undefined);
	};

	const onSubmit = async (values: FormValues) => {
		try {
			let multimediaId = keepExistingImage
				? organization?.multimediaFile?.id
				: values.multimediaId;

			// Upload image if selected
			if (uploadedFile && !keepExistingImage) {
				const formData = new FormData();
				formData.append('file', uploadedFile);

				const uploadResult = await uploadMultimedia(formData).unwrap();
				if (uploadResult.success) {
					multimediaId = uploadResult.data.id;
				} else {
					toast({
						variant: 'destructive',
						title: 'Upload failed',
						description: uploadResult.message || 'Failed to upload image',
					});
					return;
				}
			}

			// Update organization request
			const organizationData: any = {
				id: values.id,
				name: values.name,
				active: values.active,
			};

			// Add multimedia if uploaded or keeping existing
			if (multimediaId) {
				organizationData.multimediaFile = { id: multimediaId };
			}

			// Add locations if selected
			if (values.locationIds && values.locationIds.length > 0) {
				organizationData.locations = values.locationIds.map((id) => ({ id }));
			}

			const result = await updateOrganization(organizationData).unwrap();

			if (result.success) {
				toast({
					title: 'Organization updated',
					description: 'The organization has been updated successfully',
				});

				// Reset form and close modal
				form.reset();
				setImagePreview(null);
				setUploadedFile(null);
				setSelectedLocationIds([]);
				onOpenChange(false);
			} else {
				toast({
					variant: 'destructive',
					title: 'Update failed',
					description: result.message || 'Failed to update organization',
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

	const toggleLocation = (locationId: number) => {
		setSelectedLocationIds((prev) => {
			if (prev.includes(locationId)) {
				return prev.filter((id) => id !== locationId);
			} else {
				return [...prev, locationId];
			}
		});

		const currentIds = form.getValues('locationIds') || [];
		if (currentIds.includes(locationId)) {
			form.setValue(
				'locationIds',
				currentIds.filter((id) => id !== locationId),
			);
		} else {
			form.setValue('locationIds', [...currentIds, locationId]);
		}
	};

	const getLocationName = (locationId: number) => {
		return (
			locationsData?.data.content.find((loc) => loc.id === locationId)?.name ||
			'Unknown Location'
		);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Update Organization</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Organization Name</FormLabel>
									<FormControl>
										<Input placeholder="Enter organization name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="active"
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
											Set the organization as active or inactive
										</FormDescription>
									</div>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="locationIds"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Locations</FormLabel>
									<FormDescription>
										Select locations for this organization
									</FormDescription>
									<div className="space-y-2">
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant="outline"
														role="combobox"
														className="w-full justify-between"
													>
														{selectedLocationIds.length > 0
															? `${selectedLocationIds.length} location${
																	selectedLocationIds.length > 1 ? 's' : ''
															  } selected`
															: 'Select locations'}
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-full p-0">
												<Command>
													<CommandInput placeholder="Search locations..." />
													<CommandList>
														<CommandEmpty>No locations found.</CommandEmpty>
														<CommandGroup>
															<ScrollArea className="h-60">
																{isLoadingLocations ? (
																	<div className="flex items-center justify-center p-4">
																		<Loader2 className="h-4 w-4 animate-spin mr-2" />
																		Loading locations...
																	</div>
																) : (
																	locationsData?.data.content.map(
																		(location) => (
																			<CommandItem
																				key={location.id}
																				value={location.id.toString()}
																				onSelect={() =>
																					toggleLocation(location.id)
																				}
																			>
																				<div className="flex items-center gap-2 w-full">
																					<Checkbox
																						checked={selectedLocationIds.includes(
																							location.id,
																						)}
																						className="mr-2"
																					/>
																					{location.name}
																				</div>
																				{selectedLocationIds.includes(
																					location.id,
																				) && (
																					<Check className="h-4 w-4 ml-auto" />
																				)}
																			</CommandItem>
																		),
																	)
																)}
															</ScrollArea>
														</CommandGroup>
													</CommandList>
												</Command>
											</PopoverContent>
										</Popover>

										{selectedLocationIds.length > 0 && (
											<div className="flex flex-wrap gap-2 mt-2">
												{selectedLocationIds.map((id) => (
													<Badge
														key={id}
														variant="secondary"
														className="flex items-center gap-1"
													>
														{getLocationName(id)}
														<Button
															variant="ghost"
															size="sm"
															className="h-4 w-4 p-0 ml-1"
															onClick={() => toggleLocation(id)}
														>
															<X className="h-3 w-3" />
														</Button>
													</Badge>
												))}
											</div>
										)}
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="multimediaId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Organization Logo</FormLabel>
									<FormControl>
										<div className="space-y-4">
											{imagePreview ? (
												<div className="relative h-40 w-40 overflow-hidden rounded-md border">
													<Image
														src={imagePreview || '/placeholder.svg'}
														alt="Preview"
														fill
														className="object-cover"
													/>
													<Button
														type="button"
														variant="destructive"
														size="icon"
														className="absolute right-2 top-2 h-6 w-6"
														onClick={removeImage}
													>
														<X className="h-4 w-4" />
													</Button>
												</div>
											) : keepExistingImage && organization?.multimediaFile ? (
												<div className="relative h-40 w-40 overflow-hidden rounded-md border">
													<Image
														src={`/api/multimedia/${organization.multimediaFile.id}`}
														alt={organization.name}
														fill
														className="object-cover"
													/>
													<Button
														type="button"
														variant="destructive"
														size="icon"
														className="absolute right-2 top-2 h-6 w-6"
														onClick={removeImage}
													>
														<X className="h-4 w-4" />
													</Button>
												</div>
											) : (
												<div className="flex flex-col items-center justify-center rounded-md border border-dashed p-6">
													<Upload className="mb-2 h-8 w-8 text-muted-foreground" />
													<p className="text-sm text-muted-foreground">
														Click to upload or drag and drop
													</p>
													<p className="text-xs text-muted-foreground">
														PNG, JPG or JPEG (max 1MB)
													</p>
													<Input
														type="file"
														accept="image/*"
														className="mt-4 cursor-pointer"
														onChange={handleImageChange}
													/>
												</div>
											)}
											<input
												type="hidden"
												{...field}
												value={field.value || ''}
											/>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => onOpenChange(false)}
								disabled={isUploading || isUpdating}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isUploading || isUpdating}>
								{isUploading || isUpdating ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										{isUploading ? 'Uploading...' : 'Updating...'}
									</>
								) : (
									'Update Organization'
								)}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
