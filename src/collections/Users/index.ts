// import type { CollectionConfig } from 'payload'

// import { authenticated } from '../../access/authenticated'

// export const Users: CollectionConfig = {
//   slug: 'users',
//   access: {
//     admin: authenticated,
//     create: authenticated,
//     delete: authenticated,
//     read: authenticated,
//     update: authenticated,
//   },
//   admin: {
//     defaultColumns: ['name', 'email'],
//     useAsTitle: 'name',
//   },
//   auth: true,
//   fields: [
//     {
//       name: 'name',
//       type: 'text',
//     },
//   ],
//   timestamps: true,
// }

import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',

  auth: true,

  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role'],
    hideAPIURL: true,
  },

  access: {
    read: ({ req }) => {
      const hiddenEmail = 'superadmin@gmail.com'

      // Always allow user to see themselves
      if (req.user?.email === hiddenEmail) {
        return true
      }

      return {
        email: {
          not_equals: hiddenEmail,
        },
      }
    },

    create: ({ req }) => {
      return req.user?.role === 'admin' || req.user?.role === 'author'
    },

    update: ({ req }) => {
      if (req.user?.role === 'admin') return true

      // author can update only their own user record
      return {
        id: {
          equals: req.user?.id,
        },
      }
    },

    delete: ({ req }) => req.user?.role === 'admin',
  },

  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },

    // ROLE FIELD
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'admin',
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Author',
          value: 'author',
        },
      ],
    },
  ],

  timestamps: true,
}

