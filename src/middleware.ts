import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl


  const match = pathname.match(/^\/\d{4}\/\d{2}\/\d{2}\/\d+\/(.+)/)


  if (match) {
    const remaining = match[1]

    const segments = remaining.split('/').filter(Boolean)

    const category = segments[0]
    const slug = segments[segments.length - 1]
    const subcategory = segments.length === 3 ? segments[1] : null

    let redirectPath = ''

    if (category === 'videos') {
      redirectPath = subcategory
        ? `/videos/${subcategory}/${slug}`
        : `/videos/uncategory/${slug}`
    } else {
      redirectPath = subcategory
        ? `/articles/${category}/${subcategory}/${slug}`
        : `/articles/${category}/${slug}`
    }

    return NextResponse.redirect(new URL(redirectPath, request.url), 301)
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/:path*',
}