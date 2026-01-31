import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowLeft } from 'lucide-react';
import { Header } from '@/components/header/header';
import { Footer } from '@/components/footer/footer';
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

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return (
      <main className="marketing min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 pt-24 pb-16 px-4">
          <div className="max-w-3xl mx-auto">
            <p>Post not found</p>
            <Link href="/blog">
              <Button variant="ghost" className="mt-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>{post.title} - PROJECT_NAME</title>
        <meta name="description" content={post.description} />
      </Head>
      <main className="marketing min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 pt-24 pb-16 px-4">
          <div className="max-w-3xl mx-auto">
            <Link href="/blog">
              <Button variant="ghost" className="mb-4">
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
        </div>
        <Footer />
      </main>
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
