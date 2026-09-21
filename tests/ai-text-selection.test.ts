import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { setSelection, effects } = vi.hoisted(() => ({
  setSelection: vi.fn(),
  effects: [] as Array<() => void | (() => void)>,
}))

vi.mock('react', () => ({
  useState: (initial: unknown) => [initial, setSelection],
  useEffect: (effect: () => void | (() => void)) => effects.push(effect),
}))

import { useTextSelection } from '../components/ai/use-text-selection'

class ElementStub {
  constructor(private descendants: ElementStub[] = []) {}
  contains(target: unknown) {
    return target === this || this.descendants.includes(target as ElementStub)
  }
}

describe('AI selection scroll boundaries', () => {
  let handleScroll: (event: { target: unknown }) => void
  let cleanup: (() => void) | void
  let docChild: ElementStub
  let docAncestor: ElementStub
  let sidebar: ElementStub
  let rafCallbacks: Array<(time: number) => void>
  let windowStub: {
    addEventListener: ReturnType<typeof vi.fn>
    removeEventListener: ReturnType<typeof vi.fn>
    requestAnimationFrame: ReturnType<typeof vi.fn>
    cancelAnimationFrame: ReturnType<typeof vi.fn>
  }
  let documentStub: { querySelector: ReturnType<typeof vi.fn>; addEventListener: ReturnType<typeof vi.fn>; removeEventListener: ReturnType<typeof vi.fn> }

  // scroll 处理经过 requestAnimationFrame 节流，测试里手动 flush 出下一帧回调。
  function flushRaf() {
    const callbacks = rafCallbacks
    rafCallbacks = []
    for (const callback of callbacks) callback(0)
  }

  beforeEach(() => {
    setSelection.mockClear()
    effects.length = 0
    rafCallbacks = []
    docChild = new ElementStub()
    const root = new ElementStub([docChild])
    docAncestor = new ElementStub([root, docChild])
    sidebar = new ElementStub()
    documentStub = {
      querySelector: vi.fn(() => root),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }
    windowStub = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      requestAnimationFrame: vi.fn((callback: (time: number) => void) => {
        rafCallbacks.push(callback)
        return rafCallbacks.length
      }),
      cancelAnimationFrame: vi.fn(),
    }
    vi.stubGlobal('Element', ElementStub)
    vi.stubGlobal('document', documentStub)
    vi.stubGlobal('window', windowStub)
    useTextSelection()
    cleanup = effects[0]()
    handleScroll = windowStub.addEventListener.mock.calls.find(
      ([name]) => name === 'scroll',
    )![1]
  })

  afterEach(() => {
    cleanup?.()
    vi.unstubAllGlobals()
  })

  it('preserves the excerpt when the AI sidebar scrolls during streaming', () => {
    handleScroll({ target: sidebar })
    flushRaf()
    expect(setSelection).not.toHaveBeenCalled()
  })

  it('clears stale trigger coordinates when the document or its containers scroll', () => {
    for (const target of [documentStub, windowStub, docAncestor, docChild]) {
      setSelection.mockClear()
      handleScroll({ target })
      flushRaf()
      expect(setSelection).toHaveBeenCalledWith({ text: '', rect: null })
    }
  })

  it('removes the same capturing scroll listener on unmount', () => {
    cleanup?.()
    cleanup = undefined
    expect(windowStub.removeEventListener).toHaveBeenCalledWith(
      'scroll',
      handleScroll,
      { capture: true },
    )
  })
})
