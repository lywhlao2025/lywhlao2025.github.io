import 'server-only';

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const postsDirectory = path.join(process.cwd(), 'content', 'posts');

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  readingTime: string;
};

export type Post = {
  meta: PostMeta;
  content: string;
};

function ensurePostsDirectory() {
  if (!fs.existsSync(postsDirectory)) {
    throw new Error(`Posts directory not found: ${postsDirectory}`);
  }
}

function getPostSlugs() {
  ensurePostsDirectory();
  return fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''));
}

export function getAllPostsMeta(): PostMeta[] {
  return getPostSlugs()
    .map((slug) => getPostBySlug(slug).meta)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): Post {
  ensurePostsDirectory();
  const realSlug = slug.replace(/\.mdx$/, '');
  const fullPath = path.join(postsDirectory, `${realSlug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const meta: PostMeta = {
    slug: realSlug,
    title: data.title ?? realSlug,
    date: data.date ?? new Date().toISOString(),
    excerpt: data.excerpt ?? data.description,
    readingTime: readingTime(content).text,
  };

  return { meta, content };
}

export function getPostSlugsForParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}
