import Link from 'next/link'

import { getHomeData, type ChildStat } from '@/lib/content'

function ChildEntry({ stat }: { stat: ChildStat }) {
  const content = (
    <>
      <div>
        <h3>{stat.child.title}</h3>
        <p>{stat.child.description}</p>
      </div>
      <span>{stat.fileCount > 0 ? `${stat.fileCount} 篇` : '待补充'}</span>
    </>
  )

  if (!stat.href) {
    return <div className="home-child is-empty">{content}</div>
  }

  return (
    <Link className="home-child" href={stat.href}>
      {content}
    </Link>
  )
}

export default function HomePage() {
  const data = getHomeData()

  return (
    <main className="home-shell">
      <div className="home-container">
        <header className="home-header">
          <div>
            <p className="home-kicker">Easton Notes</p>
            <h1 className="home-title">工程实践知识库</h1>
          </div>
          <p className="home-subtitle">
            前端、服务端、算法、Agent 应用开发和个人开发常用资料的统一入口。
          </p>
          <div className="home-stats" aria-label="站点统计">
            <div className="home-stat">
              <strong>{data.totalFiles}</strong>
              <span>篇文章</span>
            </div>
            <div className="home-stat">
              <strong>{data.sections.length}</strong>
              <span>主栏目</span>
            </div>
            <div className="home-stat">
              <strong>{data.activeSections}</strong>
              <span>已有内容</span>
            </div>
          </div>
        </header>

        <div className="home-section-list">
          {data.sections.map((section) => (
            <section className="home-section" id={section.section.dir} key={section.section.key}>
              <div className="home-section-head">
                <div>
                  <p className="home-kicker">{section.section.dir}</p>
                  <h2>{section.section.title}</h2>
                  <p>{section.section.description}</p>
                </div>
                {section.href ? (
                  <Link className="home-section-link" href={section.href}>
                    进入栏目
                  </Link>
                ) : (
                  <span className="home-section-link">等待内容</span>
                )}
              </div>
              <div className="home-child-grid">
                {section.children.map((child) => (
                  <ChildEntry key={child.child.key} stat={child} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}
