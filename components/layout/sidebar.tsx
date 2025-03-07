'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, User, Settings, Layers } from 'lucide-react';

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar';

import { cn } from '@/lib/utils';

const navItems = [
	{
		title: 'Dashboard',
		href: '/dashboard',
		icon: LayoutDashboard,
	},
	
	{
		title: 'Settings',
		href: '/settings',
		icon: Settings,
	},
];

export function AppSidebar() {
	const pathname = usePathname();

	return (
		<Sidebar className="!border-none">
			<SidebarHeader className="">
				<div className="flex h-14 items-center px-4">
					<Layers className="mr-2 h-10 w-10 text-primary" />

					<Link href="/dashboard" className="relative">
						<p className="text-xl font-extrabold">OrgPilot</p>
						<p className="text-xs">Controll your system</p>
					</Link>
				</div>
			</SidebarHeader>

			<SidebarContent className="m-4">
				<SidebarGroup className="p-4 border border-muted-foreground/10 rounded-3xl bg-muted-foreground/10">
					<SidebarGroupLabel>Main Menu</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu className="border border-muted-foreground/10 rounded-2xl py-4 bg-muted-foreground/10">
							{navItems.map((item) => (
								<SidebarMenuItem>
									<SidebarMenuButton
										asChild
										isActive={
											pathname === item.href ||
											(item.href !== '/' && pathname?.startsWith(item.href))
										}
									>
										<Link
											key={item.href}
											href={item.href}
											className={cn(
												'',
												pathname === item.href ||
													(item.href !== '/' && pathname?.startsWith(item.href))
													? 'text-primary'
													: '',
											)}
										>
											<div className="flex items-center gap-4 p-2">
												<div
													className={cn(
														'',
														pathname === item.href ||
															(item.href !== '/' &&
																pathname?.startsWith(item.href))
															? ''
															: '',
													)}
												>
													<item.icon className="" />
												</div>
												<span>{item.title}</span>
											</div>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
