import { loader } from 'fumadocs-core/source'
import { applyMdxPreset } from 'fumadocs-mdx/config'
import { defineDocs } from 'fumadocs-mdx/macro'

import { frontmatterSchema } from '@/lib/frontmatter'

const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    files: ['**/*.md', '**/*.mdx'],
    schema: frontmatterSchema,
    mdxOptions: applyMdxPreset({
      remarkImageOptions: {
        external: false,
        onError: 'ignore',
      },
    }),
  },
  meta: {
    files: ['**/meta.json'],
  },
})

export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
})
