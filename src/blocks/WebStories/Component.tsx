// 'use client'

// import { useState } from 'react'
// import StoryViewer from './StoryViewer'

// export default function WebStoriesComponent(props) {
//   const { title = 'Web Stories', stories = [] } = props

//   const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null)

//   // If no stories, render nothing (important safety)
//   if (!stories.length) return null

//   return (
//     <>
//       <section className="content-section web-stories-section mx-auto px-4 py-6 ">
//         <div className="section-header">
//           <h2 className="section-title">{title}</h2>
//         </div>

//         <div className="web-stories-slider">
//           {stories.map((story, index) => {
//             const firstSlide = story.slides?.[0]
//             const mediaUrl =
//               typeof firstSlide?.media === 'object'
//                 ? firstSlide.media.url
//                 : ''

//             return (
//               <div
//                 key={index}
//                 className="web-story-item"
//                 style={{ backgroundImage: `url(${mediaUrl})` }}
//                 onClick={() => setActiveStoryIndex(index)}
//               >
//                 <div className="web-story-text">
//                   {story.storyTitle}
//                 </div>
//               </div>
//             )
//           })}
//         </div>
//       </section>

//       {activeStoryIndex !== null && (
//         <StoryViewer
//           stories={stories}
//           startIndex={activeStoryIndex}
//           onClose={() => setActiveStoryIndex(null)}
//         />
//       )}
//     </>
//   )
// }


'use client'
import { useState } from 'react'
import StoryViewer from './StoryViewer'

export default function WebStoriesComponent(props: any) {
  const { title = 'Web Stories', stories = [] } = props
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null)

  if (!stories.length) return null

  return (
    <>
      <section className="content-section web-stories-section mx-auto px-4 py-6">
        <div className="section-header">
          <h2 className="section-title">{title}</h2>
        </div>

        <div className="web-stories-slider">
          {stories.map((story: any, index: number) => {
            const firstSlide = story.slides?.[0]
            const mediaUrl =
              typeof firstSlide?.media === 'object'
                ? firstSlide.media.url
                : ''

            return (
              <div
                key={index}
                className="web-story-item"
                style={{ backgroundImage: `url(${mediaUrl})` }}
                onClick={() => setActiveStoryIndex(index)}
              >
                <div className="web-story-text">
                  {story.storyTitle}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {activeStoryIndex !== null && (
        <StoryViewer
          stories={stories}
          startIndex={activeStoryIndex}
          onClose={() => setActiveStoryIndex(null)}
        />
      )}
    </>
  )
}
