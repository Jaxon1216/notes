import { ArrowRight, GitPullRequestArrow } from 'lucide-react'
import Link from 'next/link'

import { HomeLogoLoop } from '@/components/home/home-logo-loop'
import { ParticlesWrapper } from '@/components/home/particles-wrapper'
import type { HomeData } from '@/lib/content'

const CONTRIBUTION_HREF = '/docs/dev/conventions/open-source-contribution'
const TOPIC_TAGS = [
  {
    label: '八股知识',
    href: '/docs/frontend/knowledge/React/01-核心概念与基础语法',
  },
  {
    label: '面经复盘',
    href: '/docs/frontend/interview/00-面经4.9',
  },
  {
    label: 'React 学习',
    href: '/docs/frontend/knowledge/React/00-React学习路线',
  },
  {
    label: 'GitHub 学习项目',
    href: 'https://github.com/Jaxon1216/cpp-notes',
  },
  {
    label: '工程常用',
    href: '/docs/dev/conventions/open-source-contribution',
  },
]

export function HomeHero({ data }: { data: HomeData }) {
  return (
    <section className="home-hero" aria-labelledby="home-title">
      <div className="home-hero__background" aria-hidden="true">
        <ParticlesWrapper />
      </div>

      <div className="home-hero__stage particles-passthrough">
        <div className="home-hero__content">
          <p className="home-kicker">Easton Notes</p>
          <h1 className="home-title" id="home-title">
            技术学习资料索引
          </h1>
          <p className="home-subtitle">
            {data.totalFiles} 篇笔记，整理八股知识、面经复盘、优质资源和可跟练的 GitHub
            学习项目。
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
                <Link className="home-topic-tag" href={tag.href} key={tag.label}>
                  {tag.label}
                </Link>
              )
            })}
          </div>

          <div className="home-hero__actions">
            <Link className="home-primary-action" href="/docs">
              <span>进入文档</span>
              <ArrowRight aria-hidden="true" size={17} />
            </Link>
            <Link className="home-secondary-action" href={CONTRIBUTION_HREF}>
              <GitPullRequestArrow aria-hidden="true" size={17} />
              <span>参与文档贡献</span>
            </Link>
          </div>

          <p className="home-hero__meta">{data.activeSections} 个内容方向持续维护中</p>
        </div>

        <div className="home-hero__loop">
          <HomeLogoLoop />
        </div>
      </div>
    </section>
  )
}
