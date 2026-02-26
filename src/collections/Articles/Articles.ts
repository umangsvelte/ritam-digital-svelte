import type { CollectionConfig } from 'payload'
import  formatSlug  from '../../hooks/formatSlug';
import { lexicalEditor, HeadingFeature,FixedToolbarFeature, InlineToolbarFeature, AlignFeature , BlocksFeature, LinkFeature, UploadFeature} from '@payloadcms/richtext-lexical';
import { BgColorFeature, HighlightColorFeature, TextColorFeature, YoutubeFeature, VimeoFeature } from 'payloadcms-lexical-ext';
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Articles: CollectionConfig = {
  slug: 'articles',
  access: {
    read: ({ req }) => {
      if (req.user?.role === 'admin') return true

      if (req.user?.role === 'author') {
        return {
          or: [
            {
              author: {
                equals: req.user.id,
              },
            },
            {
              _status: {
                equals: 'published',
              },
            },
          ],
        }
      }

      return {
        _status: {
          equals: 'published',
        },
      }
    },


    create: ({ req }) => {
      return req.user?.role === 'admin' || req.user?.role === 'author'
    },

    update: ({ req }) => {
      if (req.user?.role === 'admin') return true

      // author can update only their own articles
      return {
        author: {
          equals: req.user?.id,
        },
      }
    },

    delete: ({ req }) => {
      if (req.user?.role === 'admin') return true

      // author can delete only their own articles
      return {
        author: {
          equals: req.user?.id,
        },
      }
    },
  },
  hooks: {
    afterChange: [
      async (args) => {
        try {
          const { operation, req, doc, previousDoc } = args

          if (!req?.user?.id) return
          if (!doc && !previousDoc) return

          const documentId = doc?.id ?? previousDoc?.id
          if (!documentId) return

          // Helper function to populate relationships
          const populateRelations = async (data: any) => {
            if (!data) return null
            
            const populated = { ...data }
            
            // Populate articleType if it exists
            if (data.articleType) {
              populated.articleType = await req.payload.findByID({
                collection: 'articleCategories',
                id: typeof data.articleType === 'object' ? data.articleType.id : data.articleType,
                depth: 1,
              })
            }
            
            // Populate featuredImage if it exists
            if (data.featuredImage) {
              populated.featuredImage = await req.payload.findByID({
                collection: 'media',
                id: typeof data.featuredImage === 'object' ? data.featuredImage.id : data.featuredImage,
                depth: 1,
              })
            }
            
            // Populate tags if they exist
            if (data.tags && Array.isArray(data.tags)) {
              populated.tags = await Promise.all(
                data.tags.map(async (tagId: any) => {
                  return await req.payload.findByID({
                    collection: 'articleTags',
                    id: typeof tagId === 'object' ? tagId.id : tagId,
                    depth: 1,
                  })
                })
              )
            }
            
            // Populate author if it exists
            if (data.author) {
              populated.author = await req.payload.findByID({
                collection: 'users',
                id: typeof data.author === 'object' ? data.author.id : data.author,
                depth: 1,
              })
            }
            
            return populated
          }

          const populatedNewData = await populateRelations(doc)
          const populatedPreviousData = await populateRelations(previousDoc)

          await req.payload.create({
            collection: 'userLogs',
            data: {
              action: operation,
              collection: 'articles',
              documentId: String(documentId),
              user: req.user.id,
              previousData: populatedPreviousData,
              newData: populatedNewData,
            },
          })
        } catch (error) {
          console.error('Audit log error (afterChange):', error)
        }
      },
    ],
    
    // Optional: Also log beforeDelete if you want to capture delete info
    beforeDelete: [
      async (args) => {
        try {
          const { req, id } = args
          
          if (!req?.user?.id) return

          await req.payload.create({
            collection: 'userLogs',
            data: {
              action: 'delete',
              collection: 'articles',
              documentId: String(id),
              user: req.user.id,
              previousData: await req.payload.findByID({
                collection: 'articles',
                id,
              }),
              newData: null,
            },
          })
        } catch (error) {
          console.error('Audit log error (beforeDelete):', error)
        }
      },
    ],
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
    hideAPIURL: true,
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'articles',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'articles',
        req,
      }),
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
      admin: {
        hidden: true,
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: false,
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'articleTags',
      hasMany: true,
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
      name: 'scheduledRelease',
      type: 'date',
      label: 'Scheduled Release Date & Time',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
        condition: (data) => {
          // Only show scheduling option for draft articles
          return data?._status === 'draft';
        },
      },
    },
    {
      name: 'meta',
      label: 'SEO',
      type: 'group',
      admin: {
        position: 'sidebar',
      },
      fields: [
        OverviewField({
          titlePath: 'meta.title',
          descriptionPath: 'meta.description',
          imagePath: 'meta.image',
        }),
        MetaTitleField({
          hasGenerateFn: true,
        }),
        MetaImageField({
          relationTo: 'media',
        }),
        MetaDescriptionField({}),
        PreviewField({
          hasGenerateFn: true,
          titlePath: 'meta.title',
          descriptionPath: 'meta.description',
        }),
      ],
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
  versions: {
    drafts: {
      autosave: false
    },
  },
}
