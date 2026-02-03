// export default function LatestNationalNews() {
//   return (
//     <div className="jeg_wrapper wpb_wrapper">
//       <div className="jeg_block_heading jeg_block_heading_1 jeg_alignleft">
//         <h3 className="jeg_block_title">
//           <a href="#"><span>Latest National News</span></a>
//         </h3>
//       </div>

//       <div
//         className="row vc_row wpb_row vc_inner vc_row-fluid"
//         style={{ display: 'flex', gap: '30px', marginBottom: '40px' }}
//       >
//         {/* LEFT COLUMN */}
//         <div
//           className="wpb_column vc_column_container vc_col-sm-8"
//           style={{ flex: '0 0 calc(66.667% - 15px)' }}
//         >
//           <div className="jeg_wrapper">
//             <div className="wpb_wrapper">
//               <div className="jeg_postblock_8 jeg_postblock jeg_col_2o3">
//                 <div className="jeg_block_container">
//                   <div className="jeg_posts_wrap">
//                     <div className="jeg_posts jeg_load_more_flag">

//                       {/* ARTICLE */}
//                       <article className="jeg_post jeg_pl_md_1 format-standard">
//                         <div className="jeg_thumb">
//                           <a href="#">
//                             <div className="thumbnail-container size-500">
//                               <img
//                                 width="360"
//                                 height="180"
//                                 src="https://ritamdigital.com/wp-content/uploads/2026/01/photo-credit-the-narrative-world-360x180.jpg"
//                                 alt=""
//                               />
//                             </div>
//                           </a>
//                           <div className="jeg_post_category">
//                             <span><a href="#" className="category-nation">Nation</a></span>
//                           </div>
//                         </div>
//                         <div className="jeg_postblock_content">
//                           <h3 className="jeg_post_title">
//                             <a href="#">
//                               Kashmir Black Day: When Kashmiri Hindus Became Refugees in Their Own Homeland Following Grave Islamic Terror
//                             </a>
//                           </h3>
//                         </div>
//                       </article>

//                       {/* Repeat same structure for other articles */}

//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* RIGHT COLUMN */}
//         <div
//           className="wpb_column vc_column_container vc_col-sm-4"
//           style={{ flex: '0 0 calc(33.333% - 15px)' }}
//         >
//           <div className="jeg_wrapper">
//             <div className="wpb_wrapper">
//               <div className="jeg_postblock_3 jeg_postblock jeg_col_1o3">
//                 <div className="jeg_posts jeg_block_container">
//                   <div className="jeg_posts jeg_load_more_flag">

//                     <article className="jeg_post jeg_pl_md_2 format-standard">
//                       <div className="jeg_thumb">
//                         <a href="#">
//                           <div className="thumbnail-container size-715">
//                             <img
//                               width="120"
//                               height="86"
//                               src="https://ritamdigital.com/wp-content/uploads/2026/01/k9-fi-120x86.jpg"
//                               alt=""
//                             />
//                           </div>
//                         </a>
//                       </div>
//                       <div className="jeg_postblock_content">
//                         <h3 className="jeg_post_title">
//                           <a href="#">
//                             The Desert Cannon That Roars Even on Snowy Peaks: Discover the Unique Story of K9 Vajra
//                           </a>
//                         </h3>
//                         <div className="jeg_post_excerpt">
//                           <p></p>
//                         </div>
//                       </div>
//                     </article>

//                     {/* Repeat remaining right-side articles */}

//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   )
// }

import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Article } from '@/payload-types'
import '../css/nation-page.css'

type Props = {
  title: string
  category: string | { id: string }
}

