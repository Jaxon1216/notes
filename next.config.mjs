import { createMDX } from 'fumadocs-mdx/next'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  turbopack: {
    root,
  },
}

const withMDX = createMDX({
  macro: {
    include: './lib/source.ts',
  },
})

export default withMDX(config)
