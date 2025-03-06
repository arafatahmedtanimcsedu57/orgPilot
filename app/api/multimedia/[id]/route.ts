import { type NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	const id = params.id;
	const cookieStore = cookies();
	const token = cookieStore.get('auth-token')?.value;

	if (!token) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		// First, get the image URL from the preview endpoint
		const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_API_PATH}/${process.env.NEXT_PUBLIC_API_VERSION}/multimedia/preview-by-id/${id}`;

		const response = await fetch(apiUrl, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			cache: 'no-store',
		});

		if (!response.ok) {
			// If the API returns a 404, return a placeholder image
			if (response.status === 404) {
				return getPlaceholderImage();
			}

			return NextResponse.json(
				{ error: `Failed to fetch multimedia preview: ${response.statusText}` },
				{ status: response.status },
			);
		}

		const jsonData = await response.json();

		if (!jsonData.success || !jsonData.data) {
			return getPlaceholderImage();
		}

		// Get the image URL from the response
		const imageUrl = jsonData.data;

		// Now fetch the actual image from the S3 URL
		const imageResponse = await fetch(imageUrl, {
			cache: 'no-store',
		});

		if (!imageResponse.ok) {
			// If S3 returns a 404, return a placeholder image
			if (imageResponse.status === 404) {
				return getPlaceholderImage();
			}

			return NextResponse.json(
				{ error: `Failed to fetch image from S3: ${imageResponse.statusText}` },
				{ status: imageResponse.status },
			);
		}

		const contentType =
			imageResponse.headers.get('content-type') || 'application/octet-stream';
		const imageData = await imageResponse.arrayBuffer();

		return new NextResponse(imageData, {
			headers: {
				'Content-Type': contentType,
				'Cache-Control': 'public, max-age=86400',
			},
		});
	} catch (error) {
		console.error('Error fetching multimedia:', error);
		return getPlaceholderImage();
	}
}

// Helper function to return a placeholder image
function getPlaceholderImage() {
	// Generate a simple SVG placeholder
	const svg = `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" fill="#f0f0f0"/>
    <text x="50%" y="50%" font-family="Arial" font-size="6" fill="#888" text-anchor="middle" dominant-baseline="middle">No Image</text>
  </svg>`;

	return new NextResponse(svg, {
		headers: {
			'Content-Type': 'image/svg+xml',
			'Cache-Control': 'public, max-age=86400',
		},
	});
}
