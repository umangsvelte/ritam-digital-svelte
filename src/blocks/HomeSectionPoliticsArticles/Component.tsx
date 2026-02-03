import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@payload-config'

type Props = {
  title?: string
  articleCategory?: string | { id: string } 
  limit?: number
}

export const PoliticsArticlesBlockComponent = async ({
  title,
  articleCategory,
  limit = 10,
}: any) => {
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

  const mid = Math.ceil(res.docs.length / 2)
  const left = res.docs.slice(0, mid)
  const right = res.docs.slice(mid)

  return (
    <section className="politics-section jeg_col_2o3">
      <div className="jeg_block_heading jeg_block_heading_6">
        <h3 className="jeg_block_title">
          <span>{title}</span>
        </h3>
      </div>

      <div className="jeg_block_container grid grid-cols-1 md:grid-cols-2 gap-6">
        {[left, right].map((col, i) => (
          <div key={i} className="jeg_posts">
            {col.map((article) => (
              <article key={article.id} className="jeg_post jeg_pl_sm">
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
        ))}
      </div>
    </section>
  )
}
