'use client';

import { useState, memo } from 'react';
import { Pencil, Plus } from 'lucide-react';

import { OrganizationFormModal } from '../organization-form-modal';
import { OrganizationUpdateModal } from '../organization-update-modal';
import { LocationUpdateModal } from '@/components/location/location-update-modal';
import { LocationFormModal } from '@/components/location/location-form-modal';
import { ProviderFormModal } from '@/components/provider/provider-form-modal';
import { ProviderUpdateModal } from '@/components/provider/provider-update-modal';
import { Button } from '@/components/ui/button';

import type { Location, Organization, Provider } from '@/types/organization';

function _CreateOrganizationAction() {
	const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

	return (
		<>
			<Button
				onClick={() => setIsFormOpen(true)}
				className="flex items-center gap-1 shadow-xl"
			>
				<Plus className="h-4 w-4" />
				Add Organization
			</Button>

			{/* Create Organization */}
			{isFormOpen ? (
				<OrganizationFormModal open={isFormOpen} onOpenChange={setIsFormOpen} />
			) : (
				<></>
			)}
		</>
	);
}

function _UpdateOrganizationAction({ org }: { org: Organization }) {
	const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);

	const handleUpdateClick = () => {
		setIsUpdateModalOpen(true);
	};

	return (
		<>
			<Button
				size="sm"
				variant="outline"
				className="border border-muted-foreground/10 bg-muted-foreground/10 text-primary rounded-lg shadow-xl"
				onClick={() => handleUpdateClick()}
			>
				<Pencil className="h-4 w-4" />
			</Button>

			{/* Update Organization */}
			{isUpdateModalOpen ? (
				<OrganizationUpdateModal
					open={isUpdateModalOpen}
					organization={org}
					onOpenChange={setIsUpdateModalOpen}
				/>
			) : (
				<></>
			)}
		</>
	);
}

function _CreateLocationAction({ org }: { org: Organization }) {
	const [isLocationFormOpen, setIsLocationFormOpen] = useState<boolean>(false);

	const handleAddLocationClick = () => {
		setIsLocationFormOpen(true);
	};

	return (
		<>
			<Button
				size="sm"
				className="flex items-center gap-1 text-xs shadow-xl"
				onClick={() => handleAddLocationClick()}
			>
				<Plus className="h-3 w-3" />
				Add Location
			</Button>

			{/* Create Location */}
			{isLocationFormOpen ? (
				<LocationFormModal
					open={isLocationFormOpen}
					organizationId={org?.id}
					onOpenChange={setIsLocationFormOpen}
				/>
			) : (
				<></>
			)}
		</>
	);
}

function _UpdateLocationAction({ location }: { location: Location }) {
	const [isLocationUpdateModalOpen, setIsLocationUpdateModalOpen] =
		useState<boolean>(false);

	const handleLocationUpdateClick = () => {
		setIsLocationUpdateModalOpen(true);
	};

	return (
		<>
			<Button
				variant="ghost"
				size="sm"
				className="border border-muted-foreground/10 bg-muted-foreground/10 text-primary rounded-lg shadow-xl"
				onClick={() => handleLocationUpdateClick()}
			>
				<Pencil className="h-4 w-4" />
			</Button>

			{/* Update Location */}
			{isLocationUpdateModalOpen ? (
				<LocationUpdateModal
					open={isLocationUpdateModalOpen}
					location={location}
					onOpenChange={setIsLocationUpdateModalOpen}
				/>
			) : (
				<></>
			)}
		</>
	);
}

function _CreateProviderAction({ location }: { location: Location }) {
	const [isProviderFormOpen, setIsProviderFormOpen] = useState<boolean>(false);

	const handleAddProviderClick = () => {
		setIsProviderFormOpen(true);
	};

	return (
		<>
			<Button
				size="sm"
				className="flex items-center gap-1 text-xs shadow-xl"
				onClick={() => handleAddProviderClick()}
			>
				<Plus className="h-3 w-3" />
				Add Provider
			</Button>

			{/* Create Provider */}
			{isProviderFormOpen ? (
				<ProviderFormModal
					open={isProviderFormOpen}
					locationId={location.id}
					onOpenChange={setIsProviderFormOpen}
				/>
			) : (
				<></>
			)}
		</>
	);
}

function _UpdateProviderAction({ provider }: { provider: Provider }) {
	const [isProviderUpdateModalOpen, setIsProviderUpdateModalOpen] =
		useState<boolean>(false);

	const handleLocationUpdateClick = () => {
		setIsProviderUpdateModalOpen(true);
	};

	return (
		<>
			<Button
				size="sm"
				variant="ghost"
				className="border border-muted-foreground/10 bg-muted-foreground/10 text-primary rounded-lg shadow-xl"
				onClick={(e) => handleLocationUpdateClick()}
			>
				<Pencil className="h-4 w-4" />
			</Button>

			{/* Update Provider */}
			{isProviderUpdateModalOpen ? (
				<ProviderUpdateModal
					open={isProviderUpdateModalOpen}
					providerId={provider.id}
					onOpenChange={setIsProviderUpdateModalOpen}
				/>
			) : (
				<></>
			)}
		</>
	);
}

export const CreateOrganizationAction = memo(_CreateOrganizationAction);
export const UpdateOrganizationAction = memo(_UpdateOrganizationAction);
export const CreateLocationAction = memo(_CreateLocationAction);
export const UpdateLocationAction = memo(_UpdateLocationAction);
export const CreateProviderAction = memo(_CreateProviderAction);
export const UpdateProviderAction = memo(_UpdateProviderAction);
