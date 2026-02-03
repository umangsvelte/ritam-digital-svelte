import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(req: Request) {
  try {
    const { slug } = await req.json()
    
    if (!slug || typeof slug !== 'string') {
      return new Response(JSON.stringify({ message: 'Invalid slug provided' }), { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })


    // First, get the current view count
    const { docs } = await payload.find({
      collection: 'articles',
      where: { slug: { equals: slug } },
      limit: 1,
    })

    const article = docs[0]
    if (!article) {
      return new Response(JSON.stringify({ message: 'Article not found' }), { status: 404 })
    }

    const currentViews = typeof article.views === 'number' ? article.views : 0
    const newViews = currentViews + 1


    // Update using WHERE clause with slug - no ID needed!
    const result = await payload.update({
      collection: 'articles',
      where: { 
        slug: { 
          equals: slug 
        } 
      },
      data: { 
        views: newViews 
      },
      overrideAccess: true,
    })

    return new Response(JSON.stringify({ 
      message: 'Views incremented', 
      views: newViews 
    }), { 
      status: 200 
    })

  } catch (error: any) {
    console.error('Error in POST /api/increment-view:', error)
    return new Response(JSON.stringify({ 
      message: 'Failed to increment views',
      error: error.message 
    }), { 
      status: 500 
    })
  }
}