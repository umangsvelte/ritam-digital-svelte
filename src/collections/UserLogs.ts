import type { CollectionConfig } from 'payload'

export const UserLogs: CollectionConfig = {
  slug: 'userLogs',
  admin: {
    useAsTitle: 'action',
    defaultColumns: ['action', 'collection', 'user', 'createdAt'],
    hideAPIURL: true,
  },
  access: {
    read: ({ req }) => req.user?.role === 'admin',
    create: () => true, // allow hooks to write
    update: () => false,
    delete: () => false,
  },
  fields: [
    {
        name: 'action',
        type: 'select',
        options: [
            { label: 'Create', value: 'create' },
            { label: 'Update', value: 'update' },
            { label: 'Delete', value: 'delete' },
            { label: 'Scheduled Publish', value: 'scheduled_publish' },
        ],
        required: true,
    },
    {
      name: 'collection',
      type: 'text',
      required: true,
    },
    {
      name: 'documentId',
      type: 'text',
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: false,
    },
    {
      name: 'previousData',
      type: 'json',
    },
    {
      name: 'newData',
      type: 'json',
    },
  ],
  timestamps: true,
}
