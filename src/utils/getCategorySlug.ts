export function getCategorySlug(article: any) {
  if (!article?.articleType) return ''

  const cat =
    Array.isArray(article.articleType)
      ? article.articleType[0]
      : article.articleType

  const name = typeof cat === 'object' ? cat.name : ''

  return name.toLowerCase().replace(/\s+/g, '-')
}