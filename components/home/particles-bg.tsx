'use client'

import { useEffect } from 'react'

import { createParticlesConfig } from './particles-config'

type ParticlesInstance = {
  pJS: {
    particles: {
      move: {
        enable: boolean
      }
    }
    fn: {
      drawAnimFrame: number
      particlesRefresh: () => void
      vendors: {
        destroypJS: () => void
      }
    }
  }
}

declare global {
  interface Window {
    particlesJS: (tagId: string, config: object) => void
    pJSDom: ParticlesInstance[] | null
  }
}

export function ParticlesBg() {
  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    let cancelled = false
    let loading = false
    let instance: ParticlesInstance | undefined
    let isPaused = false
    let resizeTimer: number | undefined

    const syncAnimationState = () => {
      if (!instance) return

      const shouldPause = document.hidden || motionQuery.matches

      if (shouldPause && !isPaused) {
        instance.pJS.particles.move.enable = false
        window.cancelAnimationFrame(instance.pJS.fn.drawAnimFrame)
        isPaused = true
      } else if (!shouldPause && isPaused) {
        instance.pJS.particles.move.enable = true
        isPaused = false
        instance.pJS.fn.particlesRefresh()
      }
    }

    const initializeParticles = async () => {
      if (cancelled || loading || instance || motionQuery.matches) return
      loading = true

      await import('particles.js')
      loading = false

      if (cancelled || motionQuery.matches) return

      window.particlesJS(
        'particles-js',
        createParticlesConfig(window.innerWidth < 768),
      )
      instance = window.pJSDom?.at(-1)
      syncAnimationState()
    }

    const handleMotionChange = () => {
      if (!motionQuery.matches && !instance) {
        void initializeParticles()
        return
      }

      syncAnimationState()
    }

    const handleResize = () => {
      if (!instance || document.hidden || motionQuery.matches) return

      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        if (!instance || document.hidden || motionQuery.matches) return
        instance.pJS.fn.particlesRefresh()
      }, 150)
    }

    document.addEventListener('visibilitychange', syncAnimationState)
    motionQuery.addEventListener('change', handleMotionChange)
    window.addEventListener('resize', handleResize)
    void initializeParticles()

    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', syncAnimationState)
      motionQuery.removeEventListener('change', handleMotionChange)
      window.removeEventListener('resize', handleResize)
      window.clearTimeout(resizeTimer)

      if (instance) {
        instance.pJS.fn.vendors.destroypJS()
        window.pJSDom = []
      }
    }
  }, [])

  return <div id="particles-js" />
}
