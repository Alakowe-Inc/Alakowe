import { useState } from 'react'
import { Link } from 'react-router-dom'
import { blogPosts } from '../data/mockData'

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
      <div className="bg-main text-white py-16">
        <div className="max-w-8xl mx-auto px-4 md:px-6 lg:px-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-3">
            Our Blog
          </p>
          <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">
            Stories &amp; Insights
          </h1>
          <p className="text-white/55 max-w-lg mx-auto text-sm leading-relaxed">
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
              className={`text-xs font-semibold px-4 py-2 rounded-full border transition-colors ${activeCategory === cat
                ? 'bg-main text-white border-main'
                : 'bg-white text-main border-third hover:border-main'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(post => (
            <Link
              key={post.id}
              to={`/blog/${post.id}`}
              className="group bg-white rounded-2xl overflow-hidden border border-third hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="h-48 bg-secondary/15 flex items-center justify-center">
                <span className="font-heading font-bold text-6xl text-secondary/40 select-none">
                  ✦
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-semibold text-secondary bg-secondary/15 px-2.5 py-0.5 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-xs text-main/40">{post.readTime}</span>
                </div>
                <h2 className="font-heading font-semibold text-main text-lg leading-snug mb-2 group-hover:text-secondary transition-colors line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-sm text-main/55 line-clamp-3 leading-relaxed mb-4">
                  {post.excerpt}
                </p>
                <p className="text-xs text-main/35">{post.date}</p>
              </div>
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
