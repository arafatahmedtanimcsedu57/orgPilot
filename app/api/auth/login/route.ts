import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { login, password } = body;

		// In a real app, you would validate credentials against a database
		// This is just a mock implementation to match the expected response format
		if (
			login === 'arafat.csedu.57@gmail.com' &&
			password === 'EYunAM2zFeBOw403'
		) {
			// Set a cookie for authentication
			const mockToken =
				'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhcmFmYXQuY3NlZHUuNTdAZ21haWwuY29tIiwiaWF0IjoxNzQwOTM5MTE0LCJleHAiOjE3NDEwMjU1MTR9.zGDe3YxYMXnfA23E8omgXcNg7I8l5cipP5AtsG66SrrU4kwPZ65Po-YLDa7dFnG9tpRzJgd0qjzSEfZcZg0WKw';

			const response = NextResponse.json({
				success: true,
				message: 'Fetched successfully',
				data: {
					token: mockToken,
					permissions: [],
				},
			});

			response.cookies.set({
				name: 'auth-token',
				value: mockToken,
				httpOnly: true,
				path: '/',
			});

			return response;
		}

		return NextResponse.json(
			{
				success: false,
				message: 'Invalid credentials',
				data: null,
			},
			{ status: 401 },
		);
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				message: 'Internal server error',
				data: null,
			},
			{ status: 500 },
		);
	}
}
