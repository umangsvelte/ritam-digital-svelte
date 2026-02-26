import type { TaskConfig } from 'payload'

export const publishScheduledArticlesTask: TaskConfig = {
  slug: 'publishScheduledArticles',

  retries: 3,
  workflow: false,

  schedule: [
    {
      cron: '* * * * *',
      queue: 'scheduler',
    },
  ],

  inputSchema: [],

  handler: async ({ req }) => {
    const { payload } = req

    console.log('🕒 Scheduler running:', new Date().toISOString())

    const now = new Date()

    const articles = await payload.find({
      collection: 'articles',
      where: {
        and: [
          { _status: { equals: 'draft' } },
          { scheduledRelease: { less_than_equal: now } },
        ],
      },
      limit: 100,
    })

    for (const article of articles.docs) {
      await payload.update({
        collection: 'articles',
        id: article.id,
        data: {
          _status: 'published',
          scheduledRelease: null,
        },
      })

      console.log(`✅ Published: ${article.id}`)
    }
    return { output: {} }
  },
}
