import React from 'react';

export interface BlogPostProps {
  title: string;
  date: string;
  author: string;
  content: React.ReactNode;
  description: string;
}

export const BlogPost: React.FC<BlogPostProps> = ({
  title,
  date,
  author,
  content,
}) => {
  return (
    <div className="max-w-3xl mx-auto">
      <article className="px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{title}</h1>
          <div className="text-gray-600 dark:text-gray-400">
            <time>{date}</time> • <span>{author}</span>
          </div>
        </header>

        <div className="prose prose-lg dark:prose-invert prose-headings:font-bold prose-a:text-blue-600">
          {content}
        </div>
      </article>
    </div>
  );
};
