

'use client'
import { useEffect, useState } from 'react'

const DURATION = 10000

type StoryViewerProps = {
  stories: any[]
  startIndex: number
  onClose: () => void
}

export default function StoryViewer({
  stories,
  startIndex,
  onClose,
}: StoryViewerProps) {
  const [storyIndex, setStoryIndex] = useState(startIndex)
  const [slideIndex, setSlideIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [showShare, setShowShare] = useState(false)

  const story = stories[storyIndex]
  const slide = story.slides[slideIndex]

  const mediaUrl =
    typeof slide.media === 'object' ? slide.media.url : ''

  const storyUrl =
    typeof window !== 'undefined'
      ? window.location.href
      : ''

  /* -------------------------------
     Progress timer
  -------------------------------- */
  useEffect(() => {
    if (isPaused || showShare) return

    const timer = setInterval(() => {
      setProgress((p) => Math.min(p + 2, 100))
    }, DURATION / 50)

    return () => clearInterval(timer)
  }, [storyIndex, slideIndex, isPaused, showShare])

  /* -------------------------------
     Auto navigation
  -------------------------------- */
  useEffect(() => {
    if (progress < 100) return

    if (slideIndex < story.slides.length - 1) {
      setSlideIndex((i) => i + 1)
      setProgress(0)
    } else if (storyIndex < stories.length - 1) {
      setStoryIndex((i) => i + 1)
      setSlideIndex(0)
      setProgress(0)
    } else {
      onClose()
    }
  }, [progress])

  /* -------------------------------
     Navigation handlers
  -------------------------------- */
  const next = () => {
    setProgress(0)
    if (slideIndex < story.slides.length - 1) {
      setSlideIndex(slideIndex + 1)
    } else if (storyIndex < stories.length - 1) {
      setStoryIndex(storyIndex + 1)
      setSlideIndex(0)
    }
  }

  const prev = () => {
    setProgress(0)
    if (slideIndex > 0) {
      setSlideIndex(slideIndex - 1)
    }
  }

  /* -------------------------------
     Share handlers
  -------------------------------- */
  const copyLink = async () => {
    await navigator.clipboard.writeText(storyUrl)
    alert('Link copied')
  }

  return (
    <div className="story-overlay">
      {/* Background */}
      <div
        className="story-bg"
        style={{ backgroundImage: `url(${mediaUrl})` }}
      />

      <div className="story-container">
        {/* Story index */}
        <div className="story-index">
          {storyIndex + 1} / {stories.length}
        </div>

        {/* Progress bars */}
        <div className="story-progress">
          {story.slides.map((_: any, i: number) => (
            <div key={i} className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width:
                    i < slideIndex
                      ? '100%'
                      : i === slideIndex
                      ? `${progress}%`
                      : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* Top-right controls */}
        <div className="story-controls">
          <div className="left-controls">
            <button onClick={() => setIsPaused(!isPaused)}>
              {isPaused ? '▶️' : '⏸'}
            </button>
            <button onClick={() => setShowShare(true)}>✈️</button>
          </div>

          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Media */}
        {slide.mediaType === 'image' ? (
          <img src={mediaUrl} className="story-media" />
        ) : (
          <video
            src={mediaUrl}
            className="story-media"
            autoPlay
            muted
            playsInline
          />
        )}

        {/* Caption */}
        {slide.caption && (
          <div className="story-caption">{slide.caption}</div>
        )}

        
      </div>
      {/* Navigation arrows */}
      <button className="story-arrow left" onClick={prev}>‹</button>
      <button className="story-arrow right" onClick={next}>›</button>

      {/* SHARE MODAL */}
      {showShare && (
        <div className="share-overlay" onClick={() => setShowShare(false)}>
          <div className="share-modal" onClick={(e) => e.stopPropagation()}>
            <div className="share-header">
              <span>Share</span>
              <button onClick={() => setShowShare(false)}>✕</button>
            </div>

            <button onClick={copyLink}>🔗 Get Link</button>
            <a
              href={`https://twitter.com/intent/tweet?url=${storyUrl}`}
              target="_blank"
            >
              ❌ Twitter (X)
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${storyUrl}`}
              target="_blank"
            >
              🔵 LinkedIn
            </a>
            <a href={`mailto:?body=${storyUrl}`}>
              ✉️ Email
            </a>
          </div>
        </div>
      )}
    </div>
  )
}