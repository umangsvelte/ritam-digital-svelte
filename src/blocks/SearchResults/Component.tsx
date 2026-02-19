'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { extractTextFromRichText } from '@/utils/extractRichText'

type Props = {
  title?: string
  limit?: number
}

export default function SearchResultsBlock({
  title = 'Search Result',
  limit = 10,
}: Props) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get('q') || ''

  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  
//   const [hasMore, setHasMore] = useState(false)
  const [searchValue, setSearchValue] = useState(query)

  /* Fetch search results */
//   useEffect(() => {
//     if (!query) return

//     const fetchResults = async () => {
//       setLoading(true)
//       console.log(limit)

//       const res = await fetch(
//         `/api/search/articles?q=${query}&page=${page}&limit=${limit}`
//       )
//       const data = await res.json()
//       console.log(data)

//       setResults(prev =>
//         page === 1 ? data.docs : [...prev, ...data.docs]
//       )
//       setHasMore(data.totalDocs > page * limit)
//       setLoading(false)
//     }

//     fetchResults()
//   }, [query, page, limit])

    useEffect(() => {
    if (!query) return

    const fetchResults = async () => {
        setLoading(true)

        const res = await fetch(
        `/api/search/articles?q=${query}&page=${page}&limit=${limit}`
        )
        const data = await res.json()

        setResults(data.docs)
        setTotalPages(data.totalPages)
        setLoading(false)
    }

    fetchResults()
    }, [query, page, limit])

  if (!query) return null

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchValue.trim().length < 3) return
    setPage(1)
    router.push(`/search-results?q=${encodeURIComponent(searchValue)}`)
  }

  return (
    <section className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-4">
          {title} for '<span className="text-[#ef7f1b]">{query}</span>'
        </h1>

        {/* Search box */}
        <form
          onSubmit={onSearchSubmit}
          className="flex border border-gray-300 max-w-xl"
        >
          <input
            type="text"
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            placeholder="Search here..."
            className="flex-1 px-4 py-2 outline-none text-black"
          />
          <button
            type="submit"
            className="px-6 bg-[#ef7f1b] text-white font-semibold"
          >
            🔍
          </button>
        </form>
      </header>

      {/* No results */}
      {results.length === 0 && !loading && (
        <div className="py-12 text-gray-500">
          No results found
        </div>
      )}

      {/* Results list */}
      <div className="divide-y divide-gray-200">
        {results.map(item => {
          const image =
            item.mediaType === 'image'
              ? item.featuredImage?.url
              : item.videoThumbnail?.url

          return (
            <article
              key={item.id}
              className="flex gap-6 py-6"
            >
              {/* Image */}
              {image && (
                <Link
                  href={`/articles/${item.slug}`}
                  className="relative w-[260px] shrink-0"
                >
                  <img
                    src={image}
                    alt={item.title}
                    className="w-full h-[160px] object-cover"
                  />

                  {item.mediaType === 'video' && (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="white"
                        className="w-14 h-14"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  )}
                </Link>
              )}

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-xl font-semibold leading-snug">
                  <Link
                    href={`/articles/${item.slug}`}
                    className="hover:text-[#ef7f1b]"
                  >
                    {item.title}
                  </Link>
                </h3>

                {/* {item.excerpt?.root && (
                  <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                    {
                      item.excerpt.root.children?.[0]?.children?.[0]?.text
                    }
                  </p>
                )} */}
                {item.excerpt && typeof item.excerpt === 'object' && 'root' in item.excerpt && (
                    <p className= 'line-clamp-2'>
                      {extractTextFromRichText(item.excerpt)}
                    </p>
                  )}
              </div>
            </article>
          )
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10 flex-wrap">
            {Array.from({ length: totalPages }).map((_, i) => {
            const pageNumber = i + 1
            return (
                <button
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                className={`px-4 py-2 border text-sm font-semibold
                    ${
                    page === pageNumber
                        ? 'bg-[#ef7f1b] text-white border-[#ef7f1b]'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                    }`}
                >
                {pageNumber}
                </button>
            )
            })}
        </div>
)}

    </section>
  )
}
