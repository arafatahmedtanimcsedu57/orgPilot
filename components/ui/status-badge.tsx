import { Badge } from './badge';

const StatusBadge = ({ type }: { type: string }) => {
	const classNames: Record<any, string> = {
		ACTIVE: 'bg-green-600/20 text-green-600 border border-green-700',
		INACTIVE: 'bg-red-600/20 text-red-700 border border-red-700',
		DEFAULT: '',
	} as const;

	return (
		<Badge
			variant={'outline'}
			className={`hover:bg px-4 py-2 text-xs font-normal leading-[0] w-max ${classNames[type]}`}
		>
			{type}
		</Badge>
	);
};

export { StatusBadge };
