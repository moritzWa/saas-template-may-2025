import type { ComponentProps } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { blogPosts, BlogPostMetadata } from '@/lib/blog-data';
import { ArrowRight } from 'lucide-react';

function ArticleCard({ post }: { post: BlogPostMetadata }) {
  return (
    <article className="border border-neutral-300 rounded-lg p-6 hover:shadow-lg transition-shadow bg-white">
      <div className="flex items-center gap-4 mb-3">
        <span className="text-sm text-primary/80">{post.date}</span>
        <span className="text-sm text-primary/80">·</span>
        <span className="text-sm text-primary/80">{post.author}</span>
      </div>
      <Link href={`/blog/${post.slug}`} className="group">
        <h3 className="text-2xl font-semibold text-primary mb-3 group-hover:text-accent/80 transition-colors">
          {post.title}
        </h3>
        <p className="text-primary/80 leading-relaxed">{post.description}</p>
      </Link>
    </article>
  );
}

export function BlogSection({ className, ...props }: ComponentProps<'section'>) {
  // Show latest 4 posts
  const latestPosts = blogPosts.slice(0, 4);

  return (
    <section className={cn('py-20 bg-white', className)} {...props}>
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl tablet:text-4xl font-bold text-primary mb-3">
            Read our blog
          </h2>
          <p className="text-lg text-primary/80 max-w-2xl mx-auto">
            Insights on productivity, time management, and building better focus habits.
          </p>
        </div>

        <div className="grid gap-8 mb-8">
          {latestPosts.map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-accent font-semibold hover:underline text-lg"
          >
            Read all blog posts
            <ArrowRight className="size-6" />
          </Link>
        </div>
      </div>
    </section>
  );
}
