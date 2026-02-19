import HeroSlider from './HeroSlider'
import FixedArticles from './FixedArticles'

export const FeaturedNewsSection1Block = ({
  featuredArticles,
  fixedArticles,
  bgColor,
}: any) => {
  if (!featuredArticles?.length) return null

  return (
    <section
      className="latest-news-section"
      // style={{ backgroundColor: bgColor || '#ffffff' }}
    >
      <div className="section-header-line">
        <h2 className="section-heading">
          Latest News
        </h2>
      </div>

      <div className="featured-news-grid">
        {/* Featured Slider */}
        <HeroSlider articles={featuredArticles} />

        {/* Sub Articles Row */}
        <FixedArticles articles={fixedArticles} />
      </div>
    </section>
  )
}
