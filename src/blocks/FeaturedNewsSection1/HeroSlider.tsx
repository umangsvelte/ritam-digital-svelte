'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import Image from 'next/image'
import Link from 'next/link'
import '../css/home-page.css'

export default function HeroSlider({ articles }) {
  if (!articles?.length) return null

  return (
    <Swiper
      modules={[Navigation]}
      navigation
      loop
      className="h-[420px] rounded overflow-hidden shadow"
    >
      {articles.map((article) => (
        <SwiperSlide key={article.id}>
          <Link href={`/articles/${article.slug}`} className="relative block h-full">

            {/* Image */}
            {/* <Image
              src={article.featuredImage?.url}
              alt={article.title}
              fill
              priority
              className="object-cover"
            /> */}
            {/* Image */}
            {article.mediaType === 'image' && article.featuredImage && (
            <Image src={article.featuredImage.url} alt={article.title} fill priority className="object-cover" />
            )}

            {/* Video */}
            {article.mediaType === 'video' && article.featuredVideoUrl && (
            <iframe
                src={article.featuredVideoUrl}
                className="w-full h-full"
                allowFullScreen
            />
            )}

            {/* Gradient overlay (better than flat black) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            {/* Content */}
            <div className="absolute bottom-6 left-6 right-6 text-white">
              {article.category?.title && (
                <span className="inline-block bg-black px-3 py-1 text-xs font-semibold uppercase mb-3 rounded">
                  {article.category.title}
                </span>
              )}

              <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                {article.title}
              </h2>
            </div>

          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
