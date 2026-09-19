import { LinkCollection } from '@/components/docs/link-collection'
import {
  RESOURCE_ENTRIES,
  filterResourceEntries,
  type ResourceKind,
} from '@/lib/resource-directory'

export function ResourceDirectory({
  kind,
}: {
  kind: ResourceKind
}) {
  return (
    <LinkCollection
      empty={{
        title: '这一类资源正在重新整理。',
        description: '后续只需在 lib/resource-directory.ts 中按固定字段新增数据，卡片会自动渲染。',
      }}
      entries={filterResourceEntries(RESOURCE_ENTRIES, kind)}
    />
  )
}
