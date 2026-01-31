import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { trpc } from '@/utils/trpc';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const token = getToken();

  const { isLoading } = trpc.auth.getUser.useQuery(
    { token: token || '' },
    {
      enabled: !!token,
      retry: false,
    }
  );

  useEffect(() => {
    if (typeof window !== 'undefined' && !getToken()) {
      router.push('/landing');
    }
  }, [router]);

  if (typeof window === 'undefined' || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}
