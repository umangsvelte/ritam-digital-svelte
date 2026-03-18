import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import RichText from '@/components/RichText'
// import './css/article-detail-page.css'
import IncrementArticleView from '@/components/IncrementArticleView'
import TwitterEmbed from '@/components/TwitterEmbed'
import { draftMode } from 'next/headers'
import Image from 'next/image'
import TextToSpeech from '@/utils/TextToSpeech'
import { extractTextFromRichText } from '@/utils/extractRichText'
import { getCategorySlug } from '@/utils/getCategorySlug'

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

export default async function ArticleDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ preview?: string }>
}) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })


  /* ---------------------------------------
     MAIN ARTICLE
  --------------------------------------- */
  const articleRes = await payload.find({
    collection: 'articles',
    where: {
      and: [
        {
          slug: { equals: slug },
        },
        {
          mediaType: { equals: 'video' },
        },
      ],
    },
    limit: 1,
    depth: 1,
  })

  const article = articleRes.docs[0]
  if (!article) return notFound()

  const categoryIds =
  article.articleType?.map((cat: any) =>
    typeof cat === 'object' ? cat.id : cat
  ) || []

  const pageRes = await payload.find({
    collection: 'pages',
    where: {
      category: {
        in: categoryIds,
      },
    },
    depth: 2,
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

  const tagIDs =
    article.tags?.map((t: any) =>
      typeof t === 'object' ? t.id : t
    ) || []

    const relatedRes = await payload.find({
      collection: 'articles',
      where: {
        and: [
          {
            tags: { in: tagIDs },
          },
          {
            id: { not_equals: article.id },
          },
          {
            _status: { equals: 'published' },
          },
          {
            mediaType: { equals: 'video' },
          },
        ],
      },
      sort: '-publishedDate',
      limit: 5,
    })


  /* ---------------------------------------
     LATEST NEWS (sidebar)
  --------------------------------------- */
  const latestRes = await payload.find({
    collection: 'articles',
    where: {
      mediaType: { equals: 'video' },
    },
    sort: '-publishedDate',
    limit: 10,
  })

  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://www.example.com';
  const shareUrl = encodeURIComponent(`${siteUrl}/videos/${article.slug}`)
  const shareTitle = encodeURIComponent(article.title);
  const { preview } = await searchParams
  const { isEnabled } = await draftMode()

  const isPreview = isEnabled && preview === 'true'
  

  return (
    <div className="container main">
      <IncrementArticleView slug={article.slug} isPreview={isPreview}/>

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
            {/* <span className='justify-center'>{article.featuredImage.alt}</span>
            <span className='justify-center'>{article?.featuredImage.caption?.root ? (
            <RichText data={article.featuredImage?.caption} enableGutter={false} />
          ) : (
            ''
          )}</span> */}
            {/* {article.featuredImage.caption} */}
          </div>
        )}
        {article?.featuredImage && (
          <div className="text-center mt-2 text-sm text-gray-600">
            
            {article.featuredImage?.alt && (
              <div className="font-medium">{article.featuredImage.alt}</div>
            )}

            {article.featuredImage?.caption?.root && (
              <div className="italic">
                <RichText
                  data={article.featuredImage.caption}
                  enableGutter={false}
                />
              </div>
            )}

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
        {/* <TextToSpeech text={plainText} /> */}
        <div className="article">
          {article?.content?.root ? (
            <RichText data={article.content} enableGutter={false} />
          ) : (
            'No content available.'
          )}
        </div>

        {/* Tags */}
        {article.tags?.length > 0 && (
          <div className="tags-line">
            <span className="tags-label">Tags:</span>
            {article.tags.map((tag: any) => (
              <Link
                key={tag.id}
                // href={`/tag/${tag.slug}`}
                href="#"
                className="tag-detail"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        )}

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

        

        {/* ================= RELATED NEWS ================= */}
        {relatedRes.docs.length > 0 && (
          <>
            <div className="section-header-line">
              <div className="section-title">Related News</div>
            </div>

            <div className="related-grid">
              {relatedRes.docs.map((rel, index) => {
                // Determine if it's a large card (first 2) or small card
                const isLargeCard = index < 2;
                const relCategory = getCategorySlug(rel)
                
                return (
                  <div key={rel.id} className="news-card">
                    <div className="image-wrapper">
                      <Link href={rel.mediaType === 'image' ? `/articles/${relCategory}/${rel.slug}` : `/videos/${relCategory}/${rel.slug}`}>
                        <div className={`related-image-container ${isLargeCard ? 'large' : 'small'}`}>
                          <Image
                            src={rel.featuredImage?.url || rel.videoThumbnail?.url || ''}
                            alt={rel.title}
                            fill
                            sizes={isLargeCard ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
                            style={{
                              objectFit: 'cover'
                            }}
                          />
                        </div>
                      </Link>
                      <div className="badge">
                        {rel.articleType?.name}
                      </div>
                    </div>
                    <div className="news-title">
                      <Link href={rel.mediaType === 'image' ? `/articles/${relCategory}/${rel.slug}` : `/videos/${relCategory}/${rel.slug}`}>
                        {rel.title}
                      </Link>
                    </div>
                  </div>
                );
              })}
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

          {latestRes.docs.map((item) => {

            const categoryName =
              Array.isArray(item.articleType) &&
              typeof item.articleType[0] === 'object'
                ? item.articleType[0].name
                : ''

            const categorySlug = categoryName
              .toLowerCase()
              .replace(/\s+/g, '-')

            const articleUrl =
              item.mediaType === 'image'
                ? `/articles/${categorySlug}/${item.slug}`
                : `/videos/${categorySlug}/${item.slug}`

            return (
              <div key={item.id} className="latest-item">
                <div className="latest-image-container">
                  <Link href={articleUrl}>
                    {(item.featuredImage?.url || item.videoThumbnail?.url) && (
                    <Image
                      src={item.featuredImage?.url || item.videoThumbnail?.url}
                      alt={item.title}
                      width={100}
                      height={70}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  )}
                  </Link>
                </div>

                <p>
                  <Link href={articleUrl}>
                    {item.title}
                  </Link>
                </p>
              </div>
            )
          })}

          {/* {latestRes.docs.map(item => (
            
            <div key={item.id} className="latest-item">
              <div className="latest-image-container">
                <Link href={item.mediaType === 'image' ? `/articles/${item.slug}` : `/videos/${item.slug}`}>
                  {(item.featuredImage?.url || item.videoThumbnail?.url) && (
                    <Image
                      src={item.featuredImage?.url || item.videoThumbnail?.url}
                      alt={item.title}
                      width={100}
                      height={70}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  )}
                </Link>
              </div>
              <p>
                <Link href={item.mediaType === 'image' ? `/articles/${item.slug}` : `/videos/${item.slug}`}>
                  {item.title}
                </Link>
              </p>
            </div>
          ))} */}
        </div>
      </div>
    </div>
  )

}
