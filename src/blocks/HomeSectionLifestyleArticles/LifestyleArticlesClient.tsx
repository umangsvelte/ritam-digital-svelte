'use client'

import { useState } from 'react'
import Link from 'next/link'

type Props = {
  title: string
  categoryId: string
  initialArticles: any[]
  totalDocs: number
  initialLimit: number
  showLoadMore: boolean
}

export default function LifestyleArticlesClient({
  title,
  categoryId,
  initialArticles,
  totalDocs,
  initialLimit,
  showLoadMore,
}: Props) {
  const [articles, setArticles] = useState(initialArticles)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  const hasMore = articles.length < totalDocs

  const loadMore = async () => {
    setLoading(true)

    const res = await fetch(
    //   `/api/articles?category=${categoryId}&page=${page + 1}&limit=${initialLimit}`
    `/api/load-articles?category=${categoryId}&page=${page + 1}&limit=${initialLimit}`

    )

    const data = await res.json()

    setArticles(prev => [...prev, ...data.docs])
    setPage(prev => prev + 1)
    setLoading(false)
  }

  return (
    <section className="content-section mx-auto px-4 py-6 ">
      <div className="section-header">
        <h2 className="section-title">
          <Link href="#">{title}</Link>
        </h2>
      </div>

      <div className="article-grid">
        {articles.map(article => (
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
                  {article.articleType?.name}
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

      {showLoadMore && hasMore && (
        <div className="text-center mt-[30px]">
          <button
            onClick={loadMore}
            disabled={loading}
            className="jeg_block_loadmore inline-block px-[30px] py-[12px] bg-[#f1811d] text-white font-semibold uppercase rounded transition"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </section>
  )
}
