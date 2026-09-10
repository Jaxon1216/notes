import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

import { afterEach, describe, expect, it } from 'vitest'

const scriptPath = path.join(process.cwd(), 'scripts/check-images.cjs')
const fixtures: string[] = []

function createFixture(markdown: string, imageBytes?: number) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'notes-images-'))
  fixtures.push(root)
  fs.writeFileSync(path.join(root, 'index.md'), markdown)

  if (imageBytes !== undefined) {
    const imageDir = path.join(root, 'img')
    fs.mkdirSync(imageDir)
    fs.writeFileSync(path.join(imageDir, 'example.webp'), Buffer.alloc(imageBytes))
  }

  return root
}

function runCheck(target: string) {
  const result = spawnSync(process.execPath, [scriptPath, target], {
    encoding: 'utf8',
  })

  return {
    status: result.status,
    output: `${result.stdout}${result.stderr}`,
  }
}

afterEach(() => {
  for (const fixture of fixtures.splice(0)) {
    fs.rmSync(fixture, { force: true, recursive: true })
  }
})

describe('image repository checks', () => {
  it('accepts a referenced local WebP image below the recommended size', () => {
    const root = createFixture(
      '![示例截图](./img/example.webp)\n',
      32 * 1024,
    )

    const result = runCheck(root)

    expect(result.status).toBe(0)
    expect(result.output).toContain('1 images')
  })

  it('rejects an image that is not referenced by Markdown or MDX', () => {
    const root = createFixture('# No image\n', 32 * 1024)

    const result = runCheck(root)

    expect(result.status).toBe(1)
    expect(result.output).toContain('[image-orphan]')
  })

  it('warns without failing when an image exceeds 500 KiB', () => {
    const root = createFixture(
      '![较大截图](./img/example.webp)\n',
      500 * 1024 + 1,
    )

    const result = runCheck(root)

    expect(result.status).toBe(0)
    expect(result.output).toContain('[image-size-warning]')
    expect(result.output).toContain('建议压缩到 500 KiB 以内')
  })

  it('rejects an image that exceeds 1 MiB', () => {
    const root = createFixture(
      '![过大截图](./img/example.webp)\n',
      1024 * 1024 + 1,
    )

    const result = runCheck(root)

    expect(result.status).toBe(1)
    expect(result.output).toContain('[image-size-limit]')
    expect(result.output).toContain('请压缩后再提交')
  })

  it('warns when content references a remote image without a file extension', () => {
    const root = createFixture(
      '<img src="https://cdn.example.com/image" alt="远程图片">\n',
    )

    const result = runCheck(root)

    expect(result.status).toBe(0)
    expect(result.output).toContain('[remote-image]')
    expect(result.output).toContain('建议下载到当前专题')
  })
})
