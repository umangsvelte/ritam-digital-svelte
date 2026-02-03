import type { Block } from 'payload'

export const WorldArticlesBlock: Block = {
  slug: 'worldArticles',
  labels: {
    singular: 'World Articles',
    plural: 'World Articles',
  },
  fields: [
    {
      name: 'title',
      label: 'Section Title',
      type: 'text',
      defaultValue: 'World',
      required: true,
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
      label: 'Number of Articles',
      type: 'number',
      defaultValue: 4,
      min: 1,
      max: 10,
    },
  ],
}
