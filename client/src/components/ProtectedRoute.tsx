import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { trpc } from '@/utils/trpc';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  const { data: userData, isLoading } = trpc.auth.getUser.useQuery(
    { token: typeof window !== 'undefined' ? localStorage.getItem('accessToken') || '' : '' },
    {
      enabled: typeof window !== 'undefined' && !!localStorage.getItem('accessToken'),
      retry: false,
    }
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }

    if (!isLoading) {
      setIsChecking(false);
    }
  }, [isLoading, router]);

  if (isChecking || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}
