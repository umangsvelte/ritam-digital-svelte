import { getPayload } from 'payload'
import config from '@/payload.config'

export const getTopVideos = async () => {
  const payload = await getPayload({ config })

  const res = await payload.find({
    collection: 'articles',
    where: {
      mediaType: { equals: 'video' },
    },
    sort: '-views',
    limit: 10,
    depth: 1,
  })

  return res.docs
}
