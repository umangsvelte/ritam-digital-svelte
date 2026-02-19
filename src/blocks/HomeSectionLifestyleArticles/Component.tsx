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
}

export const LifestyleArticlesBlockComponent = async ({
  title,
  categoryConfigs,
}: Props) => {
  const payload = await getPayload({ config: configPromise })

  const sections = await Promise.all(
    categoryConfigs.map(async config => {
      const categoryId =
        typeof config.articleCategory === 'object'
          ? config.articleCategory.id
          : config.articleCategory

      const whereConditions: any[] = [
        {
          articleType: {
            equals: categoryId,
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
    />
  )
}
