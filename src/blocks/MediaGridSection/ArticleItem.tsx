const ArticleItem  = ({ articles, articleCategory }) => {
  const mid = Math.ceil(articles.length / 2)
  const leftCol = articles?.slice(0, mid)
  const rightCol = articles?.slice(mid)

  return (
    <>
      <div className="section-header">
        <h3 className="section-title">
          <a href="#">
            <span>{articleCategory}</span>
          </a>
        </h3>
      </div>

      <div className="nation-articles-wrapper grid grid-cols-2 gap-6 mt-3">

        {[leftCol, rightCol].map((col, idx) => (
          <div key={idx} className="nation-articles-column">
            {col?.map(article => (
              <article key={article.id} className="jeg_post">
                <div className="jeg_thumb">
                  <img
                    src={article.featuredImage?.url}
                    width={120}
                    height={86}
                    alt={article.title}
                  />
                </div>

                <div className="jeg_postblock_content">
                  <h3 className="jeg_post_title">
                    {article.title}
                  </h3>
                </div>
              </article>
            ))}
          </div>
        ))}

      </div>
    </>
    
  )
}

export default ArticleItem

