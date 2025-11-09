'use client';

import React from 'react';
import { useTheme } from '@/app/components/theme-provider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  return (
    <button
      type="button"
      aria-label="切换主题"
      onClick={toggleTheme}
      className="theme-toggle"
    >
      <span className="text-lg">{isLight ? '🌙' : '☀️'}</span>
      <span className="text-sm font-medium">{isLight ? '夜间模式' : '日间模式'}</span>
    </button>
  );
}
