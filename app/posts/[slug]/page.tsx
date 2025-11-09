import React from 'react';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getPostBySlug, getPostSlugsForParams } from '@/lib/posts';
import { formatDate } from '@/lib/date';
import { mdxComponents } from '@/app/components/mdx-components';

export async function generateStaticParams() {
  return getPostSlugsForParams();
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const { meta } = getPostBySlug(params.slug);
    return {
      title: meta.title,
      description: meta.excerpt ?? `阅读 ${meta.title}`,
    };
  } catch (error) {
    return {
      title: '未找到文章',
    };
  }
}

type PostPageProps = {
  params: {
    slug: string;
  };
};

export default function PostPage({ params }: PostPageProps) {
  let post;
  try {
    post = getPostBySlug(params.slug);
  } catch (error) {
    notFound();
  }

  if (!post) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <div className="surface-panel rounded-3xl p-10">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-300">{formatDate(post.meta.date)}</p>
        <h1 className="mt-3 text-4xl font-bold text-white">{post.meta.title}</h1>
        <p className="mt-2 text-sm text-slate-400">{post.meta.readingTime}</p>
        <div className="mt-8 prose prose-invert max-w-none">
          <MDXRemote source={post.content} components={mdxComponents} />
        </div>
      </div>
    </main>
  );
}
