'use client'

import { useEffect } from 'react'

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

const config = {
  particles: {
    number: {
      value: 96,
      density: { enable: true, value_area: 800 },
    },
    color: { value: '#2563eb' },
    shape: { type: 'circle' },
    opacity: {
      value: 0.32,
      random: true,
      anim: { enable: false },
    },
    size: {
      value: 2.5,
      random: true,
      anim: { enable: false },
    },
    line_linked: {
      enable: true,
      distance: 150,
      color: '#2563eb',
      opacity: 0.2,
      width: 1,
    },
    move: {
      enable: true,
      speed: 0.8,
      direction: 'none',
      random: false,
      straight: false,
      out_mode: 'bounce',
      bounce: false,
      attract: { enable: true, rotateX: 600, rotateY: 1200 },
    },
  },
  interactivity: {
    detect_on: 'canvas',
    events: {
      onhover: { enable: true, mode: 'grab' },
      onclick: { enable: false },
      resize: false,
    },
    modes: {
      grab: {
        distance: 150,
        line_linked: { opacity: 0.4 },
      },
    },
  },
  retina_detect: true,
}

const mobileConfig = {
  ...config,
  particles: {
    ...config.particles,
    number: { value: 36, density: { enable: true, value_area: 800 } },
  },
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

      const isMobile = window.innerWidth < 768
      window.particlesJS('particles-js', isMobile ? mobileConfig : config)
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
