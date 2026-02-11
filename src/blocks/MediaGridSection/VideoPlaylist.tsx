'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { getYoutubeId } from '@/utils/getYoutubeId'

type Video = {
  id: string
  title: string
  featuredVideoUrl?: string
//   featuredImage?: { url?: string }
  publishedDate?: string
  category?: { title?: string }
  videoThumbnail?: { url?: string }
}

export default function VideoPlaylist({ videos = [] }: { videos?: Video[] }) {
  //  Normalize + extract YouTube IDs safely
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

  return (
    <div className="top-videos-column">

      {/* HEADER */}
      <div className="jeg_block_heading jeg_block_heading_6 jeg_alignleft">
        <h3 className="jeg_block_title">
          <Link href="/video">
            <span>Top Videos</span>
          </Link>
        </h3>
      </div>

      <div className="yt-playlist">

        {/* PLAYER */}
        <div className="yt-player-wrapper">
          <div className="yt-player relative w-full pb-[56.25%] h-0">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              id="yt-main-player"
              src={`https://www.youtube.com/embed/${active.youtubeId}?rel=0&showinfo=1`}
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>

        {/* CURRENTLY PLAYING */}
        <div className="yt-list-wrapper">

          <div className="yt-current">
            <div className="yt-current-left">
              <i className="fa fa-play" />
              <span>CURRENTLY PLAYING</span>
            </div>

            <div className="yt-current-title">
              {active.title}
            </div>
          </div>

          {/* PLAYLIST */}
          <div className="yt-list">
            {playlist.map(video => {
              const isActive = video.id === active.id

              return (
                <div
                  key={video.id}
                  className={`yt-item ${isActive ? 'active' : ''}`}
                  onClick={() => setActive(video)}
                >
                  <div className="yt-item-indicator" />

                  {/* THUMB */}
                  <div
                    className="yt-thumb"
                    style={{
                      backgroundImage: `url(${video.videoThumbnail?.url || ''})`,
                    }}
                  >
                    {/* <div className="yt-badge">
                      <span className="badge-text">
                        {video.category?.title || 'VIDEO'}
                      </span>
                      {video.publishedDate && (
                        <span className="badge-date">
                          {new Date(video.publishedDate).toDateString()}
                        </span>
                      )}
                    </div> */}
                  </div>

                  {/* META */}
                  <div className="yt-meta">
                    <h4>{video.title}</h4>
                    <span className="yt-category">
                      {video.category?.title || 'VIDEOS'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </div>
    </div>
  )
}
