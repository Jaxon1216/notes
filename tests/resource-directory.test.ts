import { describe, expect, it } from 'vitest'

import {
  RESOURCE_ENTRIES,
  RESOURCE_KIND_LABELS,
  RESOURCE_SECTION_LABELS,
  filterResourceEntries,
  validateResourceDirectory,
} from '../lib/resource-directory'

describe('resource directories', () => {
  it('defines stable direction and type filters', () => {
    expect(Object.keys(RESOURCE_SECTION_LABELS).sort()).toEqual([
      'agent',
      'algorithm',
      'backend',
      'frontend',
      'general',
    ])
    expect(Object.keys(RESOURCE_KIND_LABELS).sort()).toEqual([
      'article',
      'book',
      'course',
      'documentation',
      'paper',
      'project',
      'tool',
    ])
  })

  it('requires a unique link, direction, recommendation and tags for each entry', () => {
    expect(validateResourceDirectory(RESOURCE_ENTRIES)).toEqual([])
    expect(new Set(RESOURCE_ENTRIES.map((entry) => entry.href)).size).toBe(
      RESOURCE_ENTRIES.length,
    )
  })

  it('stores cross-direction resources once', () => {
    const genBi = RESOURCE_ENTRIES.find((entry) => entry.title.startsWith('GenBI'))

    expect(genBi?.sections).toEqual(['backend', 'agent'])
  })

  it('combines direction and type filters', () => {
    expect(
      filterResourceEntries(RESOURCE_ENTRIES, 'agent', 'project').map(
        (entry) => entry.title,
      ),
    ).toEqual(['项目分析 Skill', 'GenBI 智能数据分析平台'])
    expect(filterResourceEntries(RESOURCE_ENTRIES, 'algorithm', 'all')).toEqual(
      [],
    )
  })
})
