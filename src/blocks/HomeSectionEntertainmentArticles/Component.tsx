// import Link from 'next/link'
// import Image from 'next/image'
// import { getPayload } from 'payload'
// import config from '@payload-config'

// type Props = {
//   title?: string
//   articleCategory?: string | { id: string }
//   limit?: number
// }

// export const EntertainmentArticlesBlockComponent = async ({
//   title,
//   articleCategory,
//   limit = 3,
// }: Props) => {
//   if (!articleCategory) return null

//   const payload = await getPayload({ config })

//   const categoryId =
//     typeof articleCategory === 'object'
//       ? articleCategory.id
//       : articleCategory

//   const { docs } = await payload.find({
//     collection: 'articles',
//     where: {
//       articleType: {
//         equals: categoryId,
//       },
//       mediaType: {
//         equals: 'image',
//       },
//     },
//     sort: '-publishedDate',
//     limit,
//   })

//   if (!docs.length) return null

//   return (
//     <section className="entertainment-section jeg_col_1o3">
//       <div className="jeg_block_heading jeg_block_heading_6">
//         <h3 className="jeg_block_title">
//           <span>{title}</span>
//         </h3>
//       </div>

//       <div className="jeg_posts jeg_block_container flex flex-col gap-4">
//         {docs.map((article) => (
//           <article
//             key={article.id}
//             className="jeg_post jeg_pl_md_3 format-standard flex gap-3 items-start"
//           >
//             <div className="jeg_thumb">
//               <Link href={`/articles/${article.slug}`}>
//                 <div className="thumbnail-container">
//                   <Image
//                     src={article.featuredImage?.url}
//                     alt={article.title}
//                     width={120}
//                     height={86}
//                   />
//                 </div>
//               </Link>
//             </div>

//             <div className="jeg_postblock_content">
//               <h3 className="jeg_post_title">
//                 <Link href={`/articles/${article.slug}`}>
//                   {article.title}
//                 </Link>
//               </h3>
//             </div>
//           </article>
//         ))}
//       </div>
//     </section>
//   )
// }

import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getCategorySlug } from '@/utils/getCategorySlug'

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
      _status: {
        equals: 'published',
      },
    },
    sort: '-publishedDate',
    limit,
  })

  if (!docs.length) return null

  return (
    <div className="category-block">
      
      {/* Header */}
      <div className="section-header-line">
        <h2 className="section-heading">
          {title}
        </h2>
      </div>

      {/* Posts */}
      <div className="category-posts">
        {docs.map((article) => {
            const categorySlug = getCategorySlug(article, categoryId)

            const url =
              article.mediaType === 'image'
                ? `/articles/${categorySlug}/${article.slug}`
                : `/videos/${categorySlug}/${article.slug}`

            return (
              <article
                key={article.id}
                className="category-post-item"
              >
                <h3>
                  <Link href={url}>
                    {article.title}
                  </Link>
                </h3>

                <div className="thumbnail-container">
                  {article.featuredImage?.url && (
                    <Link href={url}>
                      <Image
                        src={article.featuredImage.url}
                        alt={article.title}
                        width={350}
                        height={230}
                      />
                    </Link>
                  )}
                </div>
              </article>
            )
          })}
        {/* {docs.map((article) => (
          <article
            key={article.id}
            className="category-post-item"
          >
            <h3>
              <Link href={article.mediaType === 'image' ? `/articles/${article.slug}` : `/videos/${article.slug}`}>
                {article.title}
              </Link>
            </h3>

            <div className="thumbnail-container">
              {article.featuredImage?.url && (
                <Link href={article.mediaType === 'image' ? `/articles/${article.slug}` : `/videos/${article.slug}`}>
                  <Image
                    src={article.featuredImage.url}
                    alt={article.title}
                    width={350}
                    height={230}
                  />
                </Link>
              )}
            </div>
          </article>
        ))} */}
      </div>
    </div>
  )
}
