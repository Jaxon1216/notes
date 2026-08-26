import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'

export function baseOptions(): BaseLayoutProps {
  return {
    githubUrl: 'https://github.com/Jaxon1216/cpp-notes',
    nav: {
      title: 'Easton Notes',
      url: '/',
    },
    links: [
      {
        text: 'Docs',
        url: '/docs',
        active: 'nested-url',
      },
    ],
  }
}
