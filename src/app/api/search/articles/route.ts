import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('q')

  if (!query || query.length < 3) {
    return NextResponse.json({ docs: [] })
  }

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'articles',
    limit: 10,
    where: {
      title: {
        like: query,
      },
    },
    depth: 1,
  })

  return NextResponse.json(result)
}
