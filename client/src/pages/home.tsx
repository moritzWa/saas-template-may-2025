import Head from 'next/head';
import { AppLayout } from '@/components/AppLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function HomePage() {
  return (
    <ProtectedRoute>
      <Head>
        <title>Home - PROJECT_NAME</title>
      </Head>
      <AppLayout>
        <div className="max-w-5xl mx-auto px-4 py-16">
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-bold">Welcome to PROJECT_NAME</h1>
            <p className="text-lg text-muted-foreground">Your minimalistic SaaS template</p>
          </div>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
