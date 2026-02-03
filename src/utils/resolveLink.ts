export function resolveLink(link: any): string {
  if (!link) return '#'

  // Custom URL
  if (link.type === 'custom' && link.url) {
    return link.url
  }

  // Internal reference
  if (
    link.type === 'reference' &&
    link.reference?.value
  ) {
    const ref = link.reference.value

    // Pages collection (most common)
    if (ref.slug === 'home') return '/'
    return `/${ref.slug}`
  }

  return '#'
}
