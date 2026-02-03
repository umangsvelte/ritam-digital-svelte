import Image from 'next/image'
import Link from 'next/link'
import '../css/home-page.css'

export default function FixedArticles({ articles }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      {articles.map((article) => (
        <article
          key={article.id}
          className="border rounded overflow-hidden shadow-sm hover:shadow-md transition"
        >
          <Link href={`/articles/${article.slug}`}>
            <div className="relative h-44">
              <Image
                src={article.featuredImage?.url}
                alt={article.title}
                fill
                className="object-cover transition-transform hover:scale-105"
              />

              {article.articleType?.name && (
                <span className="absolute top-2 left-2 bg-black text-white px-2 py-1 text-[11px] font-semibold uppercase rounded">
                  {article.articleType.name}
                </span>
              )}
            </div>

            <div className="p-3">
              <h3 className="text-sm font-semibold leading-snug hover:text-orange-500">
                {article.title}
              </h3>
            </div>
          </Link>
        </article>
      ))}
    </div>
  )
}
