import React from 'react';
import type { MDXRemoteProps } from 'next-mdx-remote/rsc';

export const mdxComponents: MDXRemoteProps['components'] = {
  h2: (props) => <h2 className="mt-10 text-3xl font-semibold text-white" {...props} />,
  h3: (props) => <h3 className="mt-8 text-2xl font-semibold text-white" {...props} />,
  p: (props) => <p className="mt-4 leading-relaxed text-slate-200" {...props} />,
  strong: (props) => <strong className="text-white" {...props} />,
  a: (props) => (
    <a
      className="text-blue-300 underline decoration-dotted underline-offset-4 transition hover:text-blue-200"
      {...props}
    />
  ),
  ul: (props) => <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-200" {...props} />,
  ol: (props) => <ol className="mt-4 list-decimal space-y-2 pl-5 text-slate-200" {...props} />,
  code: (props) => (
    <code className="rounded bg-slate-900/60 px-2 py-1 font-mono text-sm text-blue-200" {...props} />
  ),
  pre: ({ children, ...rest }) => (
    <pre
      className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-sm"
      {...rest}
    >
      {children}
    </pre>
  ),
};
