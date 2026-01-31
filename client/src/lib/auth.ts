import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../../server/src/index.ts';

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';

export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const client = createTRPCProxyClient<AppRouter>({
      links: [
        httpBatchLink({
          url: `${serverUrl}/trpc`,
        }),
      ],
    });

    const response = await client.auth.refreshToken.mutate({
      refreshToken,
    });

    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('token', response.accessToken);

    return response.accessToken;
  } catch (error) {
    console.error('Token refresh failed:', error);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw error;
  }
}
