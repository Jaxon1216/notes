"use client"

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    particlesJS: (tagId: string, config: object) => void
  }
}

const config = {
  particles: {
    number: {
      value: 150,
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
      resize: true,
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
    number: { value: 60, density: { enable: true, value_area: 800 } },
  },
}

export function ParticlesBg() {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    import('particles.js').then(() => {
      const isMobile = window.innerWidth < 768
      window.particlesJS('particles-js', isMobile ? mobileConfig : config)
    })
  }, [])

  return <div id="particles-js" />
}
