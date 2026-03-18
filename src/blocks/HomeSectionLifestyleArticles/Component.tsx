import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import LifestyleArticlesClient from './LifestyleArticlesClient'

type CategoryConfig = {
  articleCategory: any
  mediaType?: 'image' | 'video'
  limit: number
  enableLoadMore: boolean
}

type Props = {
  title: string
  categoryConfigs: CategoryConfig[]
  categorySlug?: string
}

export const LifestyleArticlesBlockComponent = async ({
  title,
  categoryConfigs,
  categorySlug,
}: Props) => {
  const payload = await getPayload({ config: configPromise })
  

  const sections = await Promise.all(
    categoryConfigs.map(async config => {
      const categoryId =
        typeof config.articleCategory === 'object'
          ? config?.articleCategory?.id
          : config.articleCategory

      const whereConditions: any[] = [
        {
          articleType: {
            equals: categoryId,
          },
          _status: {
            equals: 'published',
          },
        },
      ]

      if (config.mediaType) {
        whereConditions.push({
          mediaType: {
            equals: config.mediaType,
          },
        })
      }
    if(!categorySlug || categorySlug == undefined || categorySlug== null)
      categorySlug = typeof config.articleCategory === 'object' ? config.articleCategory.name: ''

      const effectiveLimit =
      typeof config.limit === 'number' && config.limit > 0
        ? config.limit
        : 9

      const result = await payload.find({
        collection: 'articles',
        where: {
          and: whereConditions,
        },
        sort: '-publishedDate',
        page: 1,
        limit: effectiveLimit,
      })

      return {
        categoryId,
        categoryName:
          typeof config.articleCategory === 'object'
            ? config.articleCategory.name
            : '',
        mediaType: config.mediaType,
        initialArticles: result.docs,
        totalDocs: result.totalDocs,
        limit: effectiveLimit,
        enableLoadMore: config.enableLoadMore,
      }
    })
  )

  return (
    <LifestyleArticlesClient
      title={title}
      sections={sections}
      categorySlug={categorySlug}
    />
  )
}
