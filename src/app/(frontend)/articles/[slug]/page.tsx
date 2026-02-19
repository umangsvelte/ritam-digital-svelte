import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import RichText from '@/components/RichText'
// import './css/article-detail-page.css'
import IncrementArticleView from '@/components/IncrementArticleView'

type PageProps = {
  params: Promise<{ slug: string }> // params is now a Promise
}

function getEmbedUrl(url: string) {
  if (!url) return null

  // YouTube
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId =
      url.split('v=')[1]?.split('&')[0] ||
      url.split('youtu.be/')[1]
    return `https://www.youtube.com/embed/${videoId}`
  }

  // Vimeo
  if (url.includes('vimeo.com')) {
    const videoId = url.split('vimeo.com/')[1]
    return `https://player.vimeo.com/video/${videoId}`
  }

  return null
}

function buildBreadcrumb(page: any) {
  const crumbs = []

  let current = page
  while (current) {
    crumbs.unshift({
      title: current.title,
      slug: current.slug,
    })
    current = current.parent
  }

  return crumbs
}

export default async function ArticleDetailPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  const payload = await getPayload({ config: configPromise })


  /* ---------------------------------------
     MAIN ARTICLE
  --------------------------------------- */
  const articleRes = await payload.find({
    collection: 'articles',
    where: {
      slug: { equals: slug },
    },
    limit: 1,
  })

  const article = articleRes.docs[0]
  if (!article) return notFound()

  const categoryId =
  typeof article.articleType === 'object'
    ? article.articleType.id
    : article.articleType

  const pageRes = await payload.find({
    collection: 'pages',
    where: {
      category: {
        equals: categoryId,
      },
    },
    depth: 2, // VERY IMPORTANT
    limit: 1,
  })

  const categoryPage = pageRes.docs[0] || null

  const breadcrumbs = categoryPage
  ? buildBreadcrumb(categoryPage)
  : []

  const formattedDate = new Date(article.publishedDate).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  /* ---------------------------------------
     RELATED ARTICLES (case-insensitive tags not yet implemented)
  --------------------------------------- */

    const relatedRes = await payload.find({
    collection: 'articles',
    where: {
      'tags.tag': { in: article.tags?.map((t) => t.tag) || [] },
      id: { not_equals: article.id },
    },
    limit: 5,
  })


  /* ---------------------------------------
     LATEST NEWS (sidebar)
  --------------------------------------- */
  const latestRes = await payload.find({
    collection: 'articles',
    where: {
      mediaType: { equals: 'image' },
    },
    sort: '-publishedDate',
    limit: 10,
  })

  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://www.example.com';
  const shareUrl = encodeURIComponent(`${siteUrl}/articles/${article.slug}`)
  const shareTitle = encodeURIComponent(article.title);

  // return (
  //   <div className='container blog-container'>
  //       <IncrementArticleView slug={article.slug} />
  //   <div className="blog-wrapper">
  //     {/* ================= MAIN CONTENT ================= */}
  //     <div className="blog-main-content">
  //       {/* Breadcrumbs */}
  //       <div className="breadcrumbs">
  //         <span><Link href="/">Home</Link></span>
  //         {/* <i className="fa fa-angle-right" /> */}
  //         {breadcrumbs.map((crumb, index) => (
  //           <span key={crumb.slug}>
  //             <i className="fa fa-angle-right" />
  //             <Link href={`/${crumb.slug}`}>
  //               {crumb.title}
  //             </Link>
  //           </span>
  //         ))}
  //         {/* <span>{article.title}</span> */}
  //       </div>

  //       {/* Header */}
  //       <div className="article-header">
  //         <h1 className="article-title">{article.title}</h1>

  //         <div className="article-meta">
  //           <div className="meta-left">
  //             <div className="author-info">
  //               <img
  //                 src="/author-placeholder.jpg"
  //                 className="author-avatar"
  //                 alt={article.author_name}
  //               />
  //               <span className="meta-text">by</span>
  //               <span className="author-name">{article.author_name}</span>
  //             </div>

  //             <div className="article-date">
  //               <span>{formattedDate} IST</span>
  //             </div>
  //           </div>
  //         </div>
  //       </div>

  //       {/* Featured Image and Video*/}
  //       {article.mediaType === 'image' && article.featuredImage?.url && (
  //         <div className="featured-image">
  //           <img
  //             src={article.featuredImage.url}
  //             alt={article.featuredImage.caption || article.title}
  //           />
  //           {article.featuredImage.caption && (
  //             <p className="image-caption">
  //               {article.featuredImage.caption}
  //             </p>
  //           )}
  //         </div>
  //       )}

  //       {article.mediaType === 'video' && article.featuredVideoUrl && (
  //         <div className="featured-video">
  //           <iframe
  //             src={getEmbedUrl(article.featuredVideoUrl)}
  //             width="100%"
  //             height="450"
  //             frameBorder="0"
  //             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  //             allowFullScreen
  //             title={article.title}
  //           />
  //         </div>
  //       )}

  //       {/* Content */}
  //       <div className="article-content">
  //         <div className="content-inner">
  //           {article?.excerpt?.root ? (
  //                 <RichText data={article.excerpt} enableGutter={false} />
  //               ) : (
  //                 'No excerpt available.'
  //               )}

  //           {/* Tags */}
  //           {article.tags?.length > 0 && (
  //             <div className="article-tags">
  //               <span>Tags:</span>
  //               {article.tags.map((tag: string) => (
  //                 <Link key={tag.tag} href={`/tag/${tag.tag.toLowerCase()}`} rel="tag">
  //                   {tag.tag}
  //                 </Link>
  //               ))}
  //             </div>
  //           )}
  //         </div>
  //       </div>

  //        {/* =============  Social Share Bottom =========== */}
  //       <div className="social-share-bottom">
  //           <div className="share-buttons">
  //               <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} className="share-btn facebook" rel="noopener noreferrer" target="_blank">
  //                   <i className="fa fa-facebook-official"></i>
  //                   <span>Share</span>
  //               </a>
  //               <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`} className="share-btn twitter" rel="noopener noreferrer" target="_blank">
  //                   <i className="fa fa-twitter"></i>
  //                   <span>Tweet</span>
  //               </a>
  //               <a href={`https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrl}`} className="share-btn whatsapp" rel="noopener noreferrer" target="_blank">
  //                   <i className="fa fa-whatsapp"></i>
  //                   <span>Send</span>
  //               </a>
  //               <a href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`} className="share-btn telegram" rel="noopener noreferrer" target="_blank">
  //                   <i className="fa fa-telegram"></i>
  //                   <span>Share</span>
  //               </a>
  //           </div>
  //       </div>

  //       {/* ================= RELATED NEWS ================= */}
  //       {relatedRes.docs.length > 0 && (
  //         <div className="related-news">
  //           <div className="section-header">
  //             <h3 className="section-title">
  //               <span>Related <strong>News</strong></span>
  //             </h3>
  //           </div>

  //           <div className="related-articles">
  //             {relatedRes.docs.map(rel => (
  //               <article key={rel.id} className="related-article">
  //                 <div className="related-thumb">
  //                   <Link href={`/articles/${rel.slug}`}>
  //                     <img src={rel.featuredImage?.url || rel.videoThumbnail?.url || ''} alt={rel.title} />
  //                   </Link>
  //                   <div className="related-category">
  //                     <span><a href="#">{rel.articleType?.name}</a></span>
  //                   </div>
  //                 </div>

  //                 <div className="related-content">
  //                   <h3 className="related-title">
  //                     <Link href={`/articles/${rel.slug}`}>
  //                       {rel.title}
  //                     </Link>
  //                   </h3>
  //                 </div>
  //               </article>
  //             ))}
  //           </div>
  //         </div>
  //       )}
  //     </div>

  //     {/* ================= SIDEBAR ================= */}
  //     <aside className="blog-sidebar">
  //       <div className="sidebar-widget">
  //         <div className="widget-header">
  //           <h3 className="widget-title">Latest News</h3>
  //         </div>

  //         <div className="widget-content">
  //           {latestRes.docs.map(item => (
  //             <article key={item.id} className="sidebar-article">
  //               <div className="sidebar-thumb">
  //                 <Link href={`/articles/${item.slug}`}>
  //                   <img src={item.featuredImage?.url} alt={item.title} />
  //                 </Link>
  //               </div>

  //               <div className="sidebar-content">
  //                 <h3 className="sidebar-title">
  //                   <Link href={`/articles/${item.slug}`}>
  //                     {item.title}
  //                   </Link>
  //                 </h3>
  //               </div>
  //             </article>
  //           ))}
  //         </div>
  //       </div>
  //     </aside>
  //   </div>
  //   </div>
  // )

  return (
    <div className="container main">
      <IncrementArticleView slug={article.slug} />

      {/* ================= LEFT CONTENT ================= */}
      <div className="content">

        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link href="/">Home</Link>
          {breadcrumbs.map((crumb) => (
            <span key={crumb.slug}>
              {' > '}
              <Link href={`/${crumb.slug}`}>
                {crumb.title}
              </Link>
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="article-title">{article.title}</h1>

        {/* Meta Line */}
        <div className="meta-line">
          <img
            src="/author-placeholder.jpg"
            alt={article.author?.name || 'Author'}
            className="author-img"
          />
          <span className="meta">{article.author?.name}</span>
          <span className="meta-date">
            — {formattedDate} IST
          </span>
        </div>

        <div className="hr" />

        {/* Featured Media */}
        {article.mediaType === 'image' && article.featuredImage?.url && (
          <div className="feature-img">
            <img
              src={article.featuredImage.url}
              alt={article.title}
            />
          </div>
        )}

        {article.mediaType === 'video' && article.featuredVideoUrl && (
          <div className="feature-img">
            <iframe
              src={getEmbedUrl(article.featuredVideoUrl)}
              width="100%"
              height="450"
              frameBorder="0"
              allowFullScreen
            />
          </div>
        )}

        {/* Social Buttons (Top) */}
        <div className="social-buttons">
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} className="fb" target="_blank">
            <i className="fab fa-facebook-f"></i>
            <span>Facebook</span>
          </a>

          <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`} className="tw" target="_blank">
            <i className="fab fa-twitter"></i>
            <span>Twitter</span>
          </a>

          <a href={`https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrl}`} className="wa" target="_blank">
            <i className="fab fa-whatsapp"></i>
            <span>WhatsApp</span>
          </a>

          <a href={`https://t.me/share/url?url=${shareUrl}&text=${shareTitle}`} className="tg" target="_blank">
            <i className="fab fa-telegram-plane"></i>
            <span>Telegram</span>
          </a>
        </div>

        {/* Article Content */}
        <div className="article">
          {article?.excerpt?.root ? (
            <RichText data={article.excerpt} enableGutter={false} />
          ) : (
            'No content available.'
          )}
        </div>

        {/* Social Buttons (Bottom) */}
        <div className="social-buttons">
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} className="fb" target="_blank">
            <i className="fab fa-facebook-f"></i>
            <span>Share</span>
          </a>

          <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`} className="tw" target="_blank">
            <i className="fab fa-twitter"></i>
            <span>Tweet</span>
          </a>

          <a href={`https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrl}`} className="wa" target="_blank">
            <i className="fab fa-whatsapp"></i>
            <span>Send</span>
          </a>

          <a href={`https://t.me/share/url?url=${shareUrl}&text=${shareTitle}`} className="tg" target="_blank">
            <i className="fab fa-telegram-plane"></i>
            <span>Share</span>
          </a>
        </div>

        {/* Tags */}
        {article.tags?.length > 0 && (
          <div className="tags-line">
            <span className="tags-label">Tags:</span>
            {article.tags.map(tag => (
              <Link
                key={tag.tag}
                href={`/tag/${tag.tag.toLowerCase()}`}
                className="tag-detail"
              >
                {tag.tag}
              </Link>
            ))}
          </div>
        )}

        {/* ================= RELATED NEWS ================= */}
        {relatedRes.docs.length > 0 && (
          <>
            <div className="section-header-line">
              <div className="section-title">Related News</div>
            </div>

            <div className="related-grid">
              {relatedRes.docs.map(rel => (
                <div key={rel.id} className="news-card">
                  <div className="image-wrapper">
                    <Link href={`/articles/${rel.slug}`}>
                      <img
                        src={rel.featuredImage?.url || rel.videoThumbnail?.url || ''}
                        alt={rel.title}
                      />
                    </Link>
                    <div className="badge">
                      {rel.articleType?.name}
                    </div>
                  </div>
                  <div className="news-title">
                    <Link href={`/articles/${rel.slug}`}>
                      {rel.title}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

      </div>

      {/* ================= RIGHT SIDEBAR ================= */}
      <div className="sidebar">
        <div className="latest-box">
          <div className="section-header-line">
            <div className="latest-title">Latest News</div>
          </div>

          {latestRes.docs.map(item => (
            <div key={item.id} className="latest-item">
              <Link href={`/articles/${item.slug}`}>
                <img src={item.featuredImage?.url || ''} alt={item.title} />
              </Link>
              <p>
                <Link href={`/articles/${item.slug}`}>
                  {item.title}
                </Link>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

}
