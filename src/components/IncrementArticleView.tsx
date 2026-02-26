// 'use client'

// import { useEffect } from 'react'

// export default function IncrementArticleView({ slug }: { slug: string }) {
//   useEffect(() => {
//     fetch('/api/increment-view', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ slug }),
//     })
//   }, [slug])

//   return null
// }

'use client'

import { useEffect } from 'react'

export default function IncrementArticleView({ 
  slug,
  isPreview,
}: { 
  slug: string
  isPreview: boolean
}) {

  useEffect(() => {
    // Do NOT increment in preview mode
    if (isPreview) return
    

    fetch('/api/increment-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    })
  }, [slug, isPreview])

  return null
}