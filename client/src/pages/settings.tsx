import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { trpc } from '@/utils/trpc';

interface UserInfo {
  id: string;
  name: string;
  email: string;
  picture?: string | null;
  hasSubscription?: boolean;
  subscriptionEndsAt?: string | null;
}

const LoadingSkeleton = () => (
  <AppLayout>
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium">Subscription Status</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-10 w-40" />
          </CardContent>
        </Card>

        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  </AppLayout>
);

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    isLoading: userLoading,
    data: userData,
    error: queryError,
  } = trpc.auth.getUser.useQuery(
    { token: typeof window !== 'undefined' ? localStorage.getItem('accessToken') || '' : '' },
    {
      enabled: typeof window !== 'undefined' && !!localStorage.getItem('accessToken'),
    }
  );

  const createCheckoutSession = trpc.payments.createCheckoutSession.useMutation();
  const createPortalSession = trpc.payments.createPortalSession.useMutation();

  useEffect(() => {
    if (userData) {
      setUser({
        id: userData.id || '',
        name: userData.name || '',
        email: userData.email || '',
        picture: userData.picture,
        hasSubscription: userData.hasSubscription,
        subscriptionEndsAt: userData.subscriptionEndsAt,
      });
    }
    if (queryError) {
      setError(queryError.message);
    }
  }, [userData, queryError]);

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);
      const { url } = await createCheckoutSession.mutateAsync({
        token: localStorage.getItem('accessToken') || '',
      });
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      setError('Failed to create checkout session');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      setIsLoading(true);
      const { url } = await createPortalSession.mutateAsync({
        token: localStorage.getItem('accessToken') || '',
      });
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      setError('Failed to open subscription management');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    router.push('/login');
  };

  if (userLoading) {
    return (
      <ProtectedRoute>
        <Head>
          <title>Settings - PROJECT_NAME</title>
        </Head>
        <LoadingSkeleton />
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <Head>
          <title>Settings - PROJECT_NAME</title>
        </Head>
        <AppLayout>
          <div className="max-w-4xl mx-auto p-4 text-red-500">Error: {error}</div>
        </AppLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Head>
        <title>Settings - PROJECT_NAME</title>
      </Head>
      <AppLayout>
        <div className="max-w-4xl mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Settings</h1>
          {user && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                {user.picture && (
                  <img
                    src={user.picture}
                    alt="Profile"
                    className="w-16 h-16 rounded-full"
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                  />
                )}
                <div>
                  <h2 className="text-xl font-semibold">{user.name}</h2>
                  <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-medium">Subscription Status</h3>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">
                    {user.hasSubscription ? '✅ Active Subscription' : '❌ No Active Subscription'}
                  </p>
                  {user.subscriptionEndsAt && (
                    <p className="mb-4 text-amber-600 dark:text-amber-400">
                      ⚠️ Cancels on {new Date(user.subscriptionEndsAt).toLocaleDateString()}
                    </p>
                  )}
                  {user.hasSubscription ? (
                    <Button
                      onClick={handleManageSubscription}
                      disabled={isLoading}
                      variant="secondary"
                    >
                      {isLoading ? 'Loading...' : 'Manage Subscription'}
                    </Button>
                  ) : (
                    <Button onClick={handleSubscribe} disabled={isLoading}>
                      {isLoading ? 'Loading...' : 'Subscribe - $29/month'}
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Button onClick={handleLogout} variant="destructive">
                Logout
              </Button>
            </div>
          )}
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
