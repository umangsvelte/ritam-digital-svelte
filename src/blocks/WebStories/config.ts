// src/blocks/WebStories/config.ts
import { Block } from 'payload'

export const WebStoriesBlock: Block = {
  slug: 'webStories',
  labels: {
    singular: 'Web Stories',
    plural: 'Web Stories',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Web Stories',
    },
    {
      name: 'stories',
      type: 'array',
      label: 'Stories',
      minRows: 1,
      fields: [
        {
          name: 'storyTitle',
          type: 'text',
          required: true,
        },
        {
          name: 'slides',
          type: 'array',
          minRows: 1,
          fields: [
            {
              name: 'mediaType',
              type: 'select',
              required: true,
              options: [
                { label: 'Image', value: 'image' },
                { label: 'Video', value: 'video' },
              ],
            },
            {
              name: 'media',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'caption',
              type: 'textarea',
            },
          ],
        },
      ],
    },
  ],
}
