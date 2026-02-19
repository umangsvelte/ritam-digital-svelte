import Image from 'next/image'
import Link from 'next/link'

export default function FixedArticles({ articles }: any) {
  if (!articles?.length) return null

  return (
    <div className="sub-articles-row">
      {articles.map((article: any) => (
        <article key={article.id} className="sub-article">
          <Link href={`/articles/${article.slug}`}>
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
      ))}
    </div>
  )
}
