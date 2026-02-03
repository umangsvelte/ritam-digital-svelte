import type { CollectionConfig } from 'payload'
import  formatSlug  from '../../hooks/formatSlug';
import { lexicalEditor, HeadingFeature,FixedToolbarFeature, InlineToolbarFeature, AlignFeature, LinkFeature, UploadFeature, BlocksFeature  } from '@payloadcms/richtext-lexical';
import { BgColorFeature, HighlightColorFeature, TextColorFeature, YoutubeFeature, VimeoFeature } from 'payloadcms-lexical-ext';


export const Videos: CollectionConfig = {
  slug: 'videos',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      required: false,
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
      name: 'embedUrl',
      type: 'text',
      required: true,
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
            HeadingFeature({ enabledHeadingSizes: ['h1','h2', 'h3', 'h4'] }),
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
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
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
      name: 'videoType',
      type: 'relationship',
      relationTo: 'videoCategories', 
      required: true,
      label: 'Video Category',
      admin: {
        allowCreate: true, // shows the "Add new category" button
      },
    },
  ],
}
