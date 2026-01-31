import Head from 'next/head';
import { Navbar } from '@/components/Navbar';
import { LoginForm } from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Login - PROJECT_NAME</title>
        <meta name="description" content="Login to your account" />
      </Head>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="container mx-auto px-4 py-8 pt-24">
          <LoginForm className="flex justify-center items-center" />
        </main>
      </div>
    </>
  );
}
