// utils/htmlToLexical.ts
import { JSDOM } from 'jsdom'

type LexicalNode = Record<string, any>

// ─────────────────────────────────────────────────────────────
// Global src-filename → Payload media ID registry
// Call registerMediaSrc() from migrateMedia() for every uploaded image
// ─────────────────────────────────────────────────────────────
const srcToPayloadId = new Map<string, number>()

export function registerMediaSrc(srcUrl: string, payloadId: number) {
  const filename = extractFilename(srcUrl)
  if (filename) srcToPayloadId.set(filename, payloadId)
}

function extractFilename(src: string): string {
  return src.split('/').pop()?.split('?')[0] || ''
}

function resolvePayloadMediaId(src: string): number | null {
  const filename = extractFilename(src)
  return srcToPayloadId.get(filename) ?? null
}

export function isMediaSrcRegistered(srcUrl: string): boolean {
  const filename = extractFilename(srcUrl)
  return srcToPayloadId.has(filename)
}

// ─────────────────────────────────────────────────────────────
// Main entry point
// ─────────────────────────────────────────────────────────────
export function htmlToLexical(html: string): object {
  // Decode common HTML entities before parsing
  const decoded = html
    .replace(/\\"/g, '"')
    .replace(/&#8220;/g, '\u201C')
    .replace(/&#8221;/g, '\u201D')
    .replace(/&#8216;/g, '\u2018')
    .replace(/&#8217;/g, '\u2019')
    .replace(/&#8211;/g, '\u2013')
    .replace(/&#8212;/g, '\u2014')
    .replace(/&#038;/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')

  const dom = new JSDOM(`<body>${decoded}</body>`)
  const body = dom.window.document.body
  const children: LexicalNode[] = []

  body.childNodes.forEach((node) => {
    // parseNode can return null | single node | array of nodes
    const parsed = parseNode(node as Element)
    if (!parsed) return
    if (Array.isArray(parsed)) {
      children.push(...parsed)
    } else {
      children.push(parsed)
    }
  })

  // Payload requires at least one child
  if (children.length === 0) {
    children.push(makeParagraph([makeText('')]))
  }

  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children,
      direction: null,
    },
  }
}

// ─────────────────────────────────────────────────────────────
// Block-level node parser
// Returns: null | LexicalNode | LexicalNode[]
// ─────────────────────────────────────────────────────────────
function parseNode(node: Element): LexicalNode | LexicalNode[] | null {
  // Plain text node
  if (node.nodeType === 3) {
    const text = node.textContent?.trim()
    if (!text) return null
    return makeText(text)
  }

  // Only process element nodes
  if (node.nodeType !== 1) return null

  const tag = node.nodeName.toLowerCase()

  switch (tag) {
    case 'p':
      return makeParagraph(parseInlineChildren(node))

    case 'h1': case 'h2': case 'h3':
    case 'h4': case 'h5': case 'h6':
      return makeHeading(tag, parseInlineChildren(node))

    // WordPress wraps images in <figure class="wp-caption">
    case 'figure':
      return parseFigure(node)

    // Sometimes WP uses <div class="wp-caption"> instead of figure
    case 'div': {
      if (node.classList?.contains('wp-caption')) {
        return parseFigure(node)
      }
      // Generic div: recurse into children and flatten
      const divChildren: LexicalNode[] = []
      node.childNodes.forEach((child) => {
        const parsed = parseNode(child as Element)
        if (!parsed) return
        if (Array.isArray(parsed)) divChildren.push(...parsed)
        else divChildren.push(parsed)
      })
      return divChildren.length > 0 ? divChildren : null
    }

    case 'ul':
      return makeList('bullet', node)

    case 'ol':
      return makeList('number', node)

    case 'blockquote':
      return makeQuote(parseInlineChildren(node))

    case 'hr':
    case 'script':
    case 'style':
      return null

    default: {
      const text = node.textContent?.trim()
      if (text) return makeParagraph(parseInlineChildren(node))
      return null
    }
  }
}

// ─────────────────────────────────────────────────────────────
// Figure / image parser
// Always returns an ARRAY so root loop can spread it correctly
// ─────────────────────────────────────────────────────────────
function parseFigure(node: Element): LexicalNode[] | null {
  const img = node.querySelector('img')
  if (!img) return null

  const src = img.getAttribute('src') || ''
  const alt = img.getAttribute('alt') || ''
  const captionEl = node.querySelector('figcaption, .wp-caption-text')
  const captionText = captionEl?.textContent?.trim() || ''

  const result: LexicalNode[] = []
  const payloadId = resolvePayloadMediaId(src)

  if (payloadId) {
    // Valid Payload upload node — value must be ONLY { id }
    // Do NOT pass url/alt/width/height — Payload fetches those from media collection
    result.push({
      type: 'upload',
      version: 1,
      format: '',
      indent: 0,
      value: { id: payloadId },
      relationTo: 'media',
      fields: {},
      children: [],
    })
  } else {
    // Fallback: safe paragraph — migration will not fail
    // You can run a second pass later to replace these with real upload nodes
    const label = alt || extractFilename(src) || src
    result.push(makeParagraph([makeText(`[IMAGE: ${label}]`)]))
  }

  // Caption as italic paragraph immediately below the image
  if (captionText) {
    result.push(makeParagraph([makeText(captionText, { italic: true })]))
  }

  return result
}

// ─────────────────────────────────────────────────────────────
// Inline children parser (for p, headings, li, blockquote)
// ─────────────────────────────────────────────────────────────
function parseInlineChildren(node: Element): LexicalNode[] {
  const children: LexicalNode[] = []

  node.childNodes.forEach((child) => {
    const el = child as Element

    if (child.nodeType === 3) {
      const text = child.textContent || ''
      if (text) children.push(makeText(text))
      return
    }

    if (child.nodeType !== 1) return

    const tag = el.nodeName.toLowerCase()

    switch (tag) {
      case 'strong':
      case 'b':
        // Recurse so nested <em> inside <strong> works
        el.childNodes.forEach((inner) => {
          const t = inner.textContent || ''
          if (t) children.push(makeText(t, { bold: true }))
        })
        break

      case 'em':
      case 'i':
        children.push(makeText(el.textContent || '', { italic: true }))
        break

      case 'u':
        children.push(makeText(el.textContent || '', { underline: true }))
        break

      case 'a': {
        const href = el.getAttribute('href') || '#'
        const linkText = el.textContent || ''
        if (linkText.trim()) children.push(makeLink(href, linkText))
        break
      }

      case 'br':
        children.push(makeText('\n'))
        break

      case 'span':
        // Spans may carry inline styles — recurse
        children.push(...parseInlineChildren(el))
        break

      case 'img':
        // Ignore inline images outside figures
        break

      default: {
        const text = el.textContent?.trim()
        if (text) children.push(makeText(text))
      }
    }
  })

  return children
}

// ─────────────────────────────────────────────────────────────
// Node factories
// ─────────────────────────────────────────────────────────────

function makeText(
  text: string,
  formats: { bold?: boolean; italic?: boolean; underline?: boolean } = {},
): LexicalNode {
  let format = 0
  if (formats.bold) format |= 1
  if (formats.italic) format |= 2
  if (formats.underline) format |= 8

  return {
    type: 'text',
    text,
    format,
    style: '',
    mode: 'normal',
    detail: 0,
    version: 1,
  }
}

function makeParagraph(children: LexicalNode[]): LexicalNode {
  const filtered = children.filter(Boolean)
  return {
    type: 'paragraph',
    version: 1,
    format: '',
    indent: 0,
    direction: null,
    textStyle: '',
    textFormat: 0,
    children: filtered.length ? filtered : [makeText('')],
  }
}

function makeHeading(tag: string, children: LexicalNode[]): LexicalNode {
  return {
    type: 'heading',
    tag,
    version: 1,
    format: '',
    indent: 0,
    direction: null,
    children: children.length ? children : [makeText('')],
  }
}

function makeList(listType: 'bullet' | 'number', node: Element): LexicalNode {
  const items = Array.from(node.querySelectorAll(':scope > li')).map((li, index) => ({
    type: 'listitem',
    version: 1,
    value: index + 1,
    checked: undefined,
    format: '',
    indent: 0,
    direction: null,
    children: parseInlineChildren(li as Element),
  }))

  return {
    type: 'list',
    listType,
    version: 1,
    format: '',
    indent: 0,
    direction: null,
    start: 1,
    tag: listType === 'bullet' ? 'ul' : 'ol',
    children: items,
  }
}

function makeQuote(children: LexicalNode[]): LexicalNode {
  return {
    type: 'quote',
    version: 1,
    format: '',
    indent: 0,
    direction: null,
    children: children.length ? children : [makeText('')],
  }
}
function makeLink(url: string, text: string): LexicalNode {
  // Fix 1: Remove spaces from URL (WP sometimes has broken URLs)
  // Fix 2: Validate — if still broken, render as plain text instead of a link node
  const cleanUrl = url.replace(/\s+/g, '')

  let isValid = false
  try {
    new URL(cleanUrl)
    isValid = true
  } catch {
    isValid = false
  }

  // If URL is completely broken, just return plain text — no link node
  // This avoids Payload validation failure
  if (!isValid || !cleanUrl) {
    return makeText(text)
  }

  return {
    type: 'link',
    version: 1,
    format: '',
    indent: 0,
    direction: null,
    fields: {
      url: cleanUrl,
      newTab: false,
      linkType: 'custom',
    },
    children: [makeText(text)],
  }
}

// function makeLink(url: string, text: string): LexicalNode {
//   return {
//     type: 'link',
//     version: 1,
//     format: '',
//     indent: 0,
//     direction: null,
//     fields: {
//       url,
//       newTab: false,
//       linkType: 'custom',
//     },
//     children: [makeText(text)],
//   }
// }