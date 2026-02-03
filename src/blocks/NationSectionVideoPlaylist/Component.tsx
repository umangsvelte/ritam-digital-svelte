import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getYoutubeId } from '@/utils/getYoutubeId'
import '../css/nation-page.css'
import VideoPlaylistClient from './VideoPlaylistClient'

type Props = {
  articleCategory: string
  limit: number
}

export const VideoPlaylistComponent = async ({
  articleCategory,
  limit,
}: Props) => {
  const payload = await getPayload({
    config: configPromise,
  })

  const categoryId = typeof articleCategory === 'object' ? articleCategory.id : articleCategory

  const { docs } = await payload.find({
    collection: 'articles',
    where: {
      and: [
        {
          articleType: {
            equals: categoryId,
          },
        },
        {
          mediaType: {
            equals: 'video',
          },
        },
        {
          views: {
            equals: 0,
          },
        },
      ],
    },
    sort: '-publishedDate',
    limit,
  })


// const articles = docs
//     .map(article => ({
//       ...article,
//       youtubeVideoId: getYoutubeId(article.featuredVideoUrl),
//     }))
//     .filter(article => article.youtubeVideoId)
const articles = docs
  .map(article => ({
    ...article,
    youtubeVideoId: getYoutubeId(article.featuredVideoUrl),
    publishedDateFormatted: new Date(article.publishedDate).toLocaleDateString(
      'en-IN',
      { day: '2-digit', month: 'short', year: 'numeric' }
    ),
  }))
  .filter(article => article.youtubeVideoId)

  if (!articles.length) return null

  const mainVideo = articles[0]

  return (
    <VideoPlaylistClient
    articles={articles}
    categoryName={
      typeof articles[0].articleType === 'object'
        ? articles[0].articleType.name
        : ''
    }
  />
  )
}
