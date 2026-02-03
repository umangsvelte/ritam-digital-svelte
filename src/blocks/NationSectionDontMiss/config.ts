import type { Block } from 'payload'

export const DontMissBlock: Block = {
  slug: 'dontMiss',
  labels: {
    singular: "Don't Miss",
    plural: "Don't Miss Blocks",
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: "Don't Miss",
    },
    {
      name: 'articleCategory',
      type: 'relationship',
      relationTo: 'articleCategories', 
      required: true,
    },
    {
      name: 'limit',
      type: 'number',
      required: true,
      defaultValue: 6,
      min: 1,
      max: 12,
    },
  ],
}
