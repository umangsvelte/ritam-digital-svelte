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
    // {
    //   name: 'topNews',
    //   label: 'Top News (Right Sidebar)',
    //   type: 'relationship',
    //   relationTo: 'articles',
    //   hasMany: true,
    //   minRows: 5,
    //   maxRows: 10,
    // },
    {
      name: 'topNewsInfo',
      label: 'Top News (Auto)',
      type: 'text',
      admin: {
        readOnly: true,
        description:
          'This section is automatically generated. It displays the top 7 most viewed articles sorted by view count.',
      },
      defaultValue: 'Auto-generated (Top 7 by views)',
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