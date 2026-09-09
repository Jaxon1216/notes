import fs from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

const root = process.cwd()

function readPngDimensions(filePath: string) {
  const png = fs.readFileSync(filePath)

  expect(png.subarray(1, 4).toString('ascii')).toBe('PNG')
  expect(png.subarray(12, 16).toString('ascii')).toBe('IHDR')

  return {
    width: png.readUInt32BE(16),
    height: png.readUInt32BE(20),
  }
}

describe('site icons', () => {
  it('points metadata at the dedicated browser and Apple icons', () => {
    const layout = fs.readFileSync(path.join(root, 'app/layout.tsx'), 'utf8')
    const icons = layout.match(/icons:\s*\{([\s\S]*?)\n  \},/)?.[1]

    expect(icons).toContain(
      "icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }]",
    )
    expect(icons).toContain(
      "apple: [{ url: '/site-icon.png', sizes: '180x180', type: 'image/png' }]",
    )
  })

  it('keeps the public assets present and the Apple icon compact', () => {
    const faviconPath = path.join(root, 'public/favicon.svg')
    const appleIconPath = path.join(root, 'public/site-icon.png')

    expect(fs.existsSync(faviconPath)).toBe(true)
    expect(fs.readFileSync(faviconPath, 'utf8')).toContain('<svg')
    expect(fs.existsSync(appleIconPath)).toBe(true)
    expect(readPngDimensions(appleIconPath)).toEqual({
      width: 180,
      height: 180,
    })
    expect(fs.statSync(appleIconPath).size).toBeLessThan(100 * 1024)
  })
})
