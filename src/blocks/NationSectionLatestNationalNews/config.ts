import type { Block } from 'payload'

export const LatestNationalNewsBlock: Block = {
  slug: 'latestNationalNews',
  labels: {
    singular: 'Latest National News',
    plural: 'Latest National News Blocks',
  },
  fields: [
    {
      name: 'title',
      label: 'Block Title',
      type: 'text',
      required: true,
      defaultValue: 'Latest National News',
    },
    {
      name: 'category',
      label: 'Article Category',
      type: 'relationship',
      relationTo: 'articleCategories',
      required: true,
      admin: {
        description: 'Select article category (ID will be used internally)',
      },
    },
  ],
}
