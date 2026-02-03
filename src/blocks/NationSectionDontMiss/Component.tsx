import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Article } from '@/payload-types'
import '../css/nation-page.css'

type Props = {
  title: string
  articleCategory: string
  limit: number
}

export const DontMissComponent = async ({
  title,
  articleCategory,
  limit,
}: Props) => {
  const payload = await getPayload({
    config: configPromise,
  })
  const categoryId = typeof articleCategory === 'object' ? articleCategory.id : articleCategory

  const { docs: articles } = await payload.find({
    collection: 'articles',
    where: {
      and: [
        {
          articleType: {
            equals: categoryId,
          },
        },
        {
          mediaType: {
            equals: 'image',
          },
        },
        {
          views: {
            equals: 0,
          },
        },
      ],
    },
    sort: '-publishedDate',
    limit,
  })

  return (
    <section className="world-section jeg_col_1o3">
      {/* Heading */}
      <div className="jeg_block_heading jeg_block_heading_6">
        <h3 className="jeg_block_title">
          <span>{title}</span>
        </h3>
      </div>

      {/* Articles */}
      <div className="jeg_posts jeg_block_container">
        {articles.map((article: Article) => {
          const image =
            typeof article.featuredImage === 'object'
              ? article.featuredImage?.url
              : ''

          return (
            <article
              key={article.id}
              className="jeg_post jeg_pl_md_3 format-standard"
            >
              <div className="jeg_thumb">
                <Link href={`/articles/${article.slug}`}>
                  <div className="thumbnail-container">
                    <img
                      loading="lazy"
                      width="120"
                      height="86"
                      src={image || ''}
                      alt={article.title}
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
          )
        })}
      </div>
    </section>
  )
}
