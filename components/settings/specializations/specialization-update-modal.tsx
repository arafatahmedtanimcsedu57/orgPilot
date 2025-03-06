'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { useUpdateSpecializationMutation } from '@/lib/redux/services/organizationsApi';

const formSchema = z.object({
	id: z.number(),
	name: z.string().min(1, { message: 'Specialization name is required' }),
	creationDate: z.string().optional(),
	modificationDate: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type Specialization = {
	id: number;
	name: string | null;
	creationDate: string;
	modificationDate: string;
};

interface SpecializationUpdateModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	specialization: Specialization | null;
}

export function SpecializationUpdateModal({
	open,
	onOpenChange,
	specialization,
}: SpecializationUpdateModalProps) {
	const { toast } = useToast();
	const [updateSpecialization, { isLoading: isUpdating }] =
		useUpdateSpecializationMutation();

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: specialization?.id || 0,
			name: specialization?.name || '',
			creationDate: specialization?.creationDate,
			modificationDate: specialization?.modificationDate,
		},
	});

	// Update form when specialization changes
	useEffect(() => {
		if (specialization) {
			form.reset({
				id: specialization.id,
				name: specialization.name || '',
				creationDate: specialization.creationDate,
				modificationDate: specialization.modificationDate,
			});
		}
	}, [specialization, form]);

	const onSubmit = async (values: FormValues) => {
		try {
			const result = await updateSpecialization(values).unwrap();

			if (result.success) {
				toast({
					title: 'Specialization updated',
					description: 'The specialization has been updated successfully',
				});

				// Close modal
				onOpenChange(false);
			} else {
				toast({
					variant: 'destructive',
					title: 'Update failed',
					description: result.message || 'Failed to update specialization',
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
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Update Specialization</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Specialization Name</FormLabel>
									<FormControl>
										<Input placeholder="Enter specialization name" {...field} />
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
									'Update Specialization'
								)}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
