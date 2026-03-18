import Image from 'next/image'
import Link from 'next/link'
import { getCategorySlug } from '@/utils/getCategorySlug'

export default function FixedArticles({ articles }: any) {
  if (!articles?.length) return null

  return (
    <div className="sub-articles-row">
      {articles.map((article: any) => {

      const categorySlug = getCategorySlug(article)

      const url =
        article.mediaType === 'image'
          ? `/articles/${categorySlug}/${article.slug}`
          : `/videos/${categorySlug}/${article.slug}`

      return (
        <article key={article.id} className="sub-article">
          <Link href={url}>
            <div className="thumbnail-container">
              {article.featuredImage && (
                <Image
                  src={article.featuredImage.url}
                  alt={article.title}
                  fill
                />
              )}
            </div>

            <h3 className="article-title">
              {article.title}
            </h3>
          </Link>
        </article>
      )})}
    </div>
  )
}
