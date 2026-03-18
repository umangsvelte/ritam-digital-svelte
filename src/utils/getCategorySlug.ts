// export function getCategorySlug(article: any) {
//   if (!article?.articleType) return ''

//   const cat =
//     Array.isArray(article.articleType)
//       ? article.articleType[0]
//       : article.articleType

//   const name = typeof cat === 'object' ? cat.name : ''

//   return name.toLowerCase().replace(/\s+/g, '-')
// }

export function getCategorySlug(article: any, categoryId?: string) {
  if (!article?.articleType) return ''

  const categories = Array.isArray(article.articleType)
    ? article.articleType
    : [article.articleType]

  // 👉 match with block categoryId (preferred)
  let matched = null

  if (categoryId) {
    matched = categories.find((cat: any) =>
      typeof cat === 'object'
        ? cat.id === categoryId
        : cat === categoryId
    )
  }

  // 👉 fallback: first category
  const finalCat = matched || categories[0]

  const name =
    typeof finalCat === 'object' ? finalCat.name : ''

  return name?.toLowerCase().replace(/\s+/g, '-') || ''
}