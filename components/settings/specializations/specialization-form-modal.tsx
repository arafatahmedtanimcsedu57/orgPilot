'use client';

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
import { useCreateSpecializationMutation } from '@/lib/redux/services/organizationsApi';

const formSchema = z.object({
	name: z.string().min(1, { message: 'Specialization name is required' }),
});

type FormValues = z.infer<typeof formSchema>;

interface SpecializationFormModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function SpecializationFormModal({
	open,
	onOpenChange,
}: SpecializationFormModalProps) {
	const { toast } = useToast();
	const [createSpecialization, { isLoading: isCreating }] =
		useCreateSpecializationMutation();

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
		},
	});

	const onSubmit = async (values: FormValues) => {
		try {
			const result = await createSpecialization(values).unwrap();

			if (result.success) {
				toast({
					title: 'Specialization created',
					description: 'The specialization has been created successfully',
				});

				// Reset form and close modal
				form.reset();
				onOpenChange(false);
			} else {
				toast({
					variant: 'destructive',
					title: 'Creation failed',
					description: result.message || 'Failed to create specialization',
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
					<DialogTitle>Add New Specialization</DialogTitle>
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
								disabled={isCreating}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isCreating}>
								{isCreating ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Creating...
									</>
								) : (
									'Create Specialization'
								)}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
