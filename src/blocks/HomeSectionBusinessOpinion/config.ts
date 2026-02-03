import { Block } from 'payload'

export const HomeSectionBusinessOpinion: Block = {
  slug: 'homeSectionBusinessOpinion',
  labels: {
    singular: 'Home Section – Business/ Opinion',
    plural: 'Home Section – Business/ Opinion',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    //   defaultValue: 'Business',
    },
    {
      name: 'articleCategory',
      label: 'Article Category',
      type: 'relationship',
      relationTo: 'articleCategories', // adjust if different
      required: true,
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 4,
      min: 1,
      max: 10,
    },
  ],
}
