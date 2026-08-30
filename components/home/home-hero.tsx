import { ArrowRight, GitPullRequestArrow } from 'lucide-react'
import Link from 'next/link'

import { HomeLogoLoop } from '@/components/home/home-logo-loop'
import { ParticlesWrapper } from '@/components/home/particles-wrapper'
import type { HomeData } from '@/lib/content'

const CONTRIBUTION_HREF = '/docs/dev/conventions/open-source-contribution'

export function HomeHero({ data }: { data: HomeData }) {
  return (
    <section className="home-hero" aria-labelledby="home-title">
      <div className="home-hero__background" aria-hidden="true">
        <ParticlesWrapper />
      </div>

      <div className="home-hero__content">
        <p className="home-kicker">Easton Notes</p>
        <h1 className="home-title" id="home-title">
          工程实践知识库
        </h1>
        <p className="home-subtitle">
          {data.totalFiles} 篇笔记，收拢前端、服务端、算法、Agent 和工程常用技术栈。
        </p>

        <div className="home-hero__actions">
          <Link className="home-primary-action" href="/docs">
            <span>进入文档</span>
            <ArrowRight aria-hidden="true" size={17} />
          </Link>
          <Link className="home-secondary-action" href={CONTRIBUTION_HREF}>
            <GitPullRequestArrow aria-hidden="true" size={17} />
            <span>开源贡献指南</span>
          </Link>
        </div>

        <p className="home-hero__meta">{data.activeSections} 个内容方向持续维护中</p>
      </div>

      <div className="home-hero__loop">
        <HomeLogoLoop />
      </div>
    </section>
  )
}
