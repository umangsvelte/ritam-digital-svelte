// import { NextResponse } from 'next/server'
// import { getPayload } from 'payload'
// import configPromise from '@payload-config'

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url)

//   const category = searchParams.get('category')
//   const page = Number(searchParams.get('page') || 1)
//   const limit = Number(searchParams.get('limit') || 3)

//   const payload = await getPayload({ config: configPromise })

//   const data = await payload.find({
//     collection: 'articles',
//     where: {
//       articleType: {
//         equals: category,
//       },
//     },
//     sort: '-publishedDate',
//     page,
//     limit,
//   })

//   return NextResponse.json(data)
// }


import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const category = searchParams.get('category')
  const mediaType = searchParams.get('mediaType') // optional
  const page = Number(searchParams.get('page') || 1)
  const limit = Number(searchParams.get('limit') || 9)

  if (!category) {
    return NextResponse.json({ docs: [], totalDocs: 0 })
  }

  const payload = await getPayload({ config: configPromise })

  const andConditions: any[] = [
    {
      articleType: {
        equals: category,
      },
    },
  ]

  if (mediaType) {
    andConditions.push({
      mediaType: {
        equals: mediaType,
      },
    })
  }

  const result = await payload.find({
    collection: 'articles',
    where: {
      and: andConditions,
    },
    page,
    limit,
    sort: '-publishedDate',
  })

  return NextResponse.json(result)
}
