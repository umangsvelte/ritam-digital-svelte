// import { NextResponse } from 'next/server'
// import { getPayload } from 'payload'
// import configPromise from '@payload-config'

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url)

//   const category = searchParams.get('category')
//   const mediaType = searchParams.get('mediaType') // optional
//   const page = Number(searchParams.get('page') || 1)
//   const limit = Number(searchParams.get('limit') || 9)

//   if (!category) {
//     return NextResponse.json({ docs: [], totalDocs: 0 })
//   }

//   const payload = await getPayload({ config: configPromise })

//   const andConditions: any[] = [
//     {
//       articleType: {
//         equals: category,
//       },
//     },
//   ]

//   if (mediaType) {
//     andConditions.push({
//       mediaType: {
//         equals: mediaType,
//       },
//     })
//   }

//   const result = await payload.find({
//     collection: 'articles',
//     where: {
//       and: andConditions,
//     },
//     page,
//     limit,
//     sort: '-publishedDate',
//   })

//   return NextResponse.json(result)
// }
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const payload = await getPayload({ config: configPromise })

  const { searchParams } = new URL(req.url)

  const category = searchParams.get('category')
  const limit = Number(searchParams.get('limit')) || 9
  const mediaType = searchParams.get('mediaType')
  const lastDate = searchParams.get('lastDate')
  const lastId = searchParams.get('lastId')

  const where: any = {
    and: [
      {
        articleType: { equals: category },
        _status: { equals: 'published' },
      },
    ],
  }

  if (mediaType) {
    where.and.push({ mediaType: { equals: mediaType } })
  }

  // ✅ cursor condition
  if (lastDate && lastId) {
    where.and.push({
      or: [
        {
          publishedDate: { less_than: lastDate },
        },
        {
          and: [
            { publishedDate: { equals: lastDate } },
            { id: { less_than: lastId } },
          ],
        },
      ],
    })
  }

  const result = await payload.find({
    collection: 'articles',
    where,
    sort: ['-publishedDate', '-id'],
    limit,
  })

  return NextResponse.json(result)
}