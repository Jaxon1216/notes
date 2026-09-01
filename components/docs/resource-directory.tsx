'use client'

import { ArrowUpRight } from 'lucide-react'
import { useId, useState } from 'react'

import {
  RESOURCE_DIRECTORIES,
  type ResourceKind,
  type ResourceSection,
} from '@/lib/resource-directory'

const RESOURCE_KIND_LABELS: Record<ResourceKind, string> = {
  articles: '文章',
  projects: '项目',
}

type ResourceDirectoryProps = {
  section: ResourceSection
}

export function ResourceDirectory({ section }: ResourceDirectoryProps) {
  const [kind, setKind] = useState<ResourceKind>('articles')
  const id = useId()
  const directory = RESOURCE_DIRECTORIES[section]
  const entries = directory[kind]
  const panelId = `${id}-${kind}-panel`

  function moveFocus(current: ResourceKind, direction: 1 | -1) {
    const kinds: ResourceKind[] = ['articles', 'projects']
    const nextKind = kinds[(kinds.indexOf(current) + direction + kinds.length) % kinds.length]
    setKind(nextKind)
    document.getElementById(`${id}-${nextKind}-tab`)?.focus()
  }

  return (
    <section className="resource-directory" aria-label={directory.title}>
      <div className="resource-directory__tabs" role="tablist" aria-label={`${directory.title}分类`}>
        {(Object.keys(RESOURCE_KIND_LABELS) as ResourceKind[]).map((item) => {
          const selected = kind === item
          const tabId = `${id}-${item}-tab`

          return (
            <button
              aria-controls={selected ? panelId : undefined}
              aria-selected={selected}
              className="resource-directory__tab"
              id={tabId}
              key={item}
              onClick={() => setKind(item)}
              onKeyDown={(event) => {
                if (event.key === 'ArrowRight') moveFocus(item, 1)
                if (event.key === 'ArrowLeft') moveFocus(item, -1)
              }}
              role="tab"
              tabIndex={selected ? 0 : -1}
              type="button"
            >
              {RESOURCE_KIND_LABELS[item]}
            </button>
          )
        })}
      </div>

      <div className="resource-directory__panel" id={panelId} role="tabpanel">
        {entries.length === 0 ? (
          <p className="resource-directory__empty">
            目前还没有经过筛选的{RESOURCE_KIND_LABELS[kind]}，宁缺毋滥。
          </p>
        ) : (
          <div className="resource-directory__table-wrap">
            <table>
              <thead>
                <tr>
                  <th scope="col">名称</th>
                  <th scope="col">简介</th>
                  <th scope="col">推荐理由</th>
                  <th scope="col">标签</th>
                  <th scope="col">链接</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.href}>
                    <th scope="row">
                      <a href={entry.href} rel="noreferrer" target="_blank">
                        {entry.title}
                      </a>
                    </th>
                    <td>{entry.description}</td>
                    <td>{entry.recommendation}</td>
                    <td>
                      <span className="resource-directory__tags">
                        {entry.tags.map((tag) => (
                          <span className="resource-directory__tag" key={tag}>
                            {tag}
                          </span>
                        ))}
                      </span>
                    </td>
                    <td>
                      <a
                        aria-label={`在新标签页打开 ${entry.title}`}
                        className="resource-directory__external-link"
                        href={entry.href}
                        rel="noreferrer"
                        target="_blank"
                      >
                        查看 <ArrowUpRight aria-hidden="true" size={15} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}
