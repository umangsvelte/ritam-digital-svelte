// import Link from 'next/link'
// import Image from 'next/image'
// import { getPayload } from 'payload'
// import config from '@payload-config'

// type Props = {
//   title: string
//   articleCategory: string | { id: string }
//   limit?: number
// }

// export const SportsArticlesBlockComponent = async ({
//   title,
//   articleCategory,
//   limit = 4,
// }: Props) => {
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

//   const [featured, ...smallArticles] = res.docs

//   return (
//   <section className="sports-section jeg_col_2o3">
//     {/* Heading */}
//     <div className="jeg_block_heading jeg_block_heading_6">
//       <h3 className="jeg_block_title">
//         <span>{title}</span>
//       </h3>
//     </div>

//     <div className="jeg_block_container">
//       <div className="flex flex-col md:flex-row gap-6">
        
//         {/* FEATURED ARTICLE */}
//         {featured && (
//           <article className="w-full md:w-1/2">
//             <Link href={`/articles/${featured.slug}`}>
//               <div className="w-full overflow-hidden rounded">
//                 <Image
//                   src={featured.featuredImage?.url}
//                   alt={featured.title}
//                   width={800}
//                   height={500}
//                   className="w-full h-auto object-cover"
//                 />
//               </div>
//             </Link>

//             <h3 className="mt-3 text-base md:text-lg font-semibold leading-snug">
//               <Link href={`/articles/${featured.slug}`}>
//                 {featured.title}
//               </Link>
//             </h3>
//           </article>
//         )}

//         {/* SMALL ARTICLES */}
//         <div className="w-full md:w-1/2 flex flex-col gap-4">
//           {smallArticles.map((article) => (
//             <article key={article.id} className="flex gap-3">
              
//               <Link href={`/articles/${article.slug}`}>
//                 <div className="w-24 h-16 flex-shrink-0 overflow-hidden rounded">
//                   <Image
//                     src={article.featuredImage?.url}
//                     alt={article.title}
//                     width={150}
//                     height={100}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//               </Link>

//               <h3 className="text-sm md:text-base font-medium leading-snug">
//                 <Link href={`/articles/${article.slug}`}>
//                   {article.title}
//                 </Link>
//               </h3>
//             </article>
//           ))}
//         </div>

//       </div>
//     </div>
//   </section>
// )

// }


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

  if (!res.docs.length) return null

  const [featured, ...sideArticles] = res.docs

  return (
    <div className="category-block sports-two-col">
      
      {/* Header */}
      <div className="section-header-line">
        <h2 className="section-heading">
          {title}
        </h2>
      </div>

      <div className="sports-layout">
        
        {/* LEFT COLUMN (Featured Article) */}
        <div className="sports-left">
          {featured && (
            <article className="sports-feature-post">
              <div className="thumbnail-container">
                <Link href={`/articles/${featured.slug}`}>
                  {featured.featuredImage?.url && (
                    <Image
                      src={featured.featuredImage.url}
                      alt={featured.title}
                      width={350}
                      height={230}
                    />
                  )}
                </Link>
              </div>

              <h3>
                <Link href={`/articles/${featured.slug}`}>
                  {featured.title}
                </Link>
              </h3>
            </article>
          )}
        </div>

        {/* RIGHT COLUMN (Side Articles) */}
        <div className="sports-right">
          {sideArticles.map((article) => (
            <article
              key={article.id}
              className="sports-side-post"
            >
              <div className="thumbnail-container">
                <Link href={`/articles/${article.slug}`}>
                  {article.featuredImage?.url && (
                    <Image
                      src={article.featuredImage.url}
                      alt={article.title}
                      width={120}
                      height={80}
                    />
                  )}
                </Link>
              </div>

              <h4>
                <Link href={`/articles/${article.slug}`}>
                  {article.title}
                </Link>
              </h4>
            </article>
          ))}
        </div>

      </div>
    </div>
  )
}
