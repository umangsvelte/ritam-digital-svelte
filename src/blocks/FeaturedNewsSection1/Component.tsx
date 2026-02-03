import { getPayload } from 'payload'
import configPromise from '@payload-config'
import HeroSlider from './HeroSlider'
import FixedArticles from './FixedArticles'
import TopNews from './TopNews'
import '../css/home-page.css'

export const FeaturedNewsSection1Block = async ({
  featuredArticles,
  fixedArticles,
  topNews,
  bgColor
}: any) => {
  const payload = await getPayload({ config: configPromise })

  const topNewsRes = await payload.find({
    collection: 'articles',
    sort: '-views',
    limit: 7,
    where: {
      mediaType: { equals: 'image' }, // optional
    },
  })
  return (
    <section className="mx-auto px-4 py-6" style={{ backgroundColor: bgColor || '#ffffff' }}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT */}
        <div className="lg:col-span-8 space-y-6">
            <div className="section-header">
                <h2 className="section-title"><a href="#">Latest News</a></h2>
            </div>
          <HeroSlider articles={featuredArticles} />
          <FixedArticles articles={fixedArticles} />
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-4">
          <TopNews articles={topNewsRes.docs} />
        </div>

      </div>
    </section>
  )
}
