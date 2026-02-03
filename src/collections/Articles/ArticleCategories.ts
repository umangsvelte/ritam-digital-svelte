
import type { CollectionConfig } from 'payload'

const ArticleCategories: CollectionConfig = {
  slug: 'articleCategories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'parent'],
    hidden: true,
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
    },

    // 🔹 Parent category (self reference)
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'articleCategories',
      required: false,
      admin: {
        position: 'sidebar',
        description: 'Select a parent category to create a subcategory',
      },
    },
  ],
}

export default ArticleCategories
