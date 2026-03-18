// 'use client'

// import { useState } from 'react'
// import Link from 'next/link'

// type Section = {
//   categoryId: string
//   categoryName: string
//   mediaType?: 'image' | 'video'
//   initialArticles: any[]
//   totalDocs: number
//   limit: number
//   enableLoadMore: boolean
// }

// type Props = {
//   title: string
//   sections: Section[]
// }

// export default function LifestyleArticlesClient({
//   title,
//   sections,
// }: Props) {
  
//   const [state, setState] = useState(
//     sections.map(section => ({
//       ...section,
//       articles: section.initialArticles,
//       page: 1,
//       loading: false,
//     }))
//   )

//   const loadMore = async (index: number) => {
//     setState(prev =>
//       prev.map((s, i) =>
//         i === index ? { ...s, loading: true } : s
//       )
//     )

//     const section = state[index]

//     const params = new URLSearchParams({
//       category: section.categoryId,
//       page: String(section.page + 1),
//       limit: String(section.limit),
//     })

//     if (section.mediaType) {
//       params.append('mediaType', section.mediaType)
//     }

//     const res = await fetch(`/api/load-articles?${params}`)
//     const data = await res.json()

//     setState(prev =>
//       prev.map((s, i) =>
//         i === index
//           ? {
//               ...s,
//               articles: [...s.articles, ...data.docs],
//               page: s.page + 1,
//               loading: false,
//             }
//           : s
//       )
//     )
//   }


//   return (
//     <section className="content-section mx-auto px-4 py-6">
//       <div className="section-header mb-6">
//         <h2 className="section-title">{title}</h2>
//       </div>

//       {state.map((section, index) => {
//         const hasMore = section.enableLoadMore && section.articles.length < section.totalDocs

//         return (
//           <div key={section.categoryId}>
//             {/* <h3 className="text-lg font-bold mb-4 uppercase">
//               {section.categoryName}
//             </h3> */}

//             {section.articles.length === 0 && !section.loading && (
//               <div className="text-center py-8 text-gray-500 text-sm uppercase">
//                 No articles found
//               </div>
//             )}

//             {section.articles.length > 0 && (
//               <div className="article-grid">
//                 {section.articles.map(article => (
                  
//                   <article key={article.id} className="article-card">
//                     <Link href={`/articles/${article.slug}`}>
//                     <div
//                       className="article-card-image"
//                       style={{
//                         backgroundImage: `url(${
//                           article.featuredImage?.url ||
//                           article.videoThumbnail?.url ||
//                           ''
//                         })`,
//                       }}
//                     >
//                       {article.articleType && (
//                         <span className="article-card-category">
//                           {article.articleType.name}
//                         </span>
//                       )}

//                       {/* ▶ Play icon only for video */}
//                       {article.mediaType === 'video' && (
//                         <span className="article-card-play">
//                           <i className="fa fa-play" />
//                         </span>
//                       )}
//                     </div>

//                     <div className="article-card-content">
//                       <h3 className="article-card-headline">
//                         {/* <Link href={`/articles/${article.slug}`}> */}
//                           {article.title}
//                         {/* </Link> */}
//                       </h3>
//                     </div>
//                     </Link>
//                   </article>
                  
//                 ))}
//               </div>
//             )}

//             {hasMore && (
//               <div className="text-center mt-6">
//                 <button
//                   onClick={() => loadMore(index)}
//                   disabled={section.loading}
//                   className="jeg_block_loadmore inline-block px-[30px] py-[12px] bg-[#f1811d] text-white font-semibold uppercase rounded transition"
//                 >
//                   {section.loading ? 'Loading...' : 'Load More'}
//                 </button>
//               </div>
//             )}
//           </div>
//         )
//       })}
//     </section>
//   )
// }

'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

type Section = {
  categoryId: string
  categoryName: string
  mediaType?: 'image' | 'video'
  initialArticles: any[]
  totalDocs: number
  limit: number
  enableLoadMore: boolean
  categorySlug: string
}

type Props = {
  title: string
  sections: Section[]
}

