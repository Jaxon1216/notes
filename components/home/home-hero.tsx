import { ArrowRight, GitPullRequestArrow } from 'lucide-react'
import Link from 'next/link'

import { HomeLogoLoop } from '@/components/home/home-logo-loop'
import { ParticlesWrapper } from '@/components/home/particles-wrapper'
import { DocsSidebarActivity } from '@/components/site/docs-sidebar-activity'
import type { HomeData } from '@/lib/content'

const CONTRIBUTION_HREF = '/docs/dev/conventions/open-source-contribution'
const TOPIC_TAGS = [
  {
    label: '教程',
    href: '/docs/frontend/tutorial/React/00-React学习路线',
  },
  {
    label: '八股',
    href: '/docs/frontend/bagu/handwrite/00-高频前端手写25题',
  },
  {
    label: '面经',
    href: '/docs/frontend/interview/00-面经4.9',
  },
  {
    label: '资源推荐',
    href: '/docs/resources',
  },
  {
    label: 'GitHub 开源仓库',
    href: 'https://github.com/Jaxon1216/notes',
  },
  {
    label: '工程常用',
    href: '/docs/dev/conventions/open-source-contribution',
  },
]

export function HomeHero({ data }: { data: HomeData }) {
  // Situation: 首页首屏同时展示多个内部 Link，Next.js 会为可见链接自动预取 RSC。
  // Task: 保留主入口的即时跳转体验，同时避免次要入口抢占首屏网络带宽。
  // Action: 仅让“进入文档”主动预取，内容标签和贡献入口显式关闭 prefetch。
  // Result: 首页预取请求从 16 次降到 5 次，点击导航行为保持不变。
  return (
    <section className="home-hero" aria-labelledby="home-title">
      <div className="home-hero__background" aria-hidden="true">
        <ParticlesWrapper />
      </div>

      <div className="home-hero__stage particles-passthrough">
        <div className="home-hero__content">
          <p className="home-kicker">Easton Notes</p>
          <h1 className="home-title" id="home-title">
            AI 全栈 Club
          </h1>
          <p className="home-subtitle">
            已沉淀 {data.totalFiles} 篇可阅读内容：从前端、服务端到 Agent 开发，覆盖教程、
            面试准备、资源与开源实践。
          </p>

          <div className="home-topic-tags" aria-label="内容标签">
            {TOPIC_TAGS.map((tag) => {
              const isExternal = tag.href.startsWith('http')

              return isExternal ? (
                <a
                  className="home-topic-tag"
                  href={tag.href}
                  key={tag.label}
                  rel="noreferrer"
                  target="_blank"
                >
                  {tag.label}
                </a>
              ) : (
                <Link
                  className="home-topic-tag"
                  href={tag.href}
                  key={tag.label}
                  prefetch={false}
                >
                  {tag.label}
                </Link>
              )
            })}
          </div>

          <div className="home-hero__actions">
            <Link className="home-primary-action" href="/docs" prefetch={true}>
              <span>进入文档</span>
              <ArrowRight aria-hidden="true" size={17} />
            </Link>
            <Link
              className="home-secondary-action"
              href={CONTRIBUTION_HREF}
              prefetch={false}
            >
              <GitPullRequestArrow aria-hidden="true" size={17} />
              <span>参与文档贡献</span>
            </Link>
          </div>

          <DocsSidebarActivity
            className="home-site-activity"
            summary={{
              value: `${data.totalFiles} 篇`,
              label: `${data.activeSections} 个内容方向`,
            }}
          />
        </div>

        <div className="home-hero__loop">
          <HomeLogoLoop />
        </div>
      </div>
    </section>
  )
}
