import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getAllPostsMeta } from '@/lib/posts';
import { PostCard } from '@/app/components/PostCard';

export default function HomePage() {
  const posts = getAllPostsMeta();

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <section className="surface-panel flex flex-col gap-8 rounded-3xl p-10">
        <div className="flex flex-col items-start gap-8 md:flex-row md:items-center">
          <div className="relative h-32 w-32 overflow-hidden rounded-full border border-white/20">
            <Image src="/avatar.png" alt="Avatar" fill sizes="128px" className="object-cover" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-blue-300">LYWHLAO / 个人博客</p>
            <h1 className="mt-4 text-4xl font-bold text-white">观瀑亭</h1>
            <p className="mt-4 text-lg text-slate-200">
              欢迎来到我的个人博客！分享所见所闻所想～
            </p>
            <div className="mt-6 flex gap-4">
              <Link
                href="#posts"
                className="rounded-full bg-blue-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-400"
              >
                查看文章
              </Link>
              <a
                href="https://nextjs.org/"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white/80 transition hover:border-white/60"
              >
                Next.js
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="posts" className="mt-16 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">最新文章</h2>
          <span className="text-sm text-slate-400">共 {posts.length} 篇</span>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
          {posts.length === 0 && (
            <p className="text-slate-400">目前还没有文章，快去 content/posts 中添加一篇 MDX 文件吧。</p>
          )}
        </div>
      </section>
    </main>
  );
}
