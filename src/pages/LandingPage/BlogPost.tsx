import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Clock, Tag } from 'lucide-react'
import { blogPosts } from '../../data/mockData'

function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const post = blogPosts.find(p => p.slug === slug)
  const others = blogPosts.filter(p => p.slug !== slug).slice(0, 3)

  if (!post) {
    return (
      <div className="min-h-screen bg-third flex flex-col items-center justify-center px-4 text-center">
        <p className="font-heading font-bold text-main text-2xl mb-2">Post not found</p>
        <p className="text-main/50 text-sm mb-8">This article doesn't exist or may have been removed.</p>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 bg-secondary text-white font-semibold text-xs uppercase tracking-widest px-7 py-3 rounded-xl hover:bg-secondary/85 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Blog
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <div className="bg-secondary text-white py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-white/50 hover:text-secondary text-xs font-semibold uppercase tracking-widest transition-colors mb-10"
          >
            <ArrowLeft size={13} /> Blog
          </Link>

          <div className="flex items-center gap-3 mb-5">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-secondary">
              <Tag size={10} /> {post.category}
            </span>
          </div>

          <h1 className="font-heading font-bold text-3xl md:text-5xl leading-tight mb-6">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-white/40 text-xs">
            <span>{post.date}</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="inline-flex items-center gap-1.5">
              <Clock size={11} /> {post.readTime}
            </span>
          </div>
        </div>
      </div>

      {/* Decorative symbol */}
      <div className="bg-third border-b border-third">
        <div className="max-w-3xl mx-auto px-4 py-10 flex items-center justify-center">
          <span className="font-heading font-bold text-7xl text-secondary/20 select-none">✦</span>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-14">
        <p className="text-base text-main/60 leading-relaxed mb-10 font-medium italic border-l-4 border-secondary/40 pl-5">
          {post.excerpt}
        </p>

        <div className="space-y-6">
          {post.body.map((para, i) => (
            <p key={i} className="text-[15px] text-main/75 leading-[1.85]">
              {para}
            </p>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-3xl mx-auto px-4 md:px-6">
        <div className="border-t border-main/10" />
      </div>

      {/* More posts */}
      {others.length > 0 && (
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-8">
            More to read
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {others.map(other => (
              <Link
                key={other.id}
                to={`/blog/${other.slug}`}
                className="group flex flex-col"
              >
                <div className="aspect-video bg-secondary/10 flex items-center justify-center mb-4 overflow-hidden">
                  <span className="font-heading font-bold text-5xl text-secondary/20 group-hover:text-secondary/35 group-hover:scale-110 transition-all duration-500 select-none">
                    ✦
                  </span>
                </div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-main/35 mb-2">
                  {other.date}
                </p>
                <h3 className="font-heading font-bold text-main text-sm leading-snug group-hover:text-secondary transition-colors line-clamp-2">
                  {other.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="bg-third border-t border-third py-16 px-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-3">
          While you're here
        </p>
        <h2 className="font-heading font-bold text-main text-2xl md:text-3xl mb-5">
          Find your next read on ALÁKÒWÉ
        </h2>
        <Link
          to="/browse"
          className="inline-flex items-center gap-2 bg-secondary text-white font-semibold text-xs uppercase tracking-widest px-8 py-3.5 rounded-xl hover:bg-secondary/85 transition-colors"
        >
          Browse Books
        </Link>
      </div>
    </div>
  )
}

export default BlogPost
