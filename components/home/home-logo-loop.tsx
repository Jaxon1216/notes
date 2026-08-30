'use client'

import type { CSSProperties } from 'react'
import Link from 'next/link'

import { LogoLoop, type LogoItem } from '@/components/reactbits/logo-loop'
import { HOME_LOGO_ITEMS } from '@/lib/home-visuals'

export function HomeLogoLoop() {
  const logos: LogoItem[] = HOME_LOGO_ITEMS.map((item) => {
    const logoStyle = {
      '--home-logo-color': `#${item.icon.hex}`,
    } as CSSProperties

    return {
      title: item.label,
      ariaLabel: item.label,
      href: item.href,
      node: (
        <span className="home-logo-item" style={logoStyle}>
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d={item.icon.path} />
          </svg>
          <span>{item.label}</span>
        </span>
      ),
    }
  })

  return (
    <LogoLoop
      ariaLabel="Easton Notes 涉及的技术栈"
      className="home-logo-loop"
      direction="left"
      fadeOut
      fadeOutColor="#ffffff"
      gap={14}
      hoverSpeed={26}
      logoHeight={42}
      logos={logos}
      renderItem={(item, key, { isDuplicate }) => {
        if (!('node' in item)) return null
        const isExternal = item.href?.startsWith('http')

        if (!item.href) return item.node

        return isExternal ? (
          <a
            className="logoloop__link"
            href={item.href}
            key={key}
            rel="noreferrer"
            tabIndex={isDuplicate ? -1 : undefined}
            target="_blank"
          >
            {item.node}
          </a>
        ) : (
          <Link
            className="logoloop__link"
            href={item.href}
            key={key}
            tabIndex={isDuplicate ? -1 : undefined}
          >
            {item.node}
          </Link>
        )
      }}
      scaleOnHover
      speed={72}
    />
  )
}
