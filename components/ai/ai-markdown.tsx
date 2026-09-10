'use client'

import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'

type AiMarkdownProps = {
  children: string
}

export function AiMarkdown({ children }: AiMarkdownProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        a: ({ children: linkChildren, href }) => (
          <a href={href} target="_blank" rel="noreferrer noopener">
            {linkChildren}
          </a>
        ),
        table: ({ children: tableChildren }) => (
          <div className="ai-explain-markdown__table" tabIndex={0}>
            <table>{tableChildren}</table>
          </div>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  )
}
