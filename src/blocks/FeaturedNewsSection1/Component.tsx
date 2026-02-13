import { getPayload } from 'payload'
import configPromise from '@payload-config'
import HeroSlider from './HeroSlider'
import FixedArticles from './FixedArticles'
// import TopNews from './TopNews'
import '../css/home-page.css'

export const FeaturedNewsSection1Block = async ({
  featuredArticles,
  fixedArticles,
  bgColor
}: any) => {
  const payload = await getPayload({ config: configPromise })

  return (
    <section
      className="w-full"
      style={{ backgroundColor: bgColor || '#ffffff' }}
    >
      <div className="space-y-6">
        <div className="section-header">
          <h2 className="section-title">
            <a href="#">Latest News</a>
          </h2>
        </div>

        <HeroSlider articles={featuredArticles} />
        <FixedArticles articles={fixedArticles} />
      </div>
    </section>
  )
}
