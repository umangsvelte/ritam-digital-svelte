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

  const story = stories[storyIndex]
  const slide = story.slides[slideIndex]

  /* -------------------------------
     Progress timer
  -------------------------------- */
  useEffect(() => {
    setProgress(0)

    const timer = setInterval(() => {
      setProgress((p) => Math.min(p + 2, 100))
    }, DURATION / 50)

    return () => clearInterval(timer)
  }, [storyIndex, slideIndex])

  /* -------------------------------
     Auto move to next slide/story
  -------------------------------- */
  useEffect(() => {
    if (progress < 100) return

    if (slideIndex < story.slides.length - 1) {
      setSlideIndex((i) => i + 1)
    } else if (storyIndex < stories.length - 1) {
      setStoryIndex((i) => i + 1)
      setSlideIndex(0)
    } else {
      onClose()
    }
  }, [progress])

  /* -------------------------------
     Manual navigation
  -------------------------------- */
  const next = () => {
    setProgress(0)

    if (slideIndex < story.slides.length - 1) {
      setSlideIndex(slideIndex + 1)
    } else if (storyIndex < stories.length - 1) {
      setStoryIndex(storyIndex + 1)
      setSlideIndex(0)
    } else {
      onClose()
    }
  }

  const prev = () => {
    setProgress(0)
    if (slideIndex > 0) {
      setSlideIndex(slideIndex - 1)
    }
  }

  const mediaUrl =
    typeof slide.media === 'object' ? slide.media.url : ''

  return (
    <div className="story-overlay">
      <div className="story-container">
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

        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        {/* Media */}
        {slide.mediaType === 'image' ? (
          <img
            src={mediaUrl}
            alt=""
            className="story-media"
          />
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

        {/* Navigation */}
        <div className="nav left" onClick={prev} />
        <div className="nav right" onClick={next} />
      </div>
    </div>
  )
}
