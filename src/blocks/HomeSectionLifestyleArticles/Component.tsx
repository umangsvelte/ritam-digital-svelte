// import React from 'react'
// import Link from 'next/link'
// import Image from 'next/image'
// import { getPayload } from 'payload'
// import configPromise from '@payload-config'

// type Props = {
//   title: string
//   articleCategory: any
//   limit?: number
// }

// export const LifestyleArticlesBlockComponent: React.FC<Props> = async ({
//   title,
//   articleCategory,
//   limit = 3,
// }) => {
//   const payload = await getPayload({ config: configPromise })

//   const articlesRes = await payload.find({
//     collection: 'articles',
//     where: {
//       articleType: {
//         equals:
//           typeof articleCategory === 'object'
//             ? articleCategory.id
//             : articleCategory,
//       },
//     },
//     sort: '-publishedDate',
//     limit,
//   })

//   return (
//     <section className="container content-section">
//       <div className="section-header">
//         <h2 className="section-title">
//           <Link href="#">{title}</Link>
//         </h2>
//       </div>

//       <div className="article-grid">
//         {articlesRes.docs.map((article) => (
//           <article key={article.id} className="article-card">
//             <div
//               className="article-card-image"
//               style={{
//                 backgroundImage: `url(${
//                   article.featuredImage?.url || article.videoThumbnail?.url || ''
//                 })`,
//               }}
//             >
//               {article?.articleType && (
//                 <span className="article-card-category">
//                   {article.articleType?.name}
//                 </span>
//               )}
//             </div>

//             <div className="article-card-content">
//               <h3 className="article-card-headline">
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


import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import LifestyleArticlesClient from './LifestyleArticlesClient'

type Props = {
  title: string
  articleCategory: any
  limit?: number
}

export const LifestyleArticlesBlockComponent = async ({
  title,
  articleCategory,
  limit,
}: Props) => {
  const payload = await getPayload({ config: configPromise })

  const categoryId =
    typeof articleCategory === 'object'
      ? articleCategory.id
      : articleCategory

  const initialLimit = limit ?? 9

  const { docs, totalDocs } = await payload.find({
    collection: 'articles',
    where: {
      articleType: {
        equals: categoryId,
      },
    },
    sort: '-publishedDate',
    limit: initialLimit,
  })

  return (
    <LifestyleArticlesClient
      title={title}
      categoryId={categoryId}
      initialArticles={docs}
      totalDocs={totalDocs}
      initialLimit={initialLimit}
      showLoadMore={!limit}
    />
  )
}
