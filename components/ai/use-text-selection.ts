'use client'

import { useEffect, useState } from 'react'

export type TextSelectionState = {
  text: string
  rect: {
    top: number
    left: number
    width: number
    height: number
  } | null
}

const EMPTY_SELECTION: TextSelectionState = {
  text: '',
  rect: null,
}

function getElementFromNode(node: Node | null) {
  if (!node) return null
  return node.nodeType === Node.ELEMENT_NODE
    ? (node as Element)
    : node.parentElement
}

function isInsideDocContent(selection: Selection) {
  const root = document.querySelector('[data-ai-doc-content]')
  if (!root || !selection.anchorNode || !selection.focusNode) return false

  const anchorElement = getElementFromNode(selection.anchorNode)
  const focusElement = getElementFromNode(selection.focusNode)

  return Boolean(
    anchorElement &&
      focusElement &&
      root.contains(anchorElement) &&
      root.contains(focusElement),
  )
}

function isDesktopViewport() {
  return window.matchMedia('(min-width: 1024px)').matches
}

export function useTextSelection() {
  const [selection, setSelection] =
    useState<TextSelectionState>(EMPTY_SELECTION)

  useEffect(() => {
    function updateSelection() {
      if (!isDesktopViewport()) {
        setSelection(EMPTY_SELECTION)
        return
      }

      const currentSelection = window.getSelection()
      const text = currentSelection?.toString().trim() ?? ''

      if (!currentSelection || !text || !isInsideDocContent(currentSelection)) {
        setSelection(EMPTY_SELECTION)
        return
      }

      const range = currentSelection.getRangeAt(0)
      const rect = range.getBoundingClientRect()

      if (rect.width === 0 && rect.height === 0) {
        setSelection(EMPTY_SELECTION)
        return
      }

      setSelection({
        text,
        rect: {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        },
      })
    }

    function clearSelection() {
      setSelection(EMPTY_SELECTION)
    }

    function handleScroll(event: Event) {
      const root = document.querySelector('[data-ai-doc-content]')
      const target = event.target

      // 侧栏流式输出的滚动不会移动正文选区，不能因此隐藏追加引用入口。
      if (
        root &&
        target instanceof Element &&
        !root.contains(target) &&
        !target.contains(root)
      ) {
        return
      }

      clearSelection()
    }

    document.addEventListener('mouseup', updateSelection)
    document.addEventListener('keyup', updateSelection)
    window.addEventListener('resize', clearSelection)
    window.addEventListener('scroll', handleScroll, true)

    return () => {
      document.removeEventListener('mouseup', updateSelection)
      document.removeEventListener('keyup', updateSelection)
      window.removeEventListener('resize', clearSelection)
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [])

  return selection
}
