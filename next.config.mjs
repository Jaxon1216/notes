import { createMDX } from 'fumadocs-mdx/next'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))

// Situation: Next.js 图像链路间接依赖的 sharp@0.35.3 命中了已知安全公告。
// Task: 不升级整套 Next.js 的前提下，让所有环境稳定安装修复后的版本。
// Action: package.json 使用 overrides 将传递依赖固定为兼容的 sharp@0.35.4。
// Result: 图像处理能力保持不变，npm audit --omit=dev 恢复为 0 漏洞。
/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  turbopack: {
    root,
  },
  async redirects() {
    return [
      {
        source: '/docs/frontend/knowledge/handwrite/:path*',
        destination: '/docs/frontend/bagu/handwrite/:path*',
        permanent: true,
      },
      {
        source: '/docs/frontend/knowledge/:path*',
        destination: '/docs/frontend/tutorial/:path*',
        permanent: true,
      },
      {
        source: '/docs/backend/knowledge/:path*',
        destination: '/docs/backend/tutorial/:path*',
        permanent: true,
      },
      {
        source: '/docs/agent/knowledge/:path*',
        destination: '/docs/agent/bagu/:path*',
        permanent: true,
      },
      ...['frontend', 'backend', 'agent'].flatMap((section) => [
        {
          source: `/docs/${section}/resources`,
          destination: '/docs/resources',
          permanent: true,
        },
        {
          source: `/docs/${section}/resources/:path*`,
          destination: '/docs/resources',
          permanent: true,
        },
      ]),
    ]
  },
}

const withMDX = createMDX({
  macro: {
    include: './lib/source.ts',
  },
})

export default withMDX(config)
