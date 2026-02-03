import { Block } from 'payload'

export const LifestyleArticlesBlock: Block = {
  slug: 'lifestyleArticles',
  labels: {
    singular: 'Lifestyle Articles Section',
    plural: 'Lifestyle Articles Sections',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Lifestyle',
    },
    {
      name: 'articleCategory',
      type: 'relationship',
      relationTo: 'articleCategories', // change if your category collection name is different
      required: true,
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 3,
      min: 1,
      max: 12,
    },
  ],
}