export default function LifestyleArticlesClient({ title, sections }: Props) {
  const [state, setState] = useState(
    sections.map(section => ({
      ...section,
      articles: section.initialArticles,
      page: 1,
      loading: false,
    }))
  )

  const observerRefs = useRef<(HTMLDivElement | null)[]>([])
  const loadingRef = useRef<boolean[]>([])
  const stateRef = useRef(state) // ✅ always up-to-date state

  // ✅ Keep stateRef in sync with state
  useEffect(() => {
    stateRef.current = state
  }, [state])

  const loadMore = async (index: number) => {
    const section = stateRef.current[index] // ✅ read from ref, not closure

    if (loadingRef.current[index]) return
    if (section.articles.length >= section.totalDocs) return

    loadingRef.current[index] = true

    setState(prev => prev.map((s, i) => (i === index ? { ...s, loading: true } : s)))

    try {
      const lastItem = section.articles[section.articles.length - 1]

      const params = new URLSearchParams({
        category: section.categoryId,
        limit: String(section.limit),
        lastDate: lastItem?.publishedDate,
        lastId: lastItem?.id,
      })

      if (section.mediaType) {
        params.append('mediaType', section.mediaType)
      }

      const res = await fetch(`/api/load-articles?${params}`)
      const data = await res.json()

      setState(prev =>
        prev.map((s, i) => {
          if (i !== index) return s
          return {
            ...s,
            articles: [...s.articles, ...data.docs],
            loading: false,
          }
        })
      )
    } catch (err) {
      console.error(err)
      setState(prev => prev.map((s, i) => (i === index ? { ...s, loading: false } : s)))
    } finally {
      loadingRef.current[index] = false
    }
  }

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    state.forEach((section, index) => {
      if (!section.enableLoadMore) return

      const el = observerRefs.current[index]
      if (!el) return

      const observer = new IntersectionObserver(
        entries => {
          const current = stateRef.current[index] // ✅ always fresh state

          if (
            entries[0].isIntersecting &&
            !loadingRef.current[index] &&
            current.articles.length < current.totalDocs
          ) {
            loadMore(index)
          }
        },
        {
          rootMargin: '100px',
          threshold: 0.1,
        }
      )

      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach(o => o.disconnect())
  }, [state.length]) // ✅ still stable — only re-runs if number of sections changes

  return (
    <section className="lifestyle-section py-6">
      <div className="section-header-line">
        <h2 className="section-heading">{title}</h2>
      </div>

      {state.map((section, index) => {
        const hasMore =
          section.enableLoadMore && section.articles.length < section.totalDocs

        return (
          <div key={section.categoryId}>
            {!section.articles || section.articles.length === 0 ? (
              <div className="text-center py-10">
                <p>No articles found</p>
              </div>
            ) : (
              <>
                <div className="lifestyle-grid">
                  {section.articles.map(article => {
                    const url =
                      article.mediaType === 'image'
                        ? `/articles/${section.categorySlug}/${article.slug}`
                        : `/videos/${section.categorySlug}/${article.slug}`

                    const imageObj =
                      article.featuredImage &&
                      typeof article.featuredImage === 'object'
                        ? article.featuredImage
                        : article.videoThumbnail &&
                          typeof article.videoThumbnail === 'object'
                        ? article.videoThumbnail
                        : null

                    return (
                      <article key={article.id} className="lifestyle-item">
                        <div className="thumbnail-container relative">
                          <Link href={url}>
                            {imageObj?.url && (
                              <div className="relative">
                                <Image
                                  src={imageObj.url}
                                  alt={article.title || 'Thumbnail'}
                                  width={350}
                                  height={230}
                                />
                                {article.mediaType === 'video' && (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-black/60 rounded-full p-3">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        fill="white"
                                        viewBox="0 0 24 24"
                                      >
                                        <path d="M8 5v14l11-7z" />
                                      </svg>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </Link>
                        </div>
                        <h3>
                          <Link href={url}>{article.title}</Link>
                        </h3>
                      </article>
                    )
                  })}
                </div>

                {hasMore && (
                  <div ref={el => (observerRefs.current[index] = el)} className="h-10" />
                )}

                {section.loading && (
                  <div className="text-center py-4">
                    <div className="inline-block px-6 py-2 bg-[#ef7f1b] text-white font-semibold rounded-md shadow">
                      Loading...
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )
      })}
    </section>
  )
}