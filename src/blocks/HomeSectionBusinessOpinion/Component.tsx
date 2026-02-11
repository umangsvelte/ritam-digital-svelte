import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'

type Props = {
  title: string
  articleCategory: string | { id: string }
  limit?: number
}

export const HomeSectionBusinessOpinionComponent = async ({
  title,
  articleCategory,
  limit = 4,
}: Props) => {
  if (!articleCategory) return null

  const payload = await getPayload({ config })

  const categoryId =
    typeof articleCategory === 'object'
      ? articleCategory.id
      : articleCategory

  const res = await payload.find({
    collection: 'articles',
    where: {
      articleType: {
        equals: categoryId,
      },
      mediaType: {
        equals: 'image',
      },
    },
    sort: '-publishedDate',
    limit,
  })

  if (!res.docs.length) return null

  return (
    <section className="business-section">
      <div className="section-header">
        <h2 className="section-title">
          <Link href="#">
            {title}
          </Link>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {res.docs.map((article) => {
          const imageUrl =
            typeof article.featuredImage === 'object'
              ? article.featuredImage?.url
              : ''

          return (
            <article key={article.id} className="article-card">
              <div
                className="article-card-image"
                style={{ backgroundImage: `url(${imageUrl})` }}
              >
                <span className="article-card-category">
                  {article?.articleType.name ?? 'BUSINESS'}
                </span>
              </div>

              <div className="article-card-content">
                <h3 className="article-card-headline">
                  <Link href={`/articles/${article.slug}`}>
                    {article.title}
                  </Link>
                </h3>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
