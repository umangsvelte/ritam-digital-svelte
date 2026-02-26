// import Link from 'next/link'
// import { getPayload } from 'payload'
// import config from '@payload-config'

// type Props = {
//   title: string
//   articleCategory: string | { id: string }
//   limit?: number
// }

// export const HomeSectionBusinessOpinionComponent = async ({
//   title,
//   articleCategory,
//   limit = 4,
// }: Props) => {
//   if (!articleCategory) return null

//   const payload = await getPayload({ config })

//   const categoryId =
//     typeof articleCategory === 'object'
//       ? articleCategory.id
//       : articleCategory

//   const res = await payload.find({
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

//   if (!res.docs.length) return null

//   return (
//     <section className="business-section">
//       <div className="section-header">
//         <h2 className="section-title">
//           <Link href="#">
//             {title}
//           </Link>
//         </h2>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {res.docs.map((article) => {
//           const imageUrl =
//             typeof article.featuredImage === 'object'
//               ? article.featuredImage?.url
//               : ''

//           return (
//             <article key={article.id} className="article-card">
//               <div
//                 className="article-card-image"
//                 style={{ backgroundImage: `url(${imageUrl})` }}
//               >
//                 <span className="article-card-category">
//                   {article?.articleType.name ?? 'BUSINESS'}
//                 </span>
//               </div>

//               <div className="article-card-content">
//                 <h3 className="article-card-headline">
//                   <Link href={`/articles/${article.slug}`}>
//                     {article.title}
//                   </Link>
//                 </h3>
//               </div>
//             </article>
//           )
//         })}
//       </div>
//     </section>
//   )
// }

import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import Image from 'next/image'

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
      _status: {
        equals: 'published',
      },
    },
    sort: '-publishedDate',
    limit,
  })

  if (!res?.docs || res.docs.length === 0) return null

  return (
    <div className="business">
      <div className="section-header-line">
        <h2 className="section-heading">{title}</h2>
      </div>

      {/* First Row */}
      <div className="business-grid">
        {res.docs.slice(0, 2).map((article) => {
          const imageUrl =
            typeof article.featuredImage === 'object'
              ? article.featuredImage?.url
              : ''

          return (
            <div key={article.id} className="news-card">
              <Link href={`/articles/${article.slug}`}>
                <div className="news-card-image-container">
                  {imageUrl && (
                    <Image
                      src={imageUrl}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{
                        objectFit: 'cover'
                      }}
                    />
                  )}
                  <span className="tag">
                    {article?.articleType?.name ?? 'BUSINESS'}
                  </span>
                </div>
              </Link>


              <h3>
                <Link href={`/articles/${article.slug}`}>
                  {article.title}
                </Link>
              </h3>
            </div>
          )
        })}
      </div>

      {/* Second Row */}
      <div className="business-grid">
        {res.docs.slice(2, 4).map((article) => {
          const imageUrl =
            typeof article.featuredImage === 'object'
              ? article.featuredImage?.url
              : ''

          return (
            <div key={article.id} className="news-card">
              <Link href={`/articles/${article.slug}`}>
                <div className="news-card-image-container">
                  {imageUrl && (
                    <Image
                      src={imageUrl}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{
                        objectFit: 'cover'
                      }}
                    />
                  )}
                  <span className="tag">
                    {article?.articleType?.name ?? 'BUSINESS'}
                  </span>
                </div>
              </Link>

              <h3>
                <Link href={`/articles/${article.slug}`}>
                  {article.title}
                </Link>
              </h3>
            </div>
          )
        })}
      </div>
    </div>
  )
}
