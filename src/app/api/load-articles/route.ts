import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const category = searchParams.get('category')
  const page = Number(searchParams.get('page') || 1)
  const limit = Number(searchParams.get('limit') || 3)

  const payload = await getPayload({ config: configPromise })

  const data = await payload.find({
    collection: 'articles',
    where: {
      articleType: {
        equals: category,
      },
    },
    sort: '-publishedDate',
    page,
    limit,
  })

  return NextResponse.json(data)
}
