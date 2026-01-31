import Head from 'next/head';
import { Header } from '@/components/header/header';
import { LoginForm } from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Login - PROJECT_NAME</title>
        <meta name="description" content="Login to your account" />
      </Head>
      <main className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 pt-24 pb-16 px-4">
          <LoginForm className="flex justify-center items-center" />
        </div>
      </main>
    </>
  );
}
