'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { ThemeToggle } from '@/components/theme-toggle';
import { SidebarTrigger } from '@/components/ui/sidebar';

import { useLogoutMutation } from '@/lib/redux/services/authApi';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { clearCredentials } from '@/lib/redux/features/authSlice';
import { Input } from '../ui/input';

export function Navbar() {
	const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

	const router = useRouter();
	const { toast } = useToast();
	const dispatch = useAppDispatch();

	const { user } = useAppSelector((state) => state.auth);

	const handleLogout = async () => {
		try {
			await logout().unwrap();

			document.cookie =
				'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict';

			dispatch(clearCredentials());

			toast({
				title: 'Logged out',
				description: 'You have been logged out successfully',
			});

			router.push('/login');
		} catch (error) {
			toast({
				variant: 'destructive',
				title: 'Error',
				description: 'Failed to log out',
			});
		}
	};

	return (
		<header className="sticky top-0 z-10 flex h-16 items-center gap-4 px-4 border border-muted-foreground/10 bg-muted-foreground/10 m-6 rounded-2xl">
			<div className="border border-muted-foreground/10 bg-muted-foreground/10 rounded-full min-h-10 min-w-10 flex items-center justify-center">
				<SidebarTrigger className="hover:bg-transparent" />
			</div>

			<div className="relative hidden flex-1 md:flex">
				<Input
					className="min-w-[150px] max-w-[500px] bg-muted border border-muted-foreground/20"
					placeholder="Search"
				/>
			</div>

			<div className="ml-auto flex  items-center gap-2">
				<ThemeToggle />

				<div className="ms-2 text-sm whitespace-nowrap">Welcome Back ,</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="relative h-8 w-8 rounded-full">
							<div className="flex h-8 w-8 items-center justify-center">
								{user?.login?.charAt(0)?.toLocaleUpperCase() || 'U'}
							</div>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>My Account</DropdownMenuLabel>
						<DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
							{user?.login}
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<Link
								href="/profile"
								className="flex cursor-pointer items-center"
							>
								<User className="mr-2 h-4 w-4" />
								<span>Profile</span>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={handleLogout}
							disabled={isLoggingOut}
							className="flex cursor-pointer items-center text-destructive"
						>
							<LogOut className="mr-2 h-4 w-4" />
							<span>{isLoggingOut ? 'Logging out...' : 'Log out'}</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	);
}
