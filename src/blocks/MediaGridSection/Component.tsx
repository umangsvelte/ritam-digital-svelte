// import { getPayload } from 'payload'
// import config from '@payload-config'
// import { getTopVideos } from '@/lib/getTopVideos'
// import VideoPlaylist from './VideoPlaylist'
// import ArticleItem from './ArticleItem'
// // import '../css/home-page.css'

// export default async function MediaGridSection({
//   rightArticleCategory,
//   rightArticleLimit,
// }) {
//   const payload = await getPayload({ config })

//   // LEFT: Top videos
//   const videos = await getTopVideos()

//   // RIGHT: Auto-fetch articles by category
//   const rightArticlesRes = await payload.find({
//     collection: 'articles',
//     where: {
//       articleType: {
//         equals:
//           typeof rightArticleCategory === 'object'
//             ? rightArticleCategory.id
//             : rightArticleCategory,
//       },
//       mediaType: {
//         equals: 'image',
//         },
//     },
//     sort: '-publishedDate',
//     limit: rightArticleLimit ?? 8,
//   })

//   return (
//     <section className="mx-auto px-4 py-6 relative z-0">
//       <div className="videos-nation-wrapper flex flex-col lg:flex-row gap-8">

//         {/* LEFT – fixed 33% */}
//         <VideoPlaylist videos={videos} />

//         {/* RIGHT – auto takes remaining width */}
//         <div className="nation-column">
//             <ArticleItem articles={rightArticlesRes.docs} articleCategory={rightArticleCategory.name} />
//         </div>

//       </div>
//     </section>
//   )
// }


import { getPayload } from 'payload'
import config from '@payload-config'
import { getTopVideos } from '@/lib/getTopVideos'
import VideoPlaylist from './VideoPlaylist'
import ArticleItem from './ArticleItem'

export default async function MediaGridSection({
  rightArticleCategory,
  rightArticleLimit,
}) {
  const payload = await getPayload({ config })

  const videos = await getTopVideos()

  const rightArticlesRes = await payload.find({
    collection: 'articles',
    where: {
      articleType: {
        equals:
          typeof rightArticleCategory === 'object'
            ? rightArticleCategory?.id
            : rightArticleCategory,
      },
      mediaType: {
        equals: 'image',
      },
      _status: {
        equals: 'published',
      },
    },
    sort: '-publishedDate',
    limit: rightArticleLimit ?? 8,
  })

  return (
    <section className="">
      <div className="videos-nation-section">

        {/* LEFT */}
        <VideoPlaylist videos={videos} />

        {/* RIGHT */}
        <div className="nation-column">
          <ArticleItem
            articles={rightArticlesRes.docs}
            articleCategory={
              typeof rightArticleCategory === 'object'
                ? rightArticleCategory.name
                : ''
            }
          />
        </div>

      </div>
    </section>
  )
}
