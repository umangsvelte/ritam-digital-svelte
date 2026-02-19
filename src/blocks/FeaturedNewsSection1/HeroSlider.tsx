'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import Image from 'next/image'
import Link from 'next/link'

export default function HeroSlider({ articles }: any) {
  if (!articles?.length) return null

  return (
    <article className="featured-article">
      <Swiper modules={[Navigation]} navigation loop>
        {articles.map((article: any) => (
          <SwiperSlide key={article.id}>
            <Link href={`/articles/${article.slug}`}>
              <div className="thumbnail-container">
                {(article.featuredImage || article.videoThumbnail) && (
                  <Image
                    src={
                      article.featuredImage?.url ||
                      article.videoThumbnail?.url
                    }
                    alt={article.title}
                    fill
                  />
                )}

                <div className="article-content">
                  {article.category?.title && (
                    <span className="category-label">
                      {article.category.title}
                    </span>
                  )}

                  <h1 className="article-title">
                    {article.title}
                  </h1>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </article>
  )
}
