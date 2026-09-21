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
  it('points metadata at the shared site icon', () => {
    const layout = fs.readFileSync(path.join(root, 'app/layout.tsx'), 'utf8')
    const icons = layout.match(/icons:\s*\{([\s\S]*?)\n  \},/)?.[1]

    expect(icons).toContain(
      "icon: [{ url: '/site-icon.png', type: 'image/png' }]",
    )
    expect(icons).toContain(
      "apple: [{ url: '/site-icon.png', sizes: '180x180', type: 'image/png' }]",
    )
  })

  it('keeps the site icon present and compact', () => {
    const siteIconPath = path.join(root, 'public/site-icon.png')

    expect(fs.existsSync(siteIconPath)).toBe(true)
    expect(readPngDimensions(siteIconPath)).toEqual({
      width: 180,
      height: 180,
    })
    expect(fs.statSync(siteIconPath).size).toBeLessThan(100 * 1024)
  })
})
