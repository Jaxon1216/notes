'use client'

import { useDocsSearch } from 'fumadocs-core/search/client'
import { fetchClient } from 'fumadocs-core/search/client/fetch'
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogFooter,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
} from 'fumadocs-ui/components/dialog/search'
import type { DefaultSearchDialogProps } from 'fumadocs-ui/components/dialog/search-default'
import { useMemo } from 'react'

import { publishSearchHighlight } from '@/lib/search-highlight'

export function DocsSearchDialog({
  links = [],
  open,
  onOpenChange,
}: DefaultSearchDialogProps) {
  const client = useMemo(() => fetchClient(), [])
  const { search, setSearch, query } = useDocsSearch({ client })
  const defaultItems = useMemo(() => {
    if (links.length === 0) return null

    return links.map(([name, link]) => ({
      type: 'page' as const,
      id: name,
      content: name,
      url: link,
    }))
  }, [links])

  return (
    <SearchDialog
      open={open}
      onOpenChange={onOpenChange}
      search={search}
      onSearchChange={setSearch}
      isLoading={query.isLoading}
      onSelect={(item) => {
        if (item.type === 'action' || item.external) return
        publishSearchHighlight(
          search,
          item.url,
          typeof item.content === 'string' ? item.content : '',
          item.type === 'page' || item.type === 'heading' ? item.type : 'text',
        )
      }}
    >
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList
          items={query.data !== 'empty' ? query.data : defaultItems}
        />
      </SearchDialogContent>
      <SearchDialogFooter />
    </SearchDialog>
  )
}
