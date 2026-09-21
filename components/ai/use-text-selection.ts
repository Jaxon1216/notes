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

function isInsideDocContent(selection: Selection, root: Element | null) {
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
    // 缓存正文根节点，避免每次 mouseup/keyup/scroll 都重新 querySelector。
    // 路由切换后旧节点会从文档树移除（isConnected 变 false），此时重新查询。
    let cachedRoot: Element | null = null

    function getDocContentRoot() {
      if (!cachedRoot || !cachedRoot.isConnected) {
        cachedRoot = document.querySelector('[data-ai-doc-content]')
      }
      return cachedRoot
    }

    function updateSelection() {
      if (!isDesktopViewport()) {
        setSelection(EMPTY_SELECTION)
        return
      }

      const currentSelection = window.getSelection()
      const text = currentSelection?.toString().trim() ?? ''

      if (
        !currentSelection ||
        !text ||
        !isInsideDocContent(currentSelection, getDocContentRoot())
      ) {
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

    // scroll 是高频事件：用 rAF 合并同一帧内的多次触发，减少滚动期间的重复工作。
    let scrollFrame = 0

    function processScroll(target: EventTarget | null) {
      const root = getDocContentRoot()

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

    function handleScroll(event: Event) {
      const target = event.target
      if (scrollFrame) return

      scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = 0
        processScroll(target)
      })
    }

    document.addEventListener('mouseup', updateSelection)
    document.addEventListener('keyup', updateSelection)
    window.addEventListener('resize', clearSelection)
    window.addEventListener('scroll', handleScroll, { capture: true, passive: true })

    return () => {
      document.removeEventListener('mouseup', updateSelection)
      document.removeEventListener('keyup', updateSelection)
      window.removeEventListener('resize', clearSelection)
      window.removeEventListener('scroll', handleScroll, { capture: true })
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame)
    }
  }, [])

  return selection
}
