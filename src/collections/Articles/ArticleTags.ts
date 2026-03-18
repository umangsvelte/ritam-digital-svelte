import type { CollectionConfig } from 'payload'

export const Tags: CollectionConfig = {
  slug: 'articleTags',

  admin: {
    useAsTitle: 'name',
    hidden: true,
  },

  access: {
    read: () => true,
    
    create: ({ req }) => {
      return req.user?.role === 'admin'
    },

    update: ({ req }) => {
      return req.user?.role === 'admin'
    },

    delete: ({ req }) => {
      return req.user?.role === 'admin'
    },
  },

  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    // {
    //   name: 'slug',
    //   type: 'text',
    //   required: true,
    //   unique: true,
    // },
  ],
}
