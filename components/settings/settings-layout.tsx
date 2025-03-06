'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings, Users, Stethoscope, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingsLayoutProps {
	children: ReactNode;
}

const settingsNavItems = [
	{
		title: 'General',
		href: '/settings',
		icon: Settings,
	},
	{
		title: 'Specializations',
		href: '/settings/specializations',
		icon: Stethoscope,
	},
	{
		title: 'Organizations',
		href: '/dashboard',
		icon: Building2,
	},
	{
		title: 'Users',
		href: '/settings/users',
		icon: Users,
	},
];

export function SettingsLayout({ children }: SettingsLayoutProps) {
	const pathname = usePathname();

	return (
		<div className="flex flex-col space-y-8 lg:flex-row lg:space-x-8 lg:space-y-0">
			<aside className="lg:w-1/5">
				<nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
					{settingsNavItems.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								'flex items-center rounded-md px-3 py-2 text-sm font-medium',
								pathname === item.href
									? 'bg-primary text-primary-foreground'
									: 'text-muted-foreground hover:bg-muted hover:text-foreground',
							)}
						>
							<item.icon className="mr-3 h-5 w-5" />
							{item.title}
						</Link>
					))}
				</nav>
			</aside>
			<div className="flex-1">{children}</div>
		</div>
	);
}
