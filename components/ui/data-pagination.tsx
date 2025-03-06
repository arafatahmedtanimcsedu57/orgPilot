'use client';

import {
	ChevronFirstIcon,
	ChevronLastIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

interface DataPaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	disabled?: boolean;
	className?: string;
}

export function DataPagination({
	currentPage,
	totalPages,
	onPageChange,
	disabled = false,
	className = '',
}: DataPaginationProps) {
	return (
		<div className={`flex items-center gap-1 ${className}`}>
			<Button
				variant="outline"
				size="sm"
				onClick={() => onPageChange(0)}
				disabled={disabled || currentPage === 0}
			>
				<ChevronFirstIcon />
			</Button>
			<Button
				variant="outline"
				size="sm"
				onClick={() => onPageChange(currentPage - 1)}
				disabled={disabled || currentPage === 0}
			>
				<ChevronLeftIcon />
			</Button>

			{totalPages > 7 ? (
				<>
					{currentPage > 2 && (
						<Button
							variant={currentPage === 0 ? 'default' : 'outline'}
							size="sm"
							onClick={() => onPageChange(0)}
							disabled={disabled}
						>
							1
						</Button>
					)}

					{currentPage > 3 && <span className="px-2">...</span>}

					{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
						const pageNum =
							Math.min(Math.max(currentPage - 2, 0), totalPages - 5) + i;
						return pageNum < totalPages ? (
							<Button
								key={pageNum}
								variant={currentPage === pageNum ? 'default' : 'outline'}
								size="sm"
								onClick={() => onPageChange(pageNum)}
								disabled={disabled}
							>
								{pageNum + 1}
							</Button>
						) : null;
					})}

					{/* Show ellipsis if not showing last pages */}
					{currentPage < totalPages - 4 && <span className="px-2">...</span>}

					{/* Always show last page */}
					{currentPage < totalPages - 3 && (
						<Button
							variant={currentPage === totalPages - 1 ? 'default' : 'outline'}
							size="sm"
							onClick={() => onPageChange(totalPages - 1)}
							disabled={disabled}
						>
							{totalPages}
						</Button>
					)}
				</>
			) : (
				Array.from({ length: totalPages }, (_, i) => (
					<Button
						key={i}
						variant={currentPage === i ? 'default' : 'outline'}
						size="sm"
						onClick={() => onPageChange(i)}
						disabled={disabled}
					>
						{i + 1}
					</Button>
				))
			)}

			<Button
				variant="outline"
				size="sm"
				onClick={() => onPageChange(currentPage + 1)}
				disabled={disabled || currentPage === totalPages - 1}
			>
				<ChevronRightIcon />
			</Button>
			<Button
				variant="outline"
				size="sm"
				onClick={() => onPageChange(totalPages - 1)}
				disabled={disabled || currentPage === totalPages - 1}
			>
				<ChevronLastIcon />
			</Button>
		</div>
	);
}
