import { ArrowRight, GitFork } from 'lucide-react'

type DocsSidebarForkProps = {
  className?: string
  href?: string
}

const FORK_HREF = 'https://github.com/Jaxon1216/notes'

// Situation: 站点域名可能变更，需要一个常驻但不喧宾夺主的入口提醒读者及时 fork。
// Task: 贴在“站点动态”卡片下方，视觉协调却和它常驻的环绕蓝光动效区分开。
// Action: 平时是安静的描边 pill，hover 才触发文字扫光和箭头右移；埋点复用 umami 自动监听。
// Result: 侧栏多一条低干扰的 fork 提示，动效只在交互时出现，reduced-motion 下自动静止。
export function DocsSidebarFork({ className, href = FORK_HREF }: DocsSidebarForkProps) {
  return (
    <a
      className={['docs-sidebar-fork', className].filter(Boolean).join(' ')}
      href={href}
      rel="noreferrer"
      target="_blank"
      aria-label="域名可能变更，前往 GitHub 及时 Fork 备份"
      data-umami-event="sidebar_fork_link_click"
      data-umami-event-target={href}
    >
      <span className="docs-sidebar-fork__icon" aria-hidden="true">
        <GitFork size={15} />
      </span>
      <span className="docs-sidebar-fork__text">
        <strong>域名可能变更</strong>
        <span>Star / Fork 一份不迷路</span>
      </span>
      <ArrowRight className="docs-sidebar-fork__arrow" aria-hidden="true" size={15} />
    </a>
  )
}
