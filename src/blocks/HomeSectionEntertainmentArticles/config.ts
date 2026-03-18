import { Block } from 'payload'

export const EntertainmentArticlesBlock: Block = {
  slug: 'entertainmentArticles',
  labels: {
    singular: 'Entertainment Articles',
    plural: 'Entertainment Articles',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Entertainment',
    },
    {
      name: 'articleCategory',
      type: 'relationship',
      relationTo: 'articleCategories',
      required: true,
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 3,
    },
  ],
}
