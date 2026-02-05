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

type CategoryConfig = {
  articleCategory: any
  mediaType?: 'image' | 'video'
  limit: number
  enableLoadMore: boolean
}

type Props = {
  title: string
  categoryConfigs: CategoryConfig[]
}

export const LifestyleArticlesBlockComponent = async ({
  title,
  categoryConfigs,
}: Props) => {
  const payload = await getPayload({ config: configPromise })

  const sections = await Promise.all(
    categoryConfigs.map(async config => {
      const categoryId =
        typeof config.articleCategory === 'object'
          ? config.articleCategory.id
          : config.articleCategory

      const whereConditions: any[] = [
        {
          articleType: {
            equals: categoryId,
          },
        },
      ]

      if (config.mediaType) {
        whereConditions.push({
          mediaType: {
            equals: config.mediaType,
          },
        })
      }

      const effectiveLimit =
      typeof config.limit === 'number' && config.limit > 0
        ? config.limit
        : 9

      const result = await payload.find({
        collection: 'articles',
        where: {
          and: whereConditions,
        },
        sort: '-publishedDate',
        page: 1,
        limit: effectiveLimit,
      })

      return {
        categoryId,
        categoryName:
          typeof config.articleCategory === 'object'
            ? config.articleCategory.name
            : '',
        mediaType: config.mediaType,
        initialArticles: result.docs,
        totalDocs: result.totalDocs,
        limit: effectiveLimit,
        enableLoadMore: config.enableLoadMore,
      }
    })
  )

  return (
    <LifestyleArticlesClient
      title={title}
      sections={sections}
    />
  )
}
