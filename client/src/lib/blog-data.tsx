import { JSX } from 'react';

export interface BlogPostMetadata {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  content: JSX.Element;
}

export const blogPosts: BlogPostMetadata[] = [
  {
    slug: 'quick-start-guide',
    title: 'Quick Start Guide',
    description: 'Get started with our platform in minutes',
    date: '2024-05-01',
    author: 'Team',
    content: (
      <>
        <p>Hello world</p>
      </>
    ),
  },
];

export const getBlogPostBySlug = (slug: string) => {
  return blogPosts.find((post) => post.slug === slug);
};
