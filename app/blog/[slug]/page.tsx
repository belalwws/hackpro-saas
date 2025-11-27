'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'
import { BackgroundAnimations } from '@/components/background-animations'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { 
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Tag,
  Eye,
  Share2,
  Loader2,
  Twitter,
  Facebook,
  Linkedin,
  Copy,
  Check,
  BookOpen,
  TrendingUp
} from 'lucide-react'

export default function BlogPostPage() {
  const params = useParams()
  const { language, t } = useLanguage()
  const isRTL = language === 'ar'
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [relatedPosts, setRelatedPosts] = useState<any[]>([])
  const [copied, setCopied] = useState(false)
  const slug = params.slug as string

  useEffect(() => {
    fetchPost()
  }, [slug])

  useEffect(() => {
    if (post?.category?.slug) {
      fetchRelatedPosts(post.category.slug, post.id)
    }
  }, [post])

  const fetchPost = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/blog/posts/${slug}`)
      if (response.ok) {
        const data = await response.json()
        setPost(data)
      }
    } catch (error) {
      console.error('Error fetching post:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedPosts = async (categorySlug: string, excludeId: string) => {
    try {
      const response = await fetch(`/api/blog/posts?category=${categorySlug}&limit=4`)
      if (response.ok) {
        const data = await response.json()
        const filtered = data.posts?.filter((p: any) => p.id !== excludeId).slice(0, 3) || []
        setRelatedPosts(filtered)
      }
    } catch (error) {
      console.error('Error fetching related posts:', error)
    }
  }

  const calculateReadingTime = (text: string) => {
    const wordsPerMinute = isRTL ? 200 : 250
    const words = text.split(/\s+/).length
    const minutes = Math.ceil(words / wordsPerMinute)
    return minutes
  }

  const handleShare = async (platform: string) => {
    const url = window.location.href
    const title = isRTL ? post.titleAr : post.titleEn

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank')
        break
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
        break
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
        break
      case 'copy':
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        break
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            {language === 'ar' ? 'المقال غير موجود' : 'Post not found'}
          </h1>
          <Link
            href="/blog"
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            {language === 'ar' ? 'العودة للمدونة' : 'Back to Blog'}
          </Link>
        </div>
      </div>
    )
  }

  const title = language === 'ar' ? post.titleAr : post.titleEn
  const content = language === 'ar' ? post.contentAr : post.contentEn
  const readingTime = calculateReadingTime(content)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/50">
      <BackgroundAnimations />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto"
          >
            <Link
              href="/blog"
              className={cn(
                "inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 mb-8 transition-colors font-medium group",
                isRTL && "text-arabic"
              )}
            >
              <ArrowLeft className={cn("h-4 w-4 transition-transform group-hover:translate-x-[-4px]", isRTL && "rotate-180")} />
              {isRTL ? 'العودة للمدونة' : 'Back to Blog'}
            </Link>

            {/* Category Badge */}
            <div className="mb-6">
              <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm px-4 py-2 shadow-lg">
                {isRTL ? post.category?.nameAr : post.category?.nameEn}
              </Badge>
            </div>

            {/* Title */}
            <h1 className={cn(
              "text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-slate-900 dark:text-white leading-tight",
              isRTL && "text-arabic leading-relaxed"
            )}>
              {title}
            </h1>

            {/* Meta Info */}
            <div className={cn(
              "flex flex-wrap items-center gap-6 text-slate-600 dark:text-slate-400 mb-8 pb-8 border-b border-slate-200 dark:border-slate-700",
              isRTL && "text-arabic"
            )}>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  {post.author?.name?.charAt(0) || 'A'}
                </div>
                <span className="font-medium">{post.author?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>
                  {new Date(post.publishedAt).toLocaleDateString(
                    isRTL ? 'ar-EG' : 'en-US',
                    { year: 'numeric', month: 'long', day: 'numeric' }
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{readingTime} {isRTL ? 'دقيقة قراءة' : 'min read'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                <span>{post.views || 0} {isRTL ? 'مشاهدة' : 'views'}</span>
              </div>
            </div>

            {/* Cover Image */}
            {post.coverImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="relative h-[500px] md:h-[600px] rounded-3xl overflow-hidden mb-12 shadow-2xl border-4 border-white dark:border-slate-800"
              >
                <Image
                  src={post.coverImage}
                  alt={title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-8">
              <motion.article
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={cn(
                  "prose prose-lg dark:prose-invert max-w-none",
                  "prose-headings:text-slate-900 dark:prose-headings:text-white prose-headings:font-bold",
                  "prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-p:leading-relaxed",
                  "prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:font-medium hover:prose-a:text-indigo-700",
                  "prose-strong:text-slate-900 dark:prose-strong:text-white prose-strong:font-bold",
                  "prose-code:text-indigo-600 dark:prose-code:text-indigo-400 prose-code:bg-slate-100 dark:prose-code:bg-slate-800 prose-code:px-2 prose-code:py-1 prose-code:rounded",
                  "prose-pre:bg-slate-900 dark:prose-pre:bg-slate-800 prose-pre:rounded-xl",
                  "prose-img:rounded-2xl prose-img:shadow-xl prose-img:border-2 prose-img:border-slate-200 dark:prose-img:border-slate-700",
                  "prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:pl-6 prose-blockquote:italic",
                  "prose-ul:list-disc prose-ol:list-decimal",
                  "prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6",
                  "prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4",
                  isRTL && "prose prose-lg text-arabic"
                )}
              >
                <div 
                  dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }}
                  className={cn(
                    "whitespace-pre-wrap",
                    isRTL && "text-arabic leading-relaxed"
                  )}
                />
              </motion.article>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700"
                >
                  <h3 className={cn(
                    "text-xl font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-2",
                    isRTL && "text-arabic"
                  )}>
                    <Tag className="h-5 w-5 text-indigo-600" />
                    {isRTL ? 'الوسوم' : 'Tags'}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {post.tags.map((tagRel: any) => (
                      <Link
                        key={tagRel.tag.id}
                        href={`/blog?tag=${tagRel.tag.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-700 dark:text-indigo-300 hover:from-indigo-200 hover:to-purple-200 dark:hover:from-indigo-900/50 dark:hover:to-purple-900/50 transition-all shadow-sm hover:shadow-md"
                      >
                        <Tag className="h-4 w-4" />
                        <span className={cn(isRTL && "text-arabic")}>
                          {isRTL ? tagRel.tag.nameAr : tagRel.tag.nameEn}
                        </span>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Share Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700"
              >
                <h3 className={cn(
                  "text-xl font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-2",
                  isRTL && "text-arabic"
                )}>
                  <Share2 className="h-5 w-5 text-indigo-600" />
                  {isRTL ? 'شارك المقال' : 'Share Article'}
                </h3>
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => handleShare('twitter')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <Twitter className="h-4 w-4" />
                    Twitter
                  </button>
                  <button
                    onClick={() => handleShare('facebook')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <Facebook className="h-4 w-4" />
                    Facebook
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </button>
                  <button
                    onClick={() => handleShare('copy')}
                    className={cn(
                      "inline-flex items-center gap-2 px-6 py-3 rounded-full transition-all shadow-lg hover:shadow-xl hover:scale-105",
                      copied
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-slate-700 text-white hover:bg-slate-800"
                    )}
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        {isRTL ? 'تم النسخ!' : 'Copied!'}
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        {isRTL ? 'نسخ الرابط' : 'Copy Link'}
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-24 space-y-6">
                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
                  >
                    <h3 className={cn(
                      "text-xl font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-2",
                      isRTL && "text-arabic"
                    )}>
                      <TrendingUp className="h-5 w-5 text-indigo-600" />
                      {isRTL ? 'مقالات ذات صلة' : 'Related Articles'}
                    </h3>
                    <div className="space-y-4">
                      {relatedPosts.map((relatedPost: any) => (
                        <Link
                          key={relatedPost.id}
                          href={`/blog/${relatedPost.slug}`}
                          className="block group"
                        >
                          <div className="flex gap-4">
                            {relatedPost.coverImage && (
                              <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                  src={relatedPost.coverImage}
                                  alt={isRTL ? relatedPost.titleAr : relatedPost.titleEn}
                                  fill
                                  className="object-cover group-hover:scale-110 transition-transform"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className={cn(
                                "font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 mb-1",
                                isRTL && "text-arabic"
                              )}>
                                {isRTL ? relatedPost.titleAr : relatedPost.titleEn}
                              </h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {new Date(relatedPost.publishedAt).toLocaleDateString(
                                  isRTL ? 'ar-EG' : 'en-US',
                                  { year: 'numeric', month: 'short', day: 'numeric' }
                                )}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Reading Progress */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <BookOpen className="h-6 w-6" />
                    <h3 className={cn("text-lg font-bold", isRTL && "text-arabic")}>
                      {isRTL ? 'وقت القراءة' : 'Reading Time'}
                    </h3>
                  </div>
                  <p className="text-3xl font-bold mb-2">{readingTime}</p>
                  <p className="text-indigo-100 text-sm">
                    {isRTL ? 'دقيقة' : 'minutes'}
                  </p>
                </motion.div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Related Posts CTA */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {language === 'ar' ? 'هل استمتعت بالمقال؟' : 'Enjoyed the Article?'}
            </h2>
            <p className="text-lg mb-8 text-indigo-100">
              {language === 'ar' 
                ? 'اقرأ المزيد من المقالات المفيدة في مدونتنا'
                : 'Read more helpful articles on our blog'}
            </p>
            <Link
              href="/blog"
              className="inline-block px-8 py-3 bg-white text-indigo-600 rounded-full font-bold hover:bg-gray-100 transition-colors"
            >
              {language === 'ar' ? 'تصفح المدونة' : 'Browse Blog'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
