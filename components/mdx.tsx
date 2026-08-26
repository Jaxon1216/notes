import defaultMdxComponents from 'fumadocs-ui/mdx'
import type { MDXComponents } from 'mdx/types'
import type { ComponentProps } from 'react'

function MarkdownImage(props: ComponentProps<'img'>) {
  if (typeof props.src === 'string' && /^https?:\/\//.test(props.src)) {
    return <img {...props} alt={props.alt || ''} />
  }

  const DefaultImage = defaultMdxComponents.img
  return <DefaultImage {...props} alt={props.alt || ''} />
}

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    img: MarkdownImage,
    ...components,
  }
}

export const useMDXComponents = getMDXComponents

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>
}
