import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(req: Request) {
  try {
    const { slug } = await req.json()

    if (!slug || typeof slug !== 'string') {
      return new Response(JSON.stringify({ message: 'Invalid slug provided' }), { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })

    await payload.db.drizzle.execute(`
      UPDATE articles
      SET views = COALESCE(views, 0) + 1
      WHERE slug = '${slug}'
    `)

    return new Response(
      JSON.stringify({ message: 'Views incremented' }),
      { status: 200 }
    )

  } catch (error: any) {
    console.error(error)
    return new Response(
      JSON.stringify({ message: 'Failed to increment views' }),
      { status: 500 }
    )
  }
}