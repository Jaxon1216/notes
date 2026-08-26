import { loader } from 'fumadocs-core/source'
import { pageSchema } from 'fumadocs-core/source/schema'
import { applyMdxPreset } from 'fumadocs-mdx/config'
import { defineDocs } from 'fumadocs-mdx/macro'

const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    files: ['**/*.md', '**/*.mdx'],
    schema: pageSchema.extend({
      title: pageSchema.shape.title.optional(),
    }),
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
