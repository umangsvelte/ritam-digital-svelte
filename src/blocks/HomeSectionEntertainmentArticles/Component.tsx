import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@payload-config'

type Props = {
  title?: string
  articleCategory?: string | { id: string }
  limit?: number
}

export const EntertainmentArticlesBlockComponent = async ({
  title,
  articleCategory,
  limit = 3,
}: Props) => {
  if (!articleCategory) return null

  const payload = await getPayload({ config })

  const categoryId =
    typeof articleCategory === 'object'
      ? articleCategory.id
      : articleCategory

  const { docs } = await payload.find({
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

  if (!docs.length) return null

  return (
    <section className="entertainment-section jeg_col_1o3">
      <div className="jeg_block_heading jeg_block_heading_6">
        <h3 className="jeg_block_title">
          <span>{title}</span>
        </h3>
      </div>

      <div className="jeg_posts jeg_block_container">
        {docs.map((article) => (
          <article
            key={article.id}
            className="jeg_post jeg_pl_md_3 format-standard"
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
    </section>
  )
}
