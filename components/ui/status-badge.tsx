import { Badge } from './badge';

const StatusBadge = ({ type }: { type: string }) => {
	const classNames: Record<any, string> = {
		ACTIVE: 'bg-green-600/40 text-green-950 !border-0',
		INACTIVE: 'bg-red-600/40 text-rose-950 !border-0',
		DEFAULT: '',
	} as const;

	return (
		<Badge
			variant={'outline'}
			className={`hover:bg px-4 py-3 text-xs font-semibold leading-[0] w-max ${classNames[type]}`}
		>
			{type}
		</Badge>
	);
};

export { StatusBadge };
