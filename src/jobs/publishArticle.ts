import type { TaskConfig } from 'payload'

export const publishScheduledArticlesTask: TaskConfig<'publishScheduledArticles'> = {
  slug: 'publishScheduledArticles',
  
  // Define the schedule - this tells Payload when to QUEUE the job
  schedule: [
    {
      cron: '* * * * *', // Check every minute
      queue: 'scheduler',
    },
  ],

  handler: async ({ req }): Promise<void> => {
    const { payload } = req
    
    const now = new Date()
    
    // Find all draft articles with scheduleDate <= now
    const articles = await payload.find({
      collection: 'articles',
      where: {
        and: [
          {
            _status: {
              equals: 'draft',
            },
          },
          {
            scheduleDate: {
              less_than_equal: now.toISOString(),
            },
          },
        ],
      },
      limit: 100,
    })

    // Publish each scheduled article
    for (const article of articles.docs) {
      try {
        await payload.update({
          collection: 'articles',
          id: article.id,
          data: {
            _status: 'published',
            // Optionally clear the schedule date after publishing
            scheduleDate: null,
          },
        })

        // Log the scheduled publication
        await payload.create({
          collection: 'userLogs',
          data: {
            action: 'scheduled_publish',
            collection: 'articles',
            documentId: article.id,
            user: null,
            newData: {
              message: 'Article automatically published by scheduler',
              scheduledDate: article.scheduleDate,
            },
          },
        })

        console.log(`✅ Published scheduled article: ${article.id}`)
      } catch (error) {
        console.error(`❌ Failed to publish article ${article.id}:`, error)
      }
    }
  },
}