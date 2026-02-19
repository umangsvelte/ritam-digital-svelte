import Image from 'next/image'
import Link from 'next/link'
// import '../css/home-page.css'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

type Props = {
  title: string
  mediaType: 'image' | 'video' | 'all'
}

export default async function TopNewsComponent({
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
  
    const {docs: articles} = await payload.find({
      collection: 'articles',
      sort: ['-views', '-publishedDate'],
      limit: 7,
      where: {
        mediaType: { equals: 'image' }, // optional
      },
    })

    if (!articles?.length) return null

  return (
    <aside className="sidebar-section">
        <div className="section-header-line">
            <h2 className="section-heading">
            Top News
            </h2>
        </div>

        <div className="sidebar-news-list">
            {articles.map((article) => (
            <article className="sidebar-article" key={article.id}>
                <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className="d-flex align-items-center gap-3"
                >
                <div className="thumbnail-container">
                    <Image
                    src={article.featuredImage?.url}
                    alt={article.title}
                    fill
                    className="object-cover"
                    />
                </div>

                <h3 className="article-title">
                    {article.title}
                </h3>
                </Link>
            </article>
            ))}
        </div>
    </aside>

  )
}
