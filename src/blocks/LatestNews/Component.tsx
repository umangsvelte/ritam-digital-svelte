import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import '../css/home-page.css'

type Props = {
  title: string
  mediaType: 'image' | 'video' | 'all'
}

export default async function LatestNewsComponent({
  title,
  mediaType,
}: Props) {
  const payload = await getPayload({ config: configPromise })

  const where: any = {}

  if (mediaType !== 'all') {
    where.mediaType = {
      equals: mediaType,
    }
  }

  const { docs: articles } = await payload.find({
    collection: 'articles',
    sort: '-publishedDate',
    limit: 10,
    where,
    depth: 1,
  })

  if (!articles?.length) return null

  return (
    <aside>
      <div className="mb-4 border-b-2 border-orange-500 pb-2">
        <h2 className="text-lg font-bold uppercase">
          {title}
        </h2>
      </div>

      <div className="space-y-4">
        {articles.map(article => (
          <Link
            key={article.id}
            href={`/articles/${article.slug}`}
            className="flex gap-3 items-start border-b pb-3 hover:opacity-90"
          >
            <div className="relative w-[100px] h-[80px] rounded overflow-hidden shrink-0">
              {article.featuredImage?.url && (
                <Image
                  src={article.featuredImage.url}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              )}
            </div>

            <h3 className="text-sm font-semibold leading-snug hover:text-orange-500">
              {article.title}
            </h3>
          </Link>
        ))}
      </div>
    </aside>
  )
}
