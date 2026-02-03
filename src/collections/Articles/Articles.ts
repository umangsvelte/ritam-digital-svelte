import type { CollectionConfig } from 'payload'
import  formatSlug  from '../../hooks/formatSlug';
import { lexicalEditor, HeadingFeature,FixedToolbarFeature, InlineToolbarFeature, AlignFeature , BlocksFeature, LinkFeature, UploadFeature} from '@payloadcms/richtext-lexical';
import { BgColorFeature, HighlightColorFeature, TextColorFeature, YoutubeFeature, VimeoFeature } from 'payloadcms-lexical-ext';

export const Articles: CollectionConfig = {
  slug: 'articles',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: [
      'title',
      'slug',
      'mediaType',
      'excerpt',
      'articleType', 
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [formatSlug('title')],
      },
    },
    {
      name: 'mediaType',
      type: 'radio',
      required: true,
      defaultValue: 'image',
      options: [
        { label: 'Featured Image', value: 'image' },
        { label: 'Featured Video (YouTube / Vimeo)', value: 'video' },
      ],
      admin: {
        position: 'sidebar',
      },
    },

    // IMAGE ARTICLE IMAGE
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, siblingData) => siblingData.mediaType === 'image',
      },
      validate: (value, { siblingData }) => {
        if (siblingData.mediaType === 'image' && !value) {
          return 'Featured image is required for image articles'
        }
        return true
      },
    },

    // VIDEO URL
    {
      name: 'featuredVideoUrl',
      label: 'Featured Video URL',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData.mediaType === 'video',
      },
      validate: (value, { siblingData }) => {
        if (siblingData.mediaType === 'video' && !value) {
          return 'Video URL is required when media type is video'
        }
        return true
      },
    },

    // VIDEO THUMBNAIL
    {
      name: 'videoThumbnail',
      label: 'Video Thumbnail',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, siblingData) => siblingData.mediaType === 'video',
      },
      validate: (value, { siblingData }) => {
        if (siblingData.mediaType === 'video' && !value) {
          return 'Video thumbnail is required for video articles'
        }
        return true
      },
    },
    {
      name: 'excerpt',
      type: 'richText', // Corrected type
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            LinkFeature({
                // Example showing how to customize the built-in fields
                // of the Link feature
                fields: ({ defaultFields }) => [
                ...defaultFields,
                {
                    name: 'rel',
                    label: 'Rel Attribute',
                    type: 'select',
                    hasMany: true,
                    options: ['noopener', 'noreferrer', 'nofollow'],
                    admin: {
                    description:
                        'The rel attribute defines the relationship between a linked resource and the current document. This is a custom link field.',
                    },
                },
                ],
            }),
            UploadFeature({
                collections: {
                uploads: {
                    // Example showing how to customize the built-in fields
                    // of the Upload feature
                    fields: [
                    {
                        name: 'caption',
                        type: 'richText',
                        editor: lexicalEditor(),
                    },
                    ],
                },
                },
            }),
            // This is incredibly powerful. You can reuse your Payload blocks
            // directly in the Lexical editor as follows:
            BlocksFeature({
                // blocks: [Banner, CallToAction],
            }),
            HeadingFeature({ enabledHeadingSizes: ['h1','h2', 'h3', 'h4', 'h5', 'h6'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            AlignFeature(),
            TextColorFeature(),
            HighlightColorFeature(),
          ]
        },
      }),
      defaultValue: {
        root: {
          type: 'root',
          children: [{
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [],
            "direction": null,
            "textStyle": "",
            "textFormat": 0
          }],
          direction: null,
          format: '',
          indent: 0,
          version: 1,
        },
      },

    },
    {
      name: 'publishedDate',
      type: 'date',
      required: true,
    },
    {
      name: 'author_name',
      type: 'text',
      label: 'Author Name',
      required: false,
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tags',
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'views',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'articleType',
      type: 'relationship',
      relationTo: 'articleCategories', 
      required: true,
      label: 'Article Category',
      admin: {
        allowCreate: true, // shows the "Add new category" button
      },
    },
  ],
}
