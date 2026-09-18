'use client'

import { useEffect, useRef, useState } from 'react'

// Situation: giscus 的 client.js 会同步注入 iframe，直接放进首屏会拖慢文档加载。
// Task: 提供一个可复用的评论组件，按需加载，并让 iframe 主题跟随全站明暗切换。
// Action: 用 IntersectionObserver 延迟注入脚本，用 MutationObserver 观察 <html>
//         的 .dark class（Fumadocs/next-themes 负责切换），通过 postMessage 同步主题。
// Result: 首屏不加载评论；用户接近评论区才拉取 giscus；主题切换即时生效。

const GISCUS_ORIGIN = 'https://giscus.app'
const GISCUS_SCRIPT_SRC = `${GISCUS_ORIGIN}/client.js`

type GiscusMapping =
  | 'pathname'
  | 'url'
  | 'title'
  | 'og:title'
  | 'specific'
  | 'number'

type GiscusInputPosition = 'top' | 'bottom'

export type GiscusCommentsProps = {
  /** GitHub 仓库，形如 owner/name。 */
  repo?: `${string}/${string}`
  /**
   * 仓库和分类 ID 都是 giscus.app 生成的公开标识，用于定位公共仓库的 Discussions，
   * 本就需要下发到浏览器，不是服务端密钥，放在客户端组件里即可。
   */
  repoId?: string
  category?: string
  categoryId?: string
  mapping?: GiscusMapping
  strict?: boolean
  reactionsEnabled?: boolean
  emitMetadata?: boolean
  inputPosition?: GiscusInputPosition
  lang?: string
  /** 站点亮色模式对应的 giscus 主题名。 */
  lightTheme?: string
  /** 站点暗色模式对应的 giscus 主题名。 */
  darkTheme?: string
  /** 距离视口多远开始加载 giscus，透传给 IntersectionObserver 的 rootMargin。 */
  rootMargin?: string
}

function getActiveTheme(lightTheme: string, darkTheme: string) {
  if (typeof document === 'undefined') return lightTheme

  return document.documentElement.classList.contains('dark')
    ? darkTheme
    : lightTheme
}

export function GiscusComments({
  repo = 'Jaxon1216/notes',
  repoId = 'R_kgDOPX_XIQ',
  category = 'Announcements',
  categoryId = 'DIC_kwDOPX_XIc4DFzUT',
  mapping = 'pathname',
  strict = false,
  reactionsEnabled = true,
  emitMetadata = false,
  inputPosition = 'bottom',
  lang = 'zh-CN',
  lightTheme = 'light',
  darkTheme = 'dark',
  rootMargin = '200px 0px',
}: GiscusCommentsProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)

  // Situation: 评论区通常在正文末尾，首屏不可见。
  // Task: 只有当用户滚动接近评论区时才触发加载。
  // Action: 用 IntersectionObserver 命中后置为可见并断开观察；不支持时直接加载。
  // Result: 首屏不请求 giscus，接近评论区才拉取脚本。
  useEffect(() => {
    if (visible) return

    const container = containerRef.current
    if (!container) return

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin },
    )

    observer.observe(container)

    return () => observer.disconnect()
  }, [rootMargin, visible])

  // Situation: giscus 首次以 <script> 的 data-theme 决定主题，之后需要用 postMessage 切换。
  // Task: 注入脚本后，让已加载的 iframe 跟随全站明暗切换，并修复加载期间主题变更的竞态。
  // Action: 注入脚本；用 MutationObserver 观察 <html> class 变化重发主题；
  //         在收到 giscus 首条消息时补发一次当前主题。
  // Result: 主题切换即时同步，且加载过程中切换主题也不会残留旧主题。
  useEffect(() => {
    if (!visible) return

    const container = containerRef.current
    if (!container) return

    const script = document.createElement('script')
    script.src = GISCUS_SCRIPT_SRC
    script.async = true
    script.crossOrigin = 'anonymous'
    script.setAttribute('data-repo', repo)
    script.setAttribute('data-repo-id', repoId)
    script.setAttribute('data-category', category)
    script.setAttribute('data-category-id', categoryId)
    script.setAttribute('data-mapping', mapping)
    script.setAttribute('data-strict', strict ? '1' : '0')
    script.setAttribute('data-reactions-enabled', reactionsEnabled ? '1' : '0')
    script.setAttribute('data-emit-metadata', emitMetadata ? '1' : '0')
    script.setAttribute('data-input-position', inputPosition)
    script.setAttribute('data-theme', getActiveTheme(lightTheme, darkTheme))
    script.setAttribute('data-lang', lang)

    container.appendChild(script)

    function postTheme(nextTheme: string) {
      const iframe = container?.querySelector<HTMLIFrameElement>(
        'iframe.giscus-frame',
      )
      iframe?.contentWindow?.postMessage(
        { giscus: { setConfig: { theme: nextTheme } } },
        GISCUS_ORIGIN,
      )
    }

    // giscus 加载完成后会向父窗口发消息；此时补发一次当前主题，
    // 覆盖脚本注入到 iframe 就绪之间用户切换主题的竞态。
    let didInitialThemeSync = false
    function handleGiscusMessage(event: MessageEvent) {
      if (event.origin !== GISCUS_ORIGIN) return

      const data = event.data
      if (typeof data !== 'object' || data === null || !('giscus' in data)) {
        return
      }

      if (didInitialThemeSync) return
      didInitialThemeSync = true
      postTheme(getActiveTheme(lightTheme, darkTheme))
    }

    const themeObserver = new MutationObserver(() => {
      postTheme(getActiveTheme(lightTheme, darkTheme))
    })

    window.addEventListener('message', handleGiscusMessage)
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => {
      window.removeEventListener('message', handleGiscusMessage)
      themeObserver.disconnect()
      // 清空容器，保证路由切换或 Strict Mode 重跑时从干净状态重新注入。
      container.innerHTML = ''
    }
  }, [
    visible,
    repo,
    repoId,
    category,
    categoryId,
    mapping,
    strict,
    reactionsEnabled,
    emitMetadata,
    inputPosition,
    lang,
    lightTheme,
    darkTheme,
  ])

  return (
    <section className="giscus-comments" aria-label="评论">
      <h2 className="giscus-comments__title">评论</h2>
      <div ref={containerRef} className="giscus-comments__frame" />
      <noscript>
        <p className="giscus-comments__noscript">
          评论区需要启用 JavaScript 才能加载。
        </p>
      </noscript>
    </section>
  )
}
