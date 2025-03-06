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
		title: 'Profile',
		href: '/profile',
		icon: User,
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

						{/* <div className="absolute top-0 -left-4 w-20 h-20 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
						<div className="absolute top-0 -right-4 w-20 h-20 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
						<div className="absolute -bottom-8 left-20 w-20 h-20 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div> */}
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
