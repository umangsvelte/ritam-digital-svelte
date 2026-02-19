import type { Block } from 'payload'

export const SearchResultsBlock: Block = {
  slug: 'searchResults',
  labels: {
    singular: 'Search Results',
    plural: 'Search Results',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Search Results',
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 12,
      admin: {
        description: 'Articles per page',
      },
    },
  ],
}
