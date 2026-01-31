import Head from 'next/head';
import Link from 'next/link';
import { Header } from '@/components/header/header';
import { Footer } from '@/components/footer/footer';
import { useForceLightMode } from '@/hooks/useForceLightMode';
import { blogPosts } from '@/lib/blog-data';

export default function BlogPage() {
  useForceLightMode();
  return (
    <>
      <Head>
        <title>Blog - PROJECT_NAME</title>
        <meta name="description" content="Read our latest blog posts and updates" />
      </Head>
      <main className="marketing min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 pt-24 pb-16 px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">Blog</h1>

            <div className="space-y-8">
              {blogPosts.map((post) => (
                <article key={post.slug} className="border-b pb-8">
                  <Link href={`/blog/${post.slug}`} className="group">
                    <h2 className="text-2xl font-semibold mb-2 group-hover:text-primary/70">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground mb-2">{post.description}</p>
                    <div className="text-sm text-muted-foreground">
                      <time>{post.date}</time> · <span>{post.author}</span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
}
