import { Link } from 'react-router-dom'
import { blogPosts } from '../data/mockData'

function BlogSection() {
  return (
    <section className="py-12 bg-third">
      <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-12">

        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-secondary text-xs font-semibold uppercase tracking-[0.2em] mb-4">
              Our Blog
            </p>
            <h2 className="font-heading font-bold text-main text-4xl md:text-5xl max-w-md leading-tight">
              Stories &amp; Insights
            </h2>
          </div>
          <Link
            to="/blog"
            className="hidden md:flex underline underline-offset-4 items-center gap-2 text-sm font-semibold text-main/50 hover:text-main transition-colors"
          >
            View all posts
          </Link>
        </div>

        {/* Blog cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.slice(0, 3).map(post => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="group flex flex-col"
            >
              {/* Image area */}
              <div className="overflow-hidden aspect-video bg-secondary/10 flex items-center justify-center mb-5">
                <span className="font-heading font-bold text-8xl text-secondary/20 group-hover:text-secondary/35 group-hover:scale-110 transition-all duration-500 select-none">
                  ✦
                </span>
              </div>

              {/* Meta */}
              <p className="text-[10px] font-semibold uppercase tracking-widest text-main/40 mb-3">
                {post.date}
              </p>

              {/* Title */}
              <h3 className="font-heading font-bold text-main text-lg leading-snug mb-3 group-hover:text-secondary transition-colors line-clamp-2">
                {post.title}
              </h3>

              {/* Excerpt */}
              <p className="text-sm text-main/55 leading-relaxed line-clamp-2 flex-1">
                {post.excerpt}
              </p>

              {/* Read more */}
              <span className="mt-4 text-sm font-semibold text-main/60 group-hover:text-secondary transition-colors underline underline-offset-4 decoration-main/20 group-hover:decoration-secondary">
                Read more
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BlogSection
