import type { Block } from 'payload'

export const FeaturedNewsSection1: Block = {
  slug: 'featuredNewsSection',
  labels: {
    singular: 'Featured News Section',
    plural: 'Featured News Sections',
  },
  fields: [
    {
      name: 'featuredArticles',
      label: 'Hero Slider Articles',
      type: 'relationship',
      relationTo: 'articles',
      hasMany: true,
      minRows: 1,
      maxRows: 5,
      required: true,
    },
    {
      name: 'fixedArticles',
      label: 'Fixed Bottom Articles (3)',
      type: 'relationship',
      relationTo: 'articles',
      hasMany: true,
      minRows: 3,
      maxRows: 3,
      required: true,
    },
    {
        name: 'bgColor',
        label: 'Background Color',
        type: 'text',
        defaultValue: '#ffffff',
        admin: {
            description: 'Hex color code e.g. #ffffff',
        },
        },
  ],
}