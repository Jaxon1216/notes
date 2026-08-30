import { HomeHero } from '@/components/home/home-hero'
import { getHomeData } from '@/lib/content'

export default function HomePage() {
  const data = getHomeData()

  return (
    <main className="home-shell">
      <HomeHero data={data} />
    </main>
  )
}
