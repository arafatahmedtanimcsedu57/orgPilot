import type React from 'react';

import type { Metadata } from 'next';
import { IBM_Plex_Sans } from 'next/font/google';

import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/components/auth/auth-provider';

import { Providers } from '@/lib/providers';
import './globals.css';

const ibmPlexSans = IBM_Plex_Sans({
	subsets: ['latin'],
	weight: ['100', '200', '300', '400', '500', '600', '700'],
	display: 'swap',
});

export const metadata: Metadata = {
	title: 'OrgPilot ',
	description: 'Your All-in-One Solution for Organization Management.',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${ibmPlexSans.className}`}>
				<Providers>
					<AuthProvider>
						{children}
						<Toaster />
					</AuthProvider>
				</Providers>
			</body>
		</html>
	);
}
