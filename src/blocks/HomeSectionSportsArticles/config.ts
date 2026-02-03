import type { Block } from 'payload'

export const SportsArticlesBlock: Block = {
  slug: 'sportsArticles',
  labels: {
    singular: 'Home Sports Articles',
    plural: 'Home Sports Articles',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Sports',
    },
    {
      name: 'articleCategory',
      label: 'Article Category',
      type: 'relationship',
      relationTo: 'articleCategories',
      required: true,
    },
    {
      name: 'limit',
      label: 'Articles Limit',
      type: 'number',
      defaultValue: 4,
      min: 2,
    },
  ],
}
