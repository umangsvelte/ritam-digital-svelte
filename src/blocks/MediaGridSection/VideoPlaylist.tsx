// 'use client'

// import { useMemo, useState } from 'react'
// import Link from 'next/link'
// import { getYoutubeId } from '@/utils/getYoutubeId'

// type Video = {
//   id: string
//   title: string
//   featuredVideoUrl?: string
// //   featuredImage?: { url?: string }
//   publishedDate?: string
//   category?: { title?: string }
//   videoThumbnail?: { url?: string }
// }

// export default function VideoPlaylist({ videos = [] }: { videos?: Video[] }) {
//   //  Normalize + extract YouTube IDs safely
//   const playlist = useMemo(() => {
//     return videos
//       .map(video => ({
//         ...video,
//         youtubeId: getYoutubeId(video.featuredVideoUrl),
//       }))
//       .filter(video => video.youtubeId)
//   }, [videos])

//   const [active, setActive] = useState(playlist[0])

//   if (!playlist.length || !active) return null

//   return (
//     <div className="top-videos-column">

//       {/* HEADER */}
//       <div className="jeg_block_heading jeg_block_heading_6 jeg_alignleft">
//         <h3 className="jeg_block_title">
//           <Link href="/video">
//             <span>Top Videos</span>
//           </Link>
//         </h3>
//       </div>

//       <div className="yt-playlist">

//         {/* PLAYER */}
//         <div className="yt-player-wrapper">
//           <div className="yt-player relative w-full pb-[56.25%] h-0">
//             <iframe
//               className="absolute top-0 left-0 w-full h-full"
//               id="yt-main-player"
//               src={`https://www.youtube.com/embed/${active.youtubeId}?rel=0&showinfo=1`}
//               allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//               allowFullScreen
//             />
//           </div>
//         </div>

//         {/* CURRENTLY PLAYING */}
//         <div className="yt-list-wrapper">

//           <div className="yt-current">
//             <div className="yt-current-left">
//               <i className="fa fa-play" />
//               <span>CURRENTLY PLAYING</span>
//             </div>

//             <div className="yt-current-title">
//               {active.title}
//             </div>
//           </div>

//           {/* PLAYLIST */}
//           <div className="yt-list">
//             {playlist.map(video => {
//               const isActive = video.id === active.id

//               return (
//                 <div
//                   key={video.id}
//                   className={`yt-item ${isActive ? 'active' : ''}`}
//                   onClick={() => setActive(video)}
//                 >
//                   <div className="yt-item-indicator" />

//                   {/* THUMB */}
//                   <div
//                     className="yt-thumb"
//                     style={{
//                       backgroundImage: `url(${video.videoThumbnail?.url || ''})`,
//                     }}
//                   >
//                     {/* <div className="yt-badge">
//                       <span className="badge-text">
//                         {video.category?.title || 'VIDEO'}
//                       </span>
//                       {video.publishedDate && (
//                         <span className="badge-date">
//                           {new Date(video.publishedDate).toDateString()}
//                         </span>
//                       )}
//                     </div> */}
//                   </div>

//                   {/* META */}
//                   <div className="yt-meta">
//                     <h4>{video.title}</h4>
//                     <span className="yt-category">
//                       {video.category?.title || 'VIDEOS'}
//                     </span>
//                   </div>
//                 </div>
//               )
//             })}
//           </div>

//         </div>
//       </div>
//     </div>
//   )
// }


'use client'

import { useMemo, useState } from 'react'
import { getYoutubeId } from '@/utils/getYoutubeId'
import Image from 'next/image'
import { getCategorySlug } from '@/utils/getCategorySlug'
import Link from 'next/link'

export default function VideoPlaylist({ videos = [] }) {
  const playlist = useMemo(() => {
    return videos
      .map(video => ({
        ...video,
        youtubeId: getYoutubeId(video.featuredVideoUrl),
      }))
      .filter(video => video.youtubeId)
  }, [videos])

  const [active, setActive] = useState(playlist[0])

  if (!playlist.length || !active) return null
  const categorySlug = getCategorySlug(active)

  return (
    <div>
      <div className="section-header-line">
        <h2 className="section-heading">Top Videos</h2>
      </div>

      <div className="rt-video-wrapper rt-top-video-section">

        {/* MAIN VIDEO */}
        <div className="rt-main-video">
          <div className="rt-video-thumb">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${active.youtubeId}`}
              allowFullScreen
            />

            {/* <div className="rt-video-overlay">
              <span className="rt-video-date">
                {active.publishedDate &&
                  new Date(active.publishedDate).toDateString()}
              </span>
              <h3>{active.title}</h3>
            </div> */}
          </div>
        </div>

        {/* CURRENTLY PLAYING */}
        <div className="rt-currently-playing">
          <span>Currently Playing</span>
          <Link href={
            active.mediaType === 'image'
              ? `/articles/${categorySlug}/${active.slug}`
              : `/videos/${categorySlug}/${active.slug}`
          }>
            <p className="line-clamp-1">{active.title}</p>
          </Link>
        </div>

        {/* VIDEO LIST */}
        <div className="rt-video-list">
          {playlist.map(video => {
            const isActive = video.id === active.id

            return (
              <article
                key={video.id}
                className={`rt-video-item ${isActive ? 'active' : ''}`}
                onClick={() => setActive(video)}
              >
                {/* Indicator */}
                <div className="rt-video-item-indicator" />

                {/* Thumbnail with fixed container */}
                <div className="rt-video-thumbnail-container">
                  {video.videoThumbnail?.url && (
                    <Image
                      src={video.videoThumbnail.url}
                      alt={video.title}
                      width={120}
                      height={70}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  )}
                </div>

                <div className="rt-video-info">
                  <h4 className="line-clamp-2">{video.title}</h4>
                  <span className="rt-video-category">
                    {video.category?.title || 'VIDEOS'}
                  </span>
                </div>
              </article>
            )
          })}
        </div>


      </div>
    </div>
  )
}
