'use client'

import { useState } from 'react'
import Link from 'next/link'

type Section = {
  categoryId: string
  categoryName: string
  mediaType?: 'image' | 'video'
  initialArticles: any[]
  totalDocs: number
  limit: number
  enableLoadMore: boolean
}

type Props = {
  title: string
  sections: Section[]
}

export default function LifestyleArticlesClient({
  title,
  sections,
}: Props) {
  
  const [state, setState] = useState(
    sections.map(section => ({
      ...section,
      articles: section.initialArticles,
      page: 1,
      loading: false,
    }))
  )

  const loadMore = async (index: number) => {
    setState(prev =>
      prev.map((s, i) =>
        i === index ? { ...s, loading: true } : s
      )
    )

    const section = state[index]

    const params = new URLSearchParams({
      category: section.categoryId,
      page: String(section.page + 1),
      limit: String(section.limit),
    })

    if (section.mediaType) {
      params.append('mediaType', section.mediaType)
    }

    const res = await fetch(`/api/load-articles?${params}`)
    const data = await res.json()

    setState(prev =>
      prev.map((s, i) =>
        i === index
          ? {
              ...s,
              articles: [...s.articles, ...data.docs],
              page: s.page + 1,
              loading: false,
            }
          : s
      )
    )
  }


  return (
    <section className="content-section mx-auto px-4 py-6">
      <div className="section-header mb-6">
        <h2 className="section-title">{title}</h2>
      </div>

      {state.map((section, index) => {
        const hasMore = section.enableLoadMore && section.articles.length < section.totalDocs

        return (
          <div key={section.categoryId}>
            {/* <h3 className="text-lg font-bold mb-4 uppercase">
              {section.categoryName}
            </h3> */}

            {section.articles.length === 0 && !section.loading && (
              <div className="text-center py-8 text-gray-500 text-sm uppercase">
                No articles found
              </div>
            )}

            {section.articles.length > 0 && (
              <div className="article-grid">
                {section.articles.map(article => (
                  <article key={article.id} className="article-card">
                    <div
                      className="article-card-image"
                      style={{
                        backgroundImage: `url(${
                          article.featuredImage?.url ||
                          article.videoThumbnail?.url ||
                          ''
                        })`,
                      }}
                    >
                      {article.articleType && (
                        <span className="article-card-category">
                          {article.articleType.name}
                        </span>
                      )}
                    </div>

                    <div className="article-card-content">
                      <h3 className="article-card-headline">
                        <Link href={`/articles/${article.slug}`}>
                          {article.title}
                        </Link>
                      </h3>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {hasMore && (
              <div className="text-center mt-6">
                <button
                  onClick={() => loadMore(index)}
                  disabled={section.loading}
                  className="jeg_block_loadmore inline-block px-[30px] py-[12px] bg-[#f1811d] text-white font-semibold uppercase rounded transition"
                >
                  {section.loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </div>
        )
      })}
    </section>
  )
}
