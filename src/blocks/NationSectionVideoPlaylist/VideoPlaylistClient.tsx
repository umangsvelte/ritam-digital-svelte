'use client'

import { useState } from 'react'

type Props = {
  articles: any[]
  categoryName?: string
}

export default function VideoPlaylistClient({ articles, categoryName }: Props) {
  const [currentVideo, setCurrentVideo] = useState(articles[0])

  return (
    <section className="politics-section jeg_col_2o3">
      <div className="yt-playlist">
        {/* MAIN PLAYER */}
        <div className="yt-player-wrapper">
          <div className="yt-player">
            <iframe
              id="yt-main-player"
              src={`https://www.youtube.com/embed/${currentVideo.youtubeVideoId}?autoplay=0&rel=0&showinfo=1`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>

        {/* RIGHT LIST */}
        <div className="yt-list-wrapper">
          <div className="yt-current">
            <div className="yt-current-left">
              <i className="fa fa-play" />
              <span>CURRENTLY PLAYING</span>
            </div>
            <div className="yt-current-title">
              {currentVideo.title}
            </div>
            <div className="yt-current-bg-icon">
              <i className="fa fa-play" />
            </div>
          </div>

          <div className="yt-list">
            {articles.map((article: any) => {
              const thumb =
                typeof article.videoThumbnail === 'object'
                  ? article.videoThumbnail?.url
                  : ''

              const isActive = article.id === currentVideo.id

              return (
                <div
                  key={article.id}
                  className={`yt-item ${isActive ? 'active' : ''}`}
                  onClick={() => setCurrentVideo(article)}
                >
                  <div className="yt-item-indicator" />

                  <div
                    className="yt-thumb"
                    style={{ backgroundImage: `url(${thumb})` }}
                  >
                    {/* <div className="yt-badge">
                      <span className="badge-text">NEWS BULLETIN</span>
                      <span className="badge-date">
                        {new Date(article.publishedDate).toLocaleDateString()}
                      </span>
                      <span className="badge-date">
                        {article.publishedDateFormatted}
                      </span>
                    </div> */}
                  </div>

                  <div className="yt-meta">
                    <h4>{article.title}</h4>
                    <span className="yt-category">{categoryName}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
