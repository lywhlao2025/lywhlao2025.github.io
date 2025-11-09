import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/app/components/theme-provider';
import { ThemeToggle } from '@/app/components/ThemeToggle';

export const metadata: Metadata = {
  title: 'Laos Notes',
  description: '个人笔记与想法，使用 Next.js + MDX 构建。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        <ThemeProvider>
          <ThemeToggle />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
