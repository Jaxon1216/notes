import { createMDX } from 'fumadocs-mdx/next'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))

// Situation: Next.js 图像链路间接依赖的 sharp 命中过安全公告。
// Task: 让本地、CI 和 Vercel 始终安装已修复且验证兼容的版本。
// Action: package.json 使用 overrides 将传递依赖固定到安全版本。
// Result: Next.js 图像处理能力保持不变，并避免锁文件回退到受影响版本。
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
      {
        source: '/docs/resources/articles',
        destination: '/docs/resources/blogs',
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
