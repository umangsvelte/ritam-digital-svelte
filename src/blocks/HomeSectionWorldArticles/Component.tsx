import { getPayload } from 'payload'
import config from '@payload-config'
import Image from 'next/image'
import Link from 'next/link'

export const WorldArticlesBlockComponent = async ({
  title,
  articleCategory,
  limit = 4,
}: any) => {
  if (!articleCategory) return null

  const payload = await getPayload({ config })

  const categoryId =
    typeof articleCategory === 'object'
      ? articleCategory.id
      : articleCategory

  const articlesRes = await payload.find({
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

  if (!articlesRes.docs.length) return null

  return (
    <section className="world-section jeg_col_1o3">
      <div className="jeg_block_heading jeg_block_heading_6">
        <h3 className="jeg_block_title">
          <span>{title}</span>
        </h3>
      </div>

      <div className="jeg_posts jeg_block_container">
        {articlesRes.docs.map((article) => (
          <article key={article.id} className="jeg_post jeg_pl_md_3">
            <div className="jeg_thumb">
              <Link href={`/articles/${article.slug}`}>
                <Image
                  src={article.featuredImage?.url}
                  alt={article.title}
                  width={120}
                  height={86}
                />
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
