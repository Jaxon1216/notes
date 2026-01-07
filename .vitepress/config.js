import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'CPP Notes',
  description: '学习笔记',
  
  // 配置 favicon
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],

  ],

  themeConfig: {
    // 其他主题配置...
  }
})

