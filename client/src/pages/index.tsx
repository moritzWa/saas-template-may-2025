import Head from 'next/head';
import { Navbar } from '@/components/navbar';
import LandingPage from '@/components/LandingPage';

export default function Home() {
  return (
    <>
      <Head>
        <title>PROJECT_NAME - AI Research Assistant</title>
        <meta
          name="description"
          content="Intelligent web research assistant that helps you make informed decisions."
        />
        <meta property="og:title" content="PROJECT_NAME" />
        <meta
          property="og:description"
          content="AI agents that research and output tables"
        />
        <meta property="og:type" content="website" />
      </Head>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="pt-16">
          <LandingPage />
        </main>
      </div>
    </>
  );
}
