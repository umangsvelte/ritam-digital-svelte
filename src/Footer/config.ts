import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    // {
    //   name: 'notification_logo',
    //   label: 'Notification Logo',
    //   type: 'upload',
    //   relationTo: 'media',
    //   required: false,
    //   admin: {
    //         description: 'Upload size up to 50 MB',
    //       },
    // },
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
    },
    {
      name: 'copyrightText',
      label: 'Copyright Text',
      type: 'textarea',
      required: false,
    },
    {
      name: 'socialLinks',
      label: 'Social Media Links',
      type: 'array',
      fields: [
        {
          name: 'icon',
          label: 'Platform Icon',
          type: 'upload',
          relationTo: 'media', // <-- make sure this matches your Media collection slug
          required: true,
          admin: {
            description: 'Upload size up to 50 MB',
          },
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
