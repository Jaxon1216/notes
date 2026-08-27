'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type AiMarkdownProps = {
  children: string
}

export function AiMarkdown({ children }: AiMarkdownProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ children: linkChildren, href }) => (
          <a href={href} target="_blank" rel="noreferrer noopener">
            {linkChildren}
          </a>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  )
}
