import { ArrowRight, Construction, FilePlus2 } from 'lucide-react'
import Link from 'next/link'

type EmptyCategoryStateProps = {
  title: string
  description: string
}

export function EmptyCategoryState({
  title,
  description,
}: EmptyCategoryStateProps) {
  return (
    <section className="empty-category-state" aria-labelledby="empty-category-title">
      <div className="empty-category-state__icon" aria-hidden="true">
        <Construction size={28} strokeWidth={1.8} />
      </div>
      <p className="empty-category-state__eyebrow">COMING SOON</p>
      <h2 id="empty-category-title">Oops，{title}还在施工</h2>
      <p>{description}</p>
      <p>这个栏目正在整理可复用、可验证的内容，先不拿半成品占位置。</p>
      <div className="empty-category-state__actions">
        <Link href="/docs">
          浏览已有内容
          <ArrowRight aria-hidden="true" size={16} />
        </Link>
        <Link className="is-secondary" href="/docs/dev/conventions/open-source-contribution">
          <FilePlus2 aria-hidden="true" size={16} />
          参与补充
        </Link>
      </div>
    </section>
  )
}
