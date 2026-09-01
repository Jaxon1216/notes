import { describe, expect, it } from 'vitest'

import {
  getActiveSectionKey,
  reduceNavigationState,
} from '../lib/site-navigation'

describe('site navigation', () => {
  it('maps only document section paths to an active section', () => {
    expect(getActiveSectionKey('/')).toBeNull()
    expect(getActiveSectionKey('/docs')).toBeNull()
    expect(getActiveSectionKey('/docs/agent/knowledge/llm/LLM原理')).toBe('agent')
    expect(getActiveSectionKey('/docs/frontend/resources')).toBe('frontend')
  })

  it('keeps exactly one menu open and transfers ownership on hover', () => {
    const pinned = reduceNavigationState(
      { openSectionKey: null, pinnedSectionKey: null },
      { type: 'pin', key: 'frontend' },
    )
    expect(pinned).toEqual({
      openSectionKey: 'frontend',
      pinnedSectionKey: 'frontend',
    })

    expect(reduceNavigationState(pinned, { type: 'open', key: 'agent' })).toEqual({
      openSectionKey: 'agent',
      pinnedSectionKey: null,
    })
  })

  it('closes transient, pinned, and route-changed menus predictably', () => {
    const transient = { openSectionKey: 'backend', pinnedSectionKey: null }
    expect(reduceNavigationState(transient, { type: 'leave' })).toEqual({
      openSectionKey: null,
      pinnedSectionKey: null,
    })
    expect(
      reduceNavigationState(
        { openSectionKey: 'agent', pinnedSectionKey: 'agent' },
        { type: 'close' },
      ),
    ).toEqual({
      openSectionKey: null,
      pinnedSectionKey: null,
    })
    expect(
      reduceNavigationState(
        { openSectionKey: 'agent', pinnedSectionKey: 'agent' },
        { type: 'route-change' },
      ),
    ).toEqual({
      openSectionKey: null,
      pinnedSectionKey: null,
    })
  })
})
