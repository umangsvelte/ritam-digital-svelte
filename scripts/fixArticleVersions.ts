import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'


async function run() {
    const payload = await getPayload({ config })
//   await payload.init({
//     secret: process.env.PAYLOAD_SECRET as string,
//     local: true,
//   })

  const articles = await payload.find({
    collection: 'articles',
    limit: 1000,
  })

  console.log(`Found ${articles.docs.length} articles`)

  for (const article of articles.docs) {
    await payload.update({
      collection: 'articles',
      id: article.id,
      data: {
        title: article.title, // force update
      },
      draft: false, // ensures published version is created
    })

    console.log(`Fixed article ${article.id}`)
  }

  console.log('✅ Done regenerating versions')
  process.exit(0)
}

run()
