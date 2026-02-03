import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@payload-config'

type Props = {
  title: string
  articleCategory: string | { id: string }
  limit?: number
}

export const SportsArticlesBlockComponent = async ({
  title,
  articleCategory,
  limit = 4,
}: Props) => {
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

  const [featured, ...smallArticles] = res.docs

  return (
    <section className="sports-section jeg_col_2o3">
      {/* Heading */}
      <div className="jeg_block_heading jeg_block_heading_6">
        <h3 className="jeg_block_title">
          <span>{title}</span>
        </h3>
      </div>

      <div className="jeg_block_container">
        <div className="jeg_posts row">
          {/* FEATURED ARTICLE */}
          {featured && (
            <article className="jeg_post jeg_pl_lg_1 col-sm-6 format-standard">
              <div className="jeg_thumb">
                <Link href={`/articles/${featured.slug}`}>
                  <div className="thumbnail-container">
                    <Image
                      src={featured.featuredImage?.url}
                      alt={featured.title}
                      width={360}
                      height={180}
                    />
                  </div>
                </Link>
              </div>

              <div className="jeg_postblock_content">
                <h3 className="jeg_post_title">
                  <Link href={`/articles/${featured.slug}`}>
                    {featured.title}
                  </Link>
                </h3>
              </div>
            </article>
          )}

          {/* SMALL ARTICLES */}
          <div className="jeg_postsmall col-sm-6">
            {smallArticles.map((article) => (
              <article
                key={article.id}
                className="jeg_post jeg_pl_sm format-standard"
              >
                <div className="jeg_thumb">
                  <Link href={`/articles/${article.slug}`}>
                    <div className="thumbnail-container">
                      <Image
                        src={article.featuredImage?.url}
                        alt={article.title}
                        width={120}
                        height={86}
                      />
                    </div>
                  </Link>
                </div>

                <div className="jeg_postblock_content">
                  <h3 className="jeg_post_title">
                    <Link href={`/articles/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
