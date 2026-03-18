import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { RenderBlocks } from '@/blocks/RenderBlocks'

export default async function CategoryPage({ params }: any) {

  const { category } = await params
  const payload = await getPayload({ config: configPromise })

  const pageRes = await payload.find({
    collection: 'pages',
    where: {
      slug: { equals: category },
    },
    depth: 3,
    limit: 1,
  })

  const page = pageRes.docs[0]

  if (!page) return notFound()

  return (
    <div className="container">
      <RenderBlocks blocks={page.layout} categorySlug={category} />
    </div>
  )
}