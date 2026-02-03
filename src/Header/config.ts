// import type { GlobalConfig } from 'payload'

// import { link } from '@/fields/link'
// import { revalidateHeader } from './hooks/revalidateHeader'

// export const Header: GlobalConfig = {
//   slug: 'header',
//   access: {
//     read: () => true,
//   },
//   fields: [
//     {
//       name: 'navItems',
//       type: 'array',
//       fields: [
//         link({
//           appearances: false,
//         }),
//       ],
//       maxRows: 6,
//       admin: {
//         initCollapsed: true,
//         components: {
//           RowLabel: '@/Header/RowLabel#RowLabel',
//         },
//       },
//     },
//   ],
//   hooks: {
//     afterChange: [revalidateHeader],
//   },
// }

import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
    update: ({ req }) => !!req.user,
  },
  fields: [
    {
      name: 'logo',
      label: 'Logo',
      type: 'upload',
      relationTo: 'media', // assumes Media collection exists
      required: false,
      admin: {
            description: 'Upload size up to 50 MB',
          },
    },
    {
      name: 'navItems',
      label: 'Navigation Menu',
      type: 'array',
      fields: [
         link({
          appearances: false,
        }),
        {
          name: 'subMenu',
          label: 'Sub Menu Items',
          type: 'array',
          maxRows: 10,
          fields: [
            // {
            //   name: 'label',
            //   type: 'text',
            //   required: true,
            //   localized: true,
            // },
            link({
              appearances: false,
            }),
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}

