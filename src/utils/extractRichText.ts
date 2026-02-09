export function extractTextFromRichText(data: any): string {
  if (!data || !data.root) return ''

  let text = ''

  function traverse(nodes: any[]) {
    for (const node of nodes) {
      if (node.type === 'text') {
        text += node.text + ' '
      }
      if (node.children) {
        traverse(node.children)
      }
    }
  }

  traverse(data.root.children || [])
  return text.trim()
}