import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const migrate = async () => {
  try {
    const payload = await getPayload({ config })

    console.log('Starting migration...')

    const articles = await payload.find({
      collection: 'articles',
      limit: 1000, // adjust if needed
      depth: 0,
    })

    const isContentEmpty = (content: any) => {
        if (!content?.root?.children) return true

        // Check if all nodes are empty
        return content.root.children.every((node: any) => {
            if (!node.children || node.children.length === 0) return true

            return node.children.every((child: any) => {
            return !child.text || child.text.trim() === ''
            })
        })
    }

    for (const article of articles.docs) {
        const contentEmpty = isContentEmpty(article.content)

        if (contentEmpty && article.excerpt) {
            console.log(`Migrating article: ${article.id}`)

            await payload.update({
            collection: 'articles',
            id: article.id,
            data: {
                content: article.excerpt,
            },
            overrideAccess: true,
            validate: false,
            })
        }
    }

    console.log('Migration completed successfully ✅')
    process.exit(0)
  } catch (err) {
    console.error('Migration failed ❌', err)
    process.exit(1)
  }
}

migrate()