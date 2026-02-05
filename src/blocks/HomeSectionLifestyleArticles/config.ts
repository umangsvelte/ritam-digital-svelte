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
    },

    {
      name: 'categoryConfigs',
      label: 'Category Configurations',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'articleCategory',
          label: 'Category',
          type: 'relationship',
          relationTo: 'articleCategories',
          required: true,
        },
        {
          name: 'mediaType',
          label: 'Media Type',
          type: 'select',
          dbName: 'media_type',
          options: [
            { label: 'Image', value: 'image' },
            { label: 'Video', value: 'video' },
          ],
        },
        {
          name: 'limit',
          type: 'number',
          // required: true,
          min: 1,
          max: 12,
          defaultValue: 3,
        },
        {
          name: 'enableLoadMore',
          label: 'Enable Load More',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
  ],
}
