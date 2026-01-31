import Head from 'next/head';
import { Header } from '@/components/header/header';
import { Footer } from '@/components/footer/footer';

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About - PROJECT_NAME</title>
        <meta name="description" content="Learn more about PROJECT_NAME and our mission." />
      </Head>
      <main className="marketing min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 pt-24 pb-16 px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">About PROJECT_NAME</h1>

            <div className="prose prose-lg dark:prose-invert">
              <p className="text-lg text-muted-foreground mb-6">
                PROJECT_NAME is a modern SaaS template designed to help developers launch their
                products faster. We believe in providing the best tools and infrastructure so you
                can focus on what matters most - building great features for your users.
              </p>

              <h2 className="text-2xl font-semibold mt-12 mb-4">Our Mission</h2>
              <p className="text-muted-foreground mb-6">
                We aim to eliminate the boilerplate and repetitive setup that slows down every new
                project. With authentication, payments, and a beautiful UI out of the box, you can
                go from idea to launch in record time.
              </p>

              <h2 className="text-2xl font-semibold mt-12 mb-4">The Stack</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                <li>Next.js 15 with TypeScript for the frontend</li>
                <li>Deno for a fast, secure backend</li>
                <li>MongoDB for flexible data storage</li>
                <li>Stripe for payments</li>
                <li>Google OAuth for authentication</li>
                <li>Tailwind CSS and shadcn/ui for beautiful UI</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-12 mb-4">Contact</h2>
              <p className="text-muted-foreground">
                Have questions or feedback? Reach out to us at{' '}
                <a href="mailto:hello@example.com" className="text-foreground underline">
                  hello@example.com
                </a>
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
}
