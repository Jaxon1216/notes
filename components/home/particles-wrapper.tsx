"use client"

import dynamic from 'next/dynamic'

const ParticlesBg = dynamic(
  () => import('@/components/home/particles-bg').then((mod) => mod.ParticlesBg),
  { ssr: false },
)

export function ParticlesWrapper() {
  return <ParticlesBg />
}
