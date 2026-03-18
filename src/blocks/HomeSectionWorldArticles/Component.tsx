// import { getPayload } from 'payload'
// import config from '@payload-config'
// import Image from 'next/image'
// import Link from 'next/link'

// export const WorldArticlesBlockComponent = async ({
//   title,
//   articleCategory,
//   limit = 4,
// }: any) => {
//   if (!articleCategory) return null

//   const payload = await getPayload({ config })

//   const categoryId =
//     typeof articleCategory === 'object'
//       ? articleCategory.id
//       : articleCategory

//   const articlesRes = await payload.find({
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

//   if (!articlesRes.docs.length) return null

//   return (
//     <section className="world-section jeg_col_1o3">
//       <div className="jeg_block_heading jeg_block_heading_6">
//         <h3 className="jeg_block_title">
//           <span>{title}</span>
//         </h3>
//       </div>

//       <div className="jeg_posts jeg_block_container">
//         {articlesRes.docs.map((article) => (
//           <article key={article.id} className="jeg_post jeg_pl_md_3">
//             <div className="jeg_thumb">
//               <Link href={`/articles/${article.slug}`}>
//                 <Image
//                   src={article.featuredImage?.url}
//                   alt={article.title}
//                   width={120}
//                   height={86}
//                 />
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


import { getPayload } from 'payload'
import config from '@payload-config'
import Image from 'next/image'
import Link from 'next/link'
import { getCategorySlug } from '@/utils/getCategorySlug'

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
      _status: {
        equals: 'published',
      },
    },
    sort: '-publishedDate',
    limit,
  })

  if (!articlesRes.docs.length) return null

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
        {articlesRes.docs.map((article) => {
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
                      width={200}
                      height={133}
                    />
                  </Link>
                )}
              </div>
            </article>
          )
        })}
        {/* {articlesRes.docs.map((article) => (
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
                <Image
                  src={article.featuredImage.url}
                  alt={article.title}
                  width={200}
                  height={133}
                />
              )}
            </div>
          </article>
        ))} */}
      </div>
    </div>
  )
}
