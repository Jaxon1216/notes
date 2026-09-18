import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { AiMarkdown } from '../components/ai/ai-markdown'

describe('AI Markdown', () => {
  it('renders GFM tables inside a horizontally scrollable container', () => {
    const html = renderToStaticMarkup(
      <AiMarkdown>
        {'| Name | Value |\n| --- | ---: |\n| Count | 2 |'}
      </AiMarkdown>,
    )

    expect(html).toContain('class="ai-explain-markdown__table"')
    expect(html).toContain('<table>')
    expect(html).toContain('<th>Name</th>')
    expect(html).toContain('style="text-align:right"')
  })

  it('adds syntax-highlight classes to fenced code blocks', () => {
    const html = renderToStaticMarkup(
      <AiMarkdown>
        {"```typescript\nconst answer: string = 'ready'\n```"}
      </AiMarkdown>,
    )

    expect(html).toContain('class="hljs language-typescript"')
    expect(html).toContain('class="hljs-keyword"')
    expect(html).toContain('class="hljs-string"')
  })
})