export const LatestNationalNewsComponent = async ({ title, category }: Props) => {
  const payload = await getPayload({ config })

  const categoryId =
    typeof category === 'object' ? category.id : category

  const { docs: articles } = await payload.find({
    collection: 'articles',
    where: {
      articleType: { equals: categoryId },
      mediaType: { equals: 'image' },
    },
    sort: '-publishedDate',
    limit: 9,
  })

  const leftArticles = articles.slice(0, 5) // 2 + 3 layout
  const rightArticles = articles.slice(5, 9)

  return (
    <div className="jeg_wrapper wpb_wrapper mx-auto px-4 py-6 ">
      {/* Heading */}
      <div className="jeg_block_heading jeg_block_heading_1 jeg_alignleft">
        <h3 className="jeg_block_title">
          <a href="#"><span>{title}</span></a>
        </h3>
      </div>

      {/* Main Row */}
      <div
        className="row vc_row wpb_row vc_inner vc_row-fluid"
        style={{ display: 'flex', gap: '30px', marginBottom: '40px' }}
      >
        {/* LEFT COLUMN (2/3) */}
        <div
          className="wpb_column vc_column_container vc_col-sm-8"
          style={{ flex: '0 0 calc(66.667% - 15px)' }}
        >
          <div className="jeg_wrapper">
            <div className="wpb_wrapper">
              <div className="jeg_postblock_8 jeg_postblock jeg_col_2o3">
                <div className="jeg_block_container">
                  <div className="jeg_posts_wrap">
                    <div className="jeg_posts jeg_load_more_flag">
                      {leftArticles.map((article: Article, index) => {
                        const image =
                          typeof article.featuredImage === 'object'
                            ? article.featuredImage.url
                            : ''

                        const TitleTag = index === 4 ? 'h4' : 'h3'

                        return (
                          <article
                            key={article.id}
                            className="jeg_post jeg_pl_md_1 format-standard"
                          >
                            <div className="jeg_thumb">
                              <Link href={`/articles/${article.slug}`}>
                                <div className="thumbnail-container size-500">
                                  <img
                                    width="360"
                                    height="180"
                                    src={image}
                                    className="attachment-jnews-360x180 size-jnews-360x180 wp-post-image"
                                    alt={article.title}
                                  />
                                </div>
                              </Link>

                              <div className="jeg_post_category">
                                <span>
                                  <a href="#" className="category-nation">
                                    {article.articleType?.name || 'NATION'}
                                  </a>
                                </span>
                              </div>
                            </div>

                            <div className="jeg_postblock_content">
                              <TitleTag className="jeg_post_title">
                                <Link href={`/articles/${article.slug}`}>
                                  {article.title}
                                </Link>
                              </TitleTag>
                            </div>
                          </article>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (1/3) */}
        <div
          className="wpb_column vc_column_container vc_col-sm-4"
          style={{ flex: '0 0 calc(33.333% - 15px)' }}
        >
          <div className="jeg_wrapper">
            <div className="wpb_wrapper">
              <div className="jeg_postblock_3 jeg_postblock jeg_col_1o3">
                <div className="jeg_posts jeg_block_container">
                  <div className="jeg_posts jeg_load_more_flag">
                    {rightArticles.map((article: Article) => {
                      const image =
                        typeof article.featuredImage === 'object'
                          ? article.featuredImage.url
                          : ''

                      return (
                        <article
                          key={article.id}
                          className="jeg_post jeg_pl_md_2 format-standard"
                        >
                          <div className="jeg_thumb">
                            <Link href={`/articles/${article.slug}`}>
                              <div className="thumbnail-container size-715">
                                <img
                                  width="120"
                                  height="86"
                                  src={image}
                                  className="attachment-jnews-120x86 size-jnews-120x86 wp-post-image"
                                  alt={article.title}
                                />
                              </div>
                            </Link>
                          </div>

                          <div className="jeg_postblock_content">
                            <h3 className="jeg_post_title">
                              <Link href={`/articles/${article.slug}`}>
                                {article.title}
                              </Link>
                            </h3>
                            <div className="jeg_post_excerpt">
                              <p></p>
                            </div>
                          </div>
                        </article>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
