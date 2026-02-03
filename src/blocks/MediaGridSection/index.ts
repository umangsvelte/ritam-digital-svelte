import type { Block } from 'payload'

export const MediaGridSection: Block = {
  slug: 'mediaGridSection',
  labels: {
    singular: 'Media Grid Section',
    plural: 'Media Grid Sections',
  },
  fields: [
    // LEFT GRID TYPE
    {
      name: 'leftType',
      label: 'Left Grid Content Type',
      type: 'select',
      options: [
        { label: 'Top Videos', value: 'videos' },
        { label: 'Articles', value: 'articles' },
      ],
      defaultValue: 'videos',
      required: true,
    },

    // LEFT – ARTICLES (OPTIONAL)
    {
      name: 'leftArticleCategory',
      label: 'Left Grid Article Category',
      type: 'relationship',
      relationTo: 'articleCategories',
      admin: {
        condition: (_, siblingData) => siblingData.leftType === 'articles',
      },
    },

    {
      name: 'leftArticleLimit',
      label: 'Left Grid Article Count',
      type: 'number',
      defaultValue: 4,
      min: 1,
      max: 6,
      admin: {
        condition: (_, siblingData) => siblingData.leftType === 'articles',
      },
    },

    // RIGHT GRID – AUTO ARTICLES
    {
      name: 'rightArticleCategory',
      label: 'Right Grid Article Category',
      type: 'relationship',
      relationTo: 'articleCategories',
      required: true,
    },

    {
      name: 'rightArticleLimit',
      label: 'Right Grid Article Count',
      type: 'number',
      defaultValue: 8,
      min: 4,
      max: 10,
      required: true,
    },

    {
      name: 'sortBy',
      label: 'Sort Articles By',
      type: 'select',
      defaultValue: 'publishedDate',
      options: [
        { label: 'Latest', value: 'publishedDate' },
        { label: 'Most Viewed', value: 'views' },
      ],
    },
  ],
}
