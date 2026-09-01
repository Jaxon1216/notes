import { describe, expect, it } from 'vitest'

import { RESOURCE_DIRECTORIES, validateResourceDirectory } from '../lib/resource-directory'

describe('resource directories', () => {
  it('exposes article and project dimensions for every resource section', () => {
    expect(Object.keys(RESOURCE_DIRECTORIES).sort()).toEqual(['agent', 'backend', 'frontend'])

    for (const directory of Object.values(RESOURCE_DIRECTORIES)) {
      expect(Array.isArray(directory.articles)).toBe(true)
      expect(Array.isArray(directory.projects)).toBe(true)
    }
  })

  it('requires a link, recommendation and tags for each published entry', () => {
    expect(validateResourceDirectory(RESOURCE_DIRECTORIES)).toEqual([])
  })
})
