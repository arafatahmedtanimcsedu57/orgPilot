'use client';

import { useState, memo } from 'react';
import { Pencil, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { SpecializationFormModal } from '../specialization-form-modal';
import { SpecializationUpdateModal } from '../specialization-update-modal';
import type { Specialization } from '@/types/organization';

function _CreateSpecializationAction() {
	const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

	return (
		<>
			<Button
				size="sm"
				className="flex items-center gap-1 text-xs shadow-xl"
				onClick={() => setIsFormOpen(true)}
			>
				<Plus className="h-4 w-4" />
				Add Specialization
			</Button>

			{isFormOpen ? (
				<SpecializationFormModal
					open={isFormOpen}
					onOpenChange={setIsFormOpen}
				/>
			) : (
				<></>
			)}
		</>
	);
}

function _UpdateSpecializationAction({
	specialization,
}: {
	specialization: Specialization | null;
}) {
	const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);

	const handleUpdateClick = () => {
		setIsUpdateModalOpen(true);
	};

	return (
		<>
			<Button
				variant="ghost"
				size="icon"
				onClick={() => handleUpdateClick()}
				className="h-8 w-8"
			>
				<Pencil className="h-4 w-4" />
			</Button>

			{isUpdateModalOpen ? (
				<SpecializationUpdateModal
					open={isUpdateModalOpen}
					onOpenChange={setIsUpdateModalOpen}
					specialization={specialization}
				/>
			) : (
				<></>
			)}
		</>
	);
}

export const CreateSpecializationAction = memo(_CreateSpecializationAction);
export const UpdateSpecializationAction = memo(_UpdateSpecializationAction);
