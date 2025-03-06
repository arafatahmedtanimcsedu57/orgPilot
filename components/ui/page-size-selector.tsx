'use client';

import type React from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

interface PageSizeSelectorProps {
	pageSize: number;
	options?: number[];
	type?: 'input' | 'select';
	className?: string;
	disabled?: boolean;
	onPageSizeChange: (size: number) => void;
}

export function PageSizeSelector({
	pageSize,
	options = [5, 10, 25, 50, 100],
	type = 'select',
	className = '',
	disabled = false,
	onPageSizeChange,
}: PageSizeSelectorProps) {
	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newSize = Number.parseInt(event.target.value, 10);
		if (!isNaN(newSize) && newSize > 0) onPageSizeChange(newSize);
	};

	return (
		<div className={`flex items-center gap-2 ${className}`}>
			<Label htmlFor="page-size" className="text-sm whitespace-nowrap">
				Page Size:
			</Label>

			{type === 'input' ? (
				<Input
					id="page-size"
					type="number"
					className="w-16"
					min={1}
					value={pageSize}
					disabled={disabled}
					onChange={handleInputChange}
				/>
			) : (
				<Select
					value={pageSize.toString()}
					onValueChange={(value) =>
						onPageSizeChange(Number.parseInt(value, 10))
					}
					disabled={disabled}
				>
					<SelectTrigger id="page-size" className="w-16">
						<SelectValue placeholder={pageSize.toString()} />
					</SelectTrigger>
					<SelectContent>
						{options.map((option) => (
							<SelectItem key={option} value={option.toString()}>
								{option}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			)}
		</div>
	);
}
