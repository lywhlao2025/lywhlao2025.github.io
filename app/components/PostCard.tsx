import React from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/date';
import type { PostMeta } from '@/lib/posts';

interface PostCardProps {
  post: PostMeta;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="surface-card block rounded-2xl p-6 shadow-xl"
    >
      <p className="text-sm uppercase tracking-[0.2em] text-blue-300">{formatDate(post.date)}</p>
      <h3 className="mt-2 text-2xl font-semibold text-white">{post.title}</h3>
      {post.excerpt && <p className="mt-3 text-base text-slate-200">{post.excerpt}</p>}
      <p className="mt-4 text-sm text-slate-400">{post.readingTime}</p>
    </Link>
  );
}
