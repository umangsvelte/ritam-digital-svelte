import type { Block } from 'payload'

export const LatestNewsBlock: Block = {
  slug: 'latestNews',
  labels: {
    singular: 'Latest News',
    plural: 'Latest News',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
      required: true,
      defaultValue: 'Latest News',
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
      name: 'latestNewsInfo',
      label: 'Latest News (Auto)',
      type: 'text',
      admin: {
        readOnly: true,
        description:
          'This section is automatically generated. It displays the latest 10 articles sorted by published date.',
      },
      defaultValue: 'Auto-generated (Latest 10 by published date)',
    },
  ],
}
