import Head from 'next/head';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { blogPosts } from '@/lib/blog-data';

export default function BlogPage() {
  return (
    <>
      <Head>
        <title>Blog - PROJECT_NAME</title>
        <meta name="description" content="Read our latest blog posts and updates" />
      </Head>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="container mx-auto px-4 py-8 pt-24">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">Blog</h1>

            <div className="space-y-8">
              {blogPosts.map((post) => (
                <article key={post.slug} className="border-b pb-8">
                  <Link href={`/blog/${post.slug}`} className="group">
                    <h2 className="text-2xl font-semibold mb-2 group-hover:text-blue-600">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">{post.description}</p>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      <time>{post.date}</time> • <span>{post.author}</span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
