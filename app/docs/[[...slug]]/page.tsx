import { createRelativeLink } from 'fumadocs-ui/mdx'
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/layouts/docs/page'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getMDXComponents } from '@/components/mdx'
import { source } from '@/lib/source'
import { fileTitle } from '@/site.config'

type DocsPageProps = {
  params: Promise<{
    slug?: string[]
  }>
}

function safeDecodeSegment(segment: string) {
  try {
    return decodeURIComponent(segment)
  } catch {
    return segment
  }
}

function toRouteSlug(slug: string[] | undefined) {
  return (slug ?? []).map(safeDecodeSegment)
}

function toSourceSlug(slug: string[] | undefined) {
  return toRouteSlug(slug).map((segment) => encodeURIComponent(segment))
}

function getTitle(title: string | undefined, slugs: string[]) {
  return title || fileTitle(safeDecodeSegment(slugs.at(-1) || '文档'))
}

export function generateStaticParams() {
  return source.generateParams().map((params) => ({
    ...params,
    slug: toRouteSlug(params.slug),
  }))
}

export async function generateMetadata({
  params,
}: DocsPageProps): Promise<Metadata> {
  const { slug } = await params
  const slugSegments = toSourceSlug(slug)
  const page = source.getPage(slugSegments)

  if (!page) notFound()

  return {
    title: getTitle(page.data.title, page.slugs),
    description: page.data.description,
  }
}

export default async function Page({ params }: DocsPageProps) {
  const { slug } = await params
  const slugSegments = toSourceSlug(slug)
  const page = source.getPage(slugSegments)

  if (!page) notFound()

  const MDXContent = page.data.body
  const title = getTitle(page.data.title, page.slugs)
  const hasBodyTitle = page.data.toc.some((item) => item.depth === 1)

  return (
    <DocsPage toc={page.data.toc}>
      {hasBodyTitle ? null : <DocsTitle>{title}</DocsTitle>}
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDXContent
          components={getMDXComponents({
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  )
}
