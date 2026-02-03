import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
// import { RichText } from '@payloadcms/richtext-lexical/react'
import RichText from '@/components/RichText'
import './css/article-detail-page.css'
import IncrementArticleView from '@/components/IncrementArticleView'

type PageProps = {
  params: Promise<{ slug: string }> // params is now a Promise
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
    limit: 6,
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

  return (
    <div className='container blog-container'>
        <IncrementArticleView slug={article.slug} />
    <div className="blog-wrapper">
      {/* ================= MAIN CONTENT ================= */}
      <div className="blog-main-content">
        {/* Breadcrumbs */}
        <div className="breadcrumbs">
          <span><Link href="/">Home</Link></span>
          <i className="fa fa-angle-right" />
          {article.articleType && (
            <>
              <span>
                {/* <Link href={`/category/${article.articleType.slug}`}>
                  {article.articleType.name}
                </Link> */}
                <Link href={`/nation`}>
                  Nation
                </Link>
              </span>
              <i className="fa fa-angle-right" />
            </>
          )}
          {/* <span>{article.title}</span> */}
        </div>

        {/* Header */}
        <div className="article-header">
          <h1 className="article-title">{article.title}</h1>

          <div className="article-meta">
            <div className="meta-left">
              <div className="author-info">
                <img
                  src="/author-placeholder.jpg"
                  className="author-avatar"
                  alt={article.author_name}
                />
                <span className="meta-text">by</span>
                <span className="author-name">{article.author_name}</span>
              </div>

              <div className="article-date">
                <span>{formattedDate} IST</span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {article.featuredImage?.url && (
          <div className="featured-image">
            <img
              src={article.featuredImage.url}
              alt={article.featuredImage.caption || article.title}
            />
            {article.featuredImage.caption && (
              <p className="image-caption">
                {article.featuredImage.caption}
              </p>
            )}
          </div>
        )}

        {/* Content */}
        <div className="article-content">
          <div className="content-inner">
            {article?.excerpt?.root ? (
                  <RichText data={article.excerpt} enableGutter={false} />
                ) : (
                  'No excerpt available.'
                )}

            {/* Tags */}
            {article.tags?.length > 0 && (
              <div className="article-tags">
                <span>Tags:</span>
                {article.tags.map((tag: string) => (
                  <Link key={tag.tag} href={`/tag/${tag.tag.toLowerCase()}`} rel="tag">
                    {tag.tag}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

         {/* =============  Social Share Bottom =========== */}
        <div className="social-share-bottom">
            <div className="share-buttons">
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} className="share-btn facebook" rel="noopener noreferrer" target="_blank">
                    <i className="fa fa-facebook-official"></i>
                    <span>Share</span>
                </a>
                <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`} className="share-btn twitter" rel="noopener noreferrer" target="_blank">
                    <i className="fa fa-twitter"></i>
                    <span>Tweet</span>
                </a>
                <a href={`https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrl}`} className="share-btn whatsapp" rel="noopener noreferrer" target="_blank">
                    <i className="fa fa-whatsapp"></i>
                    <span>Send</span>
                </a>
                <a href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`} className="share-btn telegram" rel="noopener noreferrer" target="_blank">
                    <i className="fa fa-telegram"></i>
                    <span>Share</span>
                </a>
            </div>
        </div>

        {/* ================= RELATED NEWS ================= */}
        {relatedRes.docs.length > 0 && (
          <div className="related-news">
            <div className="section-header">
              <h3 className="section-title">
                <span>Related <strong>News</strong></span>
              </h3>
            </div>

            <div className="related-articles">
              {relatedRes.docs.map(rel => (
                <article key={rel.id} className="related-article">
                  <div className="related-thumb">
                    <Link href={`/articles/${rel.slug}`}>
                      <img src={rel.featuredImage?.url} alt={rel.title} />
                    </Link>
                    <div className="related-category">
                      <span><a href="#">{rel.articleType?.name}</a></span>
                    </div>
                  </div>

                  <div className="related-content">
                    <h3 className="related-title">
                      <Link href={`/articles/${rel.slug}`}>
                        {rel.title}
                      </Link>
                    </h3>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ================= SIDEBAR ================= */}
      <aside className="blog-sidebar">
        <div className="sidebar-widget">
          <div className="widget-header">
            <h3 className="widget-title">Latest News</h3>
          </div>

          <div className="widget-content">
            {latestRes.docs.map(item => (
              <article key={item.id} className="sidebar-article">
                <div className="sidebar-thumb">
                  <Link href={`/articles/${item.slug}`}>
                    <img src={item.featuredImage?.url} alt={item.title} />
                  </Link>
                </div>

                <div className="sidebar-content">
                  <h3 className="sidebar-title">
                    <Link href={`/articles/${item.slug}`}>
                      {item.title}
                    </Link>
                  </h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </aside>
    </div>
    </div>
  )
}
