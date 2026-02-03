import type { Block } from 'payload'

export const PoliticsArticlesBlock: Block = {
  slug: 'politicsArticles',
  labels: {
    singular: 'Politics Articles',
    plural: 'Politics Articles',
  },
  fields: [
    {
      name: 'title',
      label: 'Section Title',
      type: 'text',
      defaultValue: 'Politics',
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
      label: 'Total Articles',
      type: 'number',
      defaultValue: 10,
      min: 2,
      max: 20,
    },
  ],
}
