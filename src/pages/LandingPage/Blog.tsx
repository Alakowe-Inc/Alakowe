import { useState } from 'react'
import { Link } from 'react-router-dom'
import { blogPosts } from '../../data/mockData'

const categories = ['All', 'Reading Culture', 'Nigerian Authors', 'Why Used Books']

function Blog() {
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered =
    activeCategory === 'All'
      ? blogPosts
      : blogPosts.filter(p => p.category === activeCategory)

  return (
    <div className="min-h-screen bg-third">

      {/* Header */}
      <div className="bg-main text-white min-h-[50vh] flex items-center justify-center py-20">
        <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-12 w-full text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-3">
            Our Blog
          </p>
          <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">
            Stories &amp; Insights
          </h1>
          <p className="text-white/55 max-w-lg text-sm leading-relaxed mx-auto">
            Thoughts on reading, Nigerian literature, and why good books deserve a second life.
          </p>
        </div>
      </div>

      <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-12 py-12">

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 text-xs font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${activeCategory === cat
                ? 'bg-main text-white'
                : 'bg-secondary/15 text-main/55 hover:bg-secondary/15 hover:text-main'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(post => (
            <Link
              key={post.id}
              to={`/blog/${post.id}`}
              className="group flex flex-col"
            >
              <div className="overflow-hidden aspect-video bg-secondary/10 flex items-center justify-center mb-5">
                <span className="font-heading font-bold text-8xl text-secondary/20 group-hover:text-secondary/35 group-hover:scale-110 transition-all duration-500 select-none">
                  ✦
                </span>
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-main/40 mb-3">
                {post.date}
              </p>
              <h3 className="font-heading font-bold text-main text-lg leading-snug mb-3 group-hover:text-secondary transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="text-sm text-main/55 leading-relaxed line-clamp-2 flex-1">
                {post.excerpt}
              </p>
              <span className="mt-4 text-sm font-semibold text-main/60 group-hover:text-secondary transition-colors underline underline-offset-4 decoration-main/20 group-hover:decoration-secondary">
                Read more
              </span>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="font-heading font-semibold text-main text-xl mb-2">No posts yet</p>
            <p className="text-main/55 text-sm">Check back soon.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Blog
