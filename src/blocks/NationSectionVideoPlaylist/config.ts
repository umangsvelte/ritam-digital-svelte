import type { Block } from 'payload'

export const VideoPlaylistBlock: Block = {
  slug: 'videoPlaylist',
  labels: {
    singular: 'Video Playlist',
    plural: 'Video Playlists',
  },
  fields: [
    {
      name: 'articleCategory',
      type: 'relationship',
      relationTo: 'articleCategories',
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
