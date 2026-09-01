import { describe, expect, it } from 'vitest'

import { createParticlesConfig } from '../components/home/particles-config'

describe('home particles config', () => {
  it('uses the clearer personal-homepage desktop profile', () => {
    const config = createParticlesConfig(false) as any

    expect(config.particles.number.value).toBe(120)
    expect(config.particles.color.value).toBe('#3b82f6')
    expect(config.particles.opacity.value).toBe(0.25)
    expect(config.particles.line_linked.opacity).toBe(0.15)
    expect(config.retina_detect).toBe(true)
  })

  it('uses the compact mobile profile without disabling Retina rendering', () => {
    const config = createParticlesConfig(true) as any

    expect(config.particles.number.value).toBe(45)
    expect(config.retina_detect).toBe(true)
    expect(config.interactivity.events.resize).toBe(true)
  })
})
