import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { BlogPost } from '@/components/BlogPost';
import { Button } from '@/components/ui/button';
import { getBlogPostBySlug, blogPosts } from '@/lib/blog-data';
import { GetStaticPaths, GetStaticProps } from 'next';

interface BlogPostPageProps {
  slug: string;
}

export default function BlogPostPage({ slug }: BlogPostPageProps) {
  const router = useRouter();
  const post = getBlogPostBySlug(slug);

  // Handle fallback state
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="container mx-auto px-4 py-8 pt-24">
          <p>Post not found</p>
          <Link href="/blog">
            <Button variant="ghost" className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{post.title} - PROJECT_NAME</title>
        <meta name="description" content={post.description} />
      </Head>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="container mx-auto px-4 py-8 pt-24">
          <div className="max-w-3xl mx-auto">
            <Link href="/blog">
              <Button variant="ghost" className="mt-4 mb-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
            <BlogPost
              title={post.title}
              date={post.date}
              author={post.author}
              description={post.description}
              content={post.content}
            />
          </div>
        </main>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = blogPosts.map((post) => ({
    params: { slug: post.slug },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<BlogPostPageProps> = async ({ params }) => {
  const slug = params?.slug as string;

  return {
    props: {
      slug,
    },
  };
};
