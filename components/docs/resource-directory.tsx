'use client'

import { ArrowUpRight } from 'lucide-react'
import { useId, useState } from 'react'

import {
  RESOURCE_ENTRIES,
  RESOURCE_KIND_LABELS,
  RESOURCE_SECTION_LABELS,
  filterResourceEntries,
  type ResourceKind,
  type ResourceKindFilter,
  type ResourceSectionFilter,
} from '@/lib/resource-directory'

const SECTION_FILTERS: ResourceSectionFilter[] = [
  'all',
  'frontend',
  'backend',
  'agent',
  'algorithm',
  'general',
]

export function ResourceDirectory() {
  const [section, setSection] = useState<ResourceSectionFilter>('all')
  const [kind, setKind] = useState<ResourceKindFilter>('all')
  const id = useId()
  const panelId = `${id}-panel`
  const entries = filterResourceEntries(RESOURCE_ENTRIES, section, kind)

  function moveFocus(current: ResourceSectionFilter, direction: 1 | -1) {
    const nextSection =
      SECTION_FILTERS[
        (SECTION_FILTERS.indexOf(current) + direction + SECTION_FILTERS.length) %
          SECTION_FILTERS.length
      ]
    setSection(nextSection)
    document.getElementById(`${id}-${nextSection}-tab`)?.focus()
  }

  return (
    <section className="resource-directory" aria-label="资源推荐">
      <div className="resource-directory__filters">
        <div className="resource-directory__tabs" role="tablist" aria-label="技术方向">
          {SECTION_FILTERS.map((item) => {
            const selected = section === item
            const tabId = `${id}-${item}-tab`

            return (
              <button
                aria-controls={panelId}
                aria-selected={selected}
                className="resource-directory__tab"
                id={tabId}
                key={item}
                onClick={() => setSection(item)}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowRight') moveFocus(item, 1)
                  if (event.key === 'ArrowLeft') moveFocus(item, -1)
                }}
                role="tab"
                tabIndex={selected ? 0 : -1}
                type="button"
              >
                {item === 'all' ? '全部' : RESOURCE_SECTION_LABELS[item]}
              </button>
            )
          })}
        </div>

        <label className="resource-directory__kind-filter">
          <span>类型</span>
          <select
            value={kind}
            onChange={(event) => setKind(event.target.value as ResourceKindFilter)}
          >
            <option value="all">全部类型</option>
            {(Object.entries(RESOURCE_KIND_LABELS) as [ResourceKind, string][]).map(
              ([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ),
            )}
          </select>
        </label>
      </div>

      <div className="resource-directory__panel" id={panelId} role="tabpanel">
        {entries.length === 0 ? (
          <p className="resource-directory__empty">
            当前筛选条件下还没有经过整理的资源。
          </p>
        ) : (
          <div className="resource-directory__table-wrap">
            <table>
              <thead>
                <tr>
                  <th scope="col">名称</th>
                  <th scope="col">类型</th>
                  <th scope="col">方向</th>
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
                    <td>{RESOURCE_KIND_LABELS[entry.kind]}</td>
                    <td>
                      {entry.sections
                        .map((item) => RESOURCE_SECTION_LABELS[item])
                        .join(' / ')}
                    </td>
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
