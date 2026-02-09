import type { Block } from 'payload'
import { FeaturedNewsSection1 } from '@/blocks/FeaturedNewsSection1/config'
import { MediaGridSection } from '@/blocks/MediaGridSection/index'
import { WorldArticlesBlock } from '@/blocks/HomeSectionWorldArticles/config'
import { PoliticsArticlesBlock } from '@/blocks/HomeSectionPoliticsArticles/config'
import { SportsArticlesBlock } from '@/blocks/HomeSectionSportsArticles/config'
import { EntertainmentArticlesBlock } from '@/blocks/HomeSectionEntertainmentArticles/config'
import { LifestyleArticlesBlock } from '@/blocks/HomeSectionLifestyleArticles/config'
import { HomeSectionBusinessOpinion } from '@/blocks/HomeSectionBusinessOpinion/config'
import { DontMissBlock } from '@/blocks/NationSectionDontMiss/config'
import { VideoPlaylistBlock } from '@/blocks/NationSectionVideoPlaylist/config'
import { SearchResultsBlock } from '@/blocks/SearchResults/config'
import { LatestNewsBlock } from '@/blocks/LatestNews/config'

export const ContainerBlock: Block = {
  slug: 'container',
  labels: {
    singular: 'Container',
    plural: 'Containers',
  },
  fields: [
    {
      name: 'layout',
      label: 'Layout Type',
      type: 'select',
      required: true,
      defaultValue: 'full',
      options: [
        { label: 'Full Width', value: 'full' },
        { label: '50 / 50', value: 'half' },
        { label: 'Left Fixed (33%)', value: 'leftFixed' },   
        { label: 'Right Fixed (33%)', value: 'rightFixed' }, 
      ],
    },

    {
      name: 'fullWidthBlocks',
      type: 'blocks',
      admin: {
        condition: (_, data) => data.layout === 'full',
      },
      blocks: [
        FeaturedNewsSection1,
        MediaGridSection,
      ],
    },

    {
      name: 'leftColumn',
      label: 'Left Column',
      type: 'blocks',
      admin: {
        condition: (_, data) =>
          ['half', 'leftFixed', 'rightFixed'].includes(data.layout),
      },
      blocks: [
        WorldArticlesBlock,
        MediaGridSection,
        PoliticsArticlesBlock,
        SportsArticlesBlock,
        EntertainmentArticlesBlock,
        LifestyleArticlesBlock,
        HomeSectionBusinessOpinion,
        DontMissBlock,
        VideoPlaylistBlock,
        SearchResultsBlock,
        LatestNewsBlock,
      ],
    },

    {
      name: 'rightColumn',
      label: 'Right Column',
      type: 'blocks',
      admin: {
        condition: (_, data) =>
          ['half', 'leftFixed', 'rightFixed'].includes(data.layout),
      },
      blocks: [
        WorldArticlesBlock,
        MediaGridSection,
        PoliticsArticlesBlock,
        SportsArticlesBlock,
        EntertainmentArticlesBlock,
        LifestyleArticlesBlock,
        HomeSectionBusinessOpinion,
        DontMissBlock,
        VideoPlaylistBlock,
        SearchResultsBlock,
        LatestNewsBlock,
      ],
    },
  ],
}
