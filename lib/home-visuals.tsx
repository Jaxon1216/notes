import {
  siCss,
  siDocker,
  siExpress,
  siGit,
  siGithub,
  siGo,
  siHtml5,
  siJavascript,
  siMarkdown,
  siNextdotjs,
  siNginx,
  siNodedotjs,
  siPnpm,
  siPostgresql,
  siReact,
  siRedis,
  siTailwindcss,
  siTypescript,
  siVite,
  siWebpack,
  siVuedotjs,
  type SimpleIcon,
} from 'simple-icons'

export type HomeLogoItem = {
  key: string
  label: string
  href?: string
  icon: SimpleIcon
}

export const HOME_LOGO_ITEMS: HomeLogoItem[] = [
  {
    key: 'react',
    label: 'React',
    href: '/docs/frontend/knowledge/React/01-核心概念与基础语法',
    icon: siReact,
  },
  {
    key: 'typescript',
    label: 'TypeScript',
    icon: siTypescript,
  },
  {
    key: 'tailwind',
    label: 'Tailwind CSS',
    icon: siTailwindcss,
  },
  {
    key: 'html',
    label: 'HTML',
    icon: siHtml5,
  },
  {
    key: 'css',
    label: 'CSS',
    icon: siCss,
  },
  {
    key: 'next',
    label: 'Next.js',
    href: '/docs',
    icon: siNextdotjs,
  },
  {
    key: 'node',
    label: 'Node.js',
    icon: siNodedotjs,
  },
  {
    key: 'express',
    label: 'Express',
    icon: siExpress,
  },
  {
    key: 'go',
    label: 'Go',
    href: '/docs/backend/knowledge/Go/js2go/01-入门与语法',
    icon: siGo,
  },
  {
    key: 'docker',
    label: 'Docker',
    href: '/docs/dev/tools/docker',
    icon: siDocker,
  },
  {
    key: 'postgresql',
    label: 'PostgreSQL',
    icon: siPostgresql,
  },
  {
    key: 'redis',
    label: 'Redis',
    icon: siRedis,
  },
  {
    key: 'nginx',
    label: 'Nginx',
    icon: siNginx,
  },
  {
    key: 'vite',
    label: 'Vite',
    icon: siVite,
  },
  {
    key: 'webpack',
    label: 'Webpack',
    icon: siWebpack,
  },
  {
    key: 'pnpm',
    label: 'pnpm',
    icon: siPnpm,
  },
  {
    key: 'vue',
    label: 'Vue',
    href: '/docs/frontend/knowledge/Vue/01-工程创建与响应式基础',
    icon: siVuedotjs,
  },
  {
    key: 'javascript',
    label: 'JavaScript',
    href: '/docs/frontend/knowledge/ajax-promise-axios/01-手撕Promise与异步编程',
    icon: siJavascript,
  },
  {
    key: 'markdown',
    label: 'Markdown',
    href: '/docs/dev/tools/markdown',
    icon: siMarkdown,
  },
  {
    key: 'git',
    label: 'Git',
    href: '/docs/dev/git/git',
    icon: siGit,
  },
  {
    key: 'github',
    label: 'GitHub',
    href: 'https://github.com/Jaxon1216/cpp-notes',
    icon: siGithub,
  },
]
