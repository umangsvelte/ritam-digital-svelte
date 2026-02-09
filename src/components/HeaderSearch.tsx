// 'use client'

// import { useEffect, useRef, useState } from 'react'
// import Link from 'next/link'

// export default function HeaderSearch({ onClose }: { onClose: () => void }) {
//   const [query, setQuery] = useState('')
//   const [results, setResults] = useState<any[]>([])
//   const [loading, setLoading] = useState(false)
//   const ref = useRef<HTMLDivElement>(null)

//   /* Close on outside click */
//   useEffect(() => {
//     const handler = (e: MouseEvent) => {
//       if (ref.current && !ref.current.contains(e.target as Node)) {
//         onClose()
//       }
//     }
//     document.addEventListener('mousedown', handler)
//     return () => document.removeEventListener('mousedown', handler)
//   }, [onClose])

//   /* Search logic */
//   useEffect(() => {
//     if (query.length < 3) {
//       setResults([])
//       return
//     }

//     const t = setTimeout(async () => {
//       setLoading(true)
//       const res = await fetch(`/api/search/articles?q=${query}`)
//       const data = await res.json()
//       setResults(data.docs || [])
//       setLoading(false)
//     }, 300)

//     return () => clearTimeout(t)
//   }, [query])

//   return (
//     <div className="header-search-dropdown" ref={ref}>
//       <input
//         type="text"
//         autoFocus
//         placeholder="Search news..."
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//       />

//       {loading && <div className="search-loading">Searching…</div>}

//       {results.length > 0 && (
//         <div className="search-results">
//           {results.map((item) => {
//             const img =
//               item.mediaType === 'image'
//                 ? item.featuredImage?.url
//                 : item.videoThumbnail?.url

//             return (
//               <Link
//                 key={item.id}
//                 href={`/articles/${item.slug}`}
//                 onClick={onClose}
//                 className="search-item"
//               >
//                 {img && <img src={img} alt="" />}
//                 <span>{item.title}</span>
//               </Link>
//             )
//           })}
//         </div>
//       )}
//     </div>
//   )
// }


'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function HeaderSearch({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  /* Close on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  /* Search logic */
  useEffect(() => {
    if (query.length < 3) {
      setResults([])
      return
    }

    const t = setTimeout(async () => {
      setLoading(true)
      const res = await fetch(`/api/search/articles?q=${query}`)
      const data = await res.json()
      setResults(data.docs || [])
      setLoading(false)
    }, 300)

    return () => clearTimeout(t)
  }, [query])

  const goToSearchPage = () => {
    onClose()
    router.push(`/search-results?q=${encodeURIComponent(query)}`)
  }

  return (
    <div className="header-search-dropdown" ref={ref}>
      <input
        type="text"
        autoFocus
        placeholder="Search news..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
      />

      {loading && <div className="search-loading">Searching…</div>}

      {results.length > 0 && (
        <div className="search-results">
          {results.map((item) => {
            const img =
              item.mediaType === 'image'
                ? item.featuredImage?.url
                : item.videoThumbnail?.url

            return (
              <Link
                key={item.id}
                href={`/articles/${item.slug}`}
                onClick={onClose}
                className="search-item"
              >
                {img && <img src={img} alt="" />}
                <span>{item.title}</span>
              </Link>
            )
          })}
        </div>
      )}

      {/* 🔹 VIEW ALL RESULTS */}
      {query.length >= 3 && results.length > 3 && !loading && (
        <button
          onClick={goToSearchPage}
          className="search-view-all"
        >
          View all search results →
        </button>
      )}
    </div>
  )
}
