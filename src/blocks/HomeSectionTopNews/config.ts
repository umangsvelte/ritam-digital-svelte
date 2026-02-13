import type { Block } from 'payload'

export const TopNewsBlock: Block = {
  slug: 'topNews',
  labels: {
    singular: 'Top News',
    plural: 'Top News',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
      required: true,
      defaultValue: 'Top News',
    },

    {
      name: 'mediaType',
      type: 'select',
      label: 'Media Type',
      defaultValue: 'image',
      options: [
        { label: 'Image Articles', value: 'image' },
        { label: 'Video Articles', value: 'video' },
        { label: 'All (Image + Video)', value: 'all' },
      ],
      admin: {
        description:
          'Choose which type of articles should appear in this section.',
      },
    },

    {
      name: 'topNewsInfo',
      label: 'Top News (Auto)',
      type: 'text',
      admin: {
        readOnly: true,
        description:
          'This section is automatically generated. It displays the top 10 most viewed articles sorted by published date.',
      },
      defaultValue: 'Auto-generated (Top 10 most viewed by published date)',
    },
  ],
}
