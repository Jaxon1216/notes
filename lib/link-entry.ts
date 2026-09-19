export type LinkEntry = {
  title: string
  scenario: string
  description: string
  href: string
}

export function validateLinkEntries(
  entries: readonly LinkEntry[],
  collectionName: string,
) {
  const errors: string[] = []
  const hrefs = new Set<string>()

  for (const [index, entry] of entries.entries()) {
    const prefix = `${collectionName}[${index}]`

    if (!entry.title.trim()) errors.push(`${prefix} 缺少 title`)
    if (!entry.scenario.trim()) errors.push(`${prefix} 缺少 scenario`)
    if (!entry.description.trim()) errors.push(`${prefix} 缺少 description`)
    if (!entry.href.startsWith('https://')) errors.push(`${prefix} 缺少 HTTPS href`)
    if (hrefs.has(entry.href)) errors.push(`${prefix} href 重复`)
    hrefs.add(entry.href)
  }

  return errors
}
