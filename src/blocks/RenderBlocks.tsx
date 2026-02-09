import React, { Fragment, Suspense } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import RichText from '@/components/RichText'
import { FeaturedNewsSection1Block } from '@/blocks/FeaturedNewsSection1/Component'
import  MediaGridSection  from '@/blocks/MediaGridSection/Component'
import { ContainerBlockComponent } from '@/blocks/Container/Component'
import { WorldArticlesBlockComponent } from '@/blocks/HomeSectionWorldArticles/Component'
import { PoliticsArticlesBlockComponent } from '@/blocks/HomeSectionPoliticsArticles/Component'
import { SportsArticlesBlockComponent } from '@/blocks/HomeSectionSportsArticles/Component'
import { EntertainmentArticlesBlockComponent } from '@/blocks/HomeSectionEntertainmentArticles/Component'
import { LifestyleArticlesBlockComponent } from '@/blocks/HomeSectionLifestyleArticles/Component'
import WebStoriesComponent from '@/blocks/WebStories/Component'
import { HomeSectionBusinessOpinionComponent } from '@/blocks/HomeSectionBusinessOpinion/Component'
import { LatestNationalNewsComponent } from '@/blocks/NationSectionLatestNationalNews/Component'
import { DontMissComponent } from '@/blocks/NationSectionDontMiss/Component'
import { VideoPlaylistComponent } from '@/blocks/NationSectionVideoPlaylist/Component'
import  SearchResultsBlock  from '@/blocks/SearchResults/Component'
import  LatestNewsComponent  from '@/blocks/LatestNews/Component'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  featuredNewsSection:FeaturedNewsSection1Block,
  mediaGridSection:MediaGridSection,
  container:ContainerBlockComponent,
  worldArticles:WorldArticlesBlockComponent,
  politicsArticles:PoliticsArticlesBlockComponent,
  sportsArticles:SportsArticlesBlockComponent,
  entertainmentArticles:EntertainmentArticlesBlockComponent,
  lifestyleArticles:LifestyleArticlesBlockComponent,
  webStories:WebStoriesComponent,
  homeSectionBusinessOpinion:HomeSectionBusinessOpinionComponent,
  latestNationalNews:LatestNationalNewsComponent,
  dontMiss:DontMissComponent,
  videoPlaylist:VideoPlaylistComponent,
  searchResults:SearchResultsBlock,
  latestNews:LatestNewsComponent,
}

const RichTextRenderer = ({ content }: { content: any }) => {
  if (!content) return null
  return <RichText data={content} />
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType, ...rest } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              // Pre-process block props to handle richText fields
              const processedProps = Object.entries(rest).reduce((acc, [key, value]) => {
                // Check if the value is a richText field (has root property)
                if (value && typeof value === 'object' && 'root' in value) {
                  return {
                    ...acc,
                    [key]: <RichTextRenderer content={value} />
                  }
                }
                return { ...acc, [key]: value }
              }, {})

              if(processedProps){
                if (blockType === 'searchResults') {
                  return (
                    <Suspense
                      key={index}
                      fallback={<div className="py-10 text-center">Loading search results…</div>}
                    >
                      <Block
                        {...processedProps}
                        blockType={blockType}
                        disableInnerContainer
                      />
                    </Suspense>
                  )
                }

                return (
                  <div className="" key={index}>
                    <Block
                      {...processedProps}
                      blockType={blockType}
                      disableInnerContainer
                    />
                  </div>
                )
                // return (
                //   <div className="" key={index}>
                //     <Block {...processedProps} blockType={blockType} disableInnerContainer />
                //   </div>
                // )
              }
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
