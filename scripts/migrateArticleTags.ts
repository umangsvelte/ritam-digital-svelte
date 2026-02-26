import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'


async function run() {
  const payload = await getPayload({ config })

  const articles = await payload.find({
    collection: 'articles',
    limit: 1000,
    depth: 0,
  })

  for (const article of articles.docs) {
    if (!article.tags?.length) continue

    const tagIDs: string[] = []

    for (const tagObj of article.tags) {
      const tagName = tagObj.tag?.trim()
      if (!tagName) continue

      // Check if tag already exists
      const existing = await payload.find({
        collection: 'articleTags',
        where: {
          name: { equals: tagName },
        },
      })

      let tagID:any

      if (existing.docs.length) {
        tagID = existing.docs[0].id
      } else {
        const newTag = await payload.create({
          collection: 'articleTags',
          data: {
            name: tagName,
            // slug: tagName.toLowerCase().replace(/\s+/g, '-'),
          },
        })
        tagID = newTag.id
      }

      tagIDs.push(tagID)
    }

    // Save relationship IDs temporarily in a temp field
    await payload.update({
      collection: 'articles',
      id: article.id,
      data: {
        tagsRelationship: tagIDs,
      },
    })

    console.log(`Migrated article ${article.id}`)
  }

  console.log('✅ Migration completed')
  process.exit(0)
}

run()
