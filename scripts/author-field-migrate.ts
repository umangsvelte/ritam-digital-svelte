import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

async function migrateAuthors() {
  const payload = await getPayload({ config })

  // Get admin user
  const adminUser = await payload.find({
    collection: 'users',
    where: {
      role: {
        equals: 'admin',
      },
    },
    limit: 1,
  })

  if (!adminUser.docs.length) {
    console.log('❌ No admin user found')
    process.exit(1)
  }

  const adminId = adminUser.docs[0].id

  const articles = await payload.find({
    collection: 'articles',
    limit: 1000,
  })

  for (const article of articles.docs) {
    await payload.update({
      collection: 'articles',
      id: article.id,
      data: {
        author: adminId,
      },
    })

    console.log(`✅ Assigned admin to: ${article.title}`)
  }

  console.log('🎉 Migration completed')
  process.exit(0)
}

migrateAuthors()
