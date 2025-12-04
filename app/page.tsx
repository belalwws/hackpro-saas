'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useScroll, useTransform, useSpring } from 'framer-motion'
import { LottieStepAnimation } from '@/components/lottie-step-animation'
import { LottieHero } from '@/components/lottie-hero'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Rocket,
  Users,
  Award,
  TrendingUp,
  Zap,
  Shield,
  Globe,
  BarChart3,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Target,
  Crown,
  Heart,
  Code,
  Palette,
  Lock,
  Mail,
  Star,
  Building2,
  Clock,
  Bell,
  Search,
  Calendar,
  MoreHorizontal,
  LayoutDashboard,
  Settings,
  LogOut
} from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/contexts/language-context'
import { PlatformPreview } from '@/components/landing/platform-preview'

const stats = {
  ar: [
    { number: '500+', label: 'هاكاثون ناجح', icon: Rocket },
    { number: '50K+', label: 'مشارك نشط', icon: Users },
    { number: '95%', label: 'رضا العملاء', icon: Heart },
    { number: '24/7', label: 'دعم متواصل', icon: Clock }
  ],
  en: [
    { number: '500+', label: 'Successful Hackathons', icon: Rocket },
    { number: '50K+', label: 'Active Participants', icon: Users },
    { number: '95%', label: 'Customer Satisfaction', icon: Heart },
    { number: '24/7', label: 'Continuous Support', icon: Clock }
  ]
}

const features = {
  ar: [
    {
      icon: Zap,
      title: 'إدارة ذكية',
      description: 'نظام متكامل لإدارة الهاكاثونات من البداية للنهاية بكفاءة عالية',
      color: 'from-[#155DFC] to-[#6A7282]'
    },
    {
      icon: Users,
      title: 'تنظيم الفرق',
      description: 'تكوين تلقائي ويدوي للفرق مع إدارة ذكية للمشاركين',
      color: 'from-[#155DFC] to-[#6A7282]'
    },
    {
      icon: Award,
      title: 'شهادات احترافية',
      description: 'توليد وإرسال شهادات مخصصة تلقائياً لجميع المشاركين',
      color: 'from-[#155DFC] to-[#6A7282]'
    },
    {
      icon: BarChart3,
      title: 'تحليلات متقدمة',
      description: 'تقارير وإحصائيات تفصيلية لمتابعة الأداء واتخاذ القرارات',
      color: 'from-[#155DFC] to-[#6A7282]'
    },
    {
      icon: Shield,
      title: 'أمان عالي',
      description: 'حماية متقدمة للبيانات مع صلاحيات مرنة لكل مستخدم',
      color: 'from-[#155DFC] to-[#6A7282]'
    },
    {
      icon: Globe,
      title: 'متعدد اللغات',
      description: 'دعم كامل للغة العربية والإنجليزية مع واجهة سلسة',
      color: 'from-[#155DFC] to-[#6A7282]'
    }
  ],
  en: [
    {
      icon: Zap,
      title: 'Smart Management',
      description: 'Integrated system for managing hackathons from start to finish with high efficiency',
      color: 'from-[#155DFC] to-[#6A7282]'
    },
    {
      icon: Users,
      title: 'Team Organization',
      description: 'Automatic and manual team formation with smart participant management',
      color: 'from-[#155DFC] to-[#6A7282]'
    },
    {
      icon: Award,
      title: 'Professional Certificates',
      description: 'Automatically generate and send customized certificates to all participants',
      color: 'from-[#155DFC] to-[#6A7282]'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Detailed reports and statistics to track performance and make decisions',
      color: 'from-[#155DFC] to-[#6A7282]'
    },
    {
      icon: Shield,
      title: 'High Security',
      description: 'Advanced data protection with flexible permissions for each user',
      color: 'from-[#155DFC] to-[#6A7282]'
    },
    {
      icon: Globe,
      title: 'Multi-Language',
      description: 'Full support for Arabic and English with a smooth interface',
      color: 'from-[#155DFC] to-[#6A7282]'
    }
  ]
}

const plans = {
  ar: [
    {
      name: 'البداية',
      price: 0,
      period: 'مجاناً للأبد',
      description: 'مثالي للفرق الصغيرة والتجريب',
      features: [
        '1 هاكاثون نشط',
        '50 مشارك',
        '10 أعضاء فريق',
        'المميزات الأساسية',
        'دعم المجتمع'
      ],
      cta: 'ابدأ مجاناً',
      popular: false,
      icon: Sparkles
    },
    {
      name: 'الاحترافي',
      price: 299,
      period: 'شهرياً',
      description: 'للمنظمات المتوسطة والمتقدمة',
      features: [
        '10 هاكاثونات نشطة',
        'مشاركين غير محدودين',
        'فريق غير محدود',
        'جميع المميزات المتقدمة',
        'تحليلات متقدمة',
        'صفحات هبوط مخصصة',
        'دعم أولوية'
      ],
      cta: 'اشترك الآن',
      popular: true,
      icon: Crown
    },
    {
      name: 'المؤسسات',
      price: null,
      period: 'حسب الطلب',
      description: 'حلول مخصصة للمؤسسات الكبرى',
      features: [
        'كل شيء غير محدود',
        'نطاق مخصص',
        'API مخصص',
        'مدير حساب مخصص',
        'تدريب وإعداد',
        'SLA مضمون',
        'دعم 24/7'
      ],
      cta: 'تواصل معنا',
      popular: false,
      icon: Building2
    }
  ],
  en: [
    {
      name: 'Starter',
      price: 0,
      period: 'Free Forever',
      description: 'Perfect for small teams and testing',
      features: [
        '1 Active Hackathon',
        '50 Participants',
        '10 Team Members',
        'Basic Features',
        'Community Support'
      ],
      cta: 'Start Free',
      popular: false,
      icon: Sparkles
    },
    {
      name: 'Professional',
      price: 299,
      period: 'Monthly',
      description: 'For medium and advanced organizations',
      features: [
        '10 Active Hackathons',
        'Unlimited Participants',
        'Unlimited Team',
        'All Advanced Features',
        'Advanced Analytics',
        'Custom Landing Pages',
        'Priority Support'
      ],
      cta: 'Subscribe Now',
      popular: true,
      icon: Crown
    },
    {
      name: 'Enterprise',
      price: null,
      period: 'Custom',
      description: 'Custom solutions for large enterprises',
      features: [
        'Everything Unlimited',
        'Custom Domain',
        'Custom API',
        'Dedicated Account Manager',
        'Training & Setup',
        'Guaranteed SLA',
        '24/7 Support'
      ],
      cta: 'Contact Us',
      popular: false,
      icon: Building2
    }
  ]
}

const testimonials = {
  ar: [
    {
      name: 'أحمد المالكي',
      role: 'مدير التقنية - جامعة الملك سعود',
      content: 'منصة رائعة سهلت علينا إدارة الهاكاثونات بشكل احترافي. التقارير والتحليلات مذهلة!',
      avatar: '👨‍💼',
      rating: 5
    },
    {
      name: 'سارة العتيبي',
      role: 'مديرة الفعاليات - هيئة الابتكار',
      content: 'أفضل منصة استخدمتها لإدارة الفعاليات التقنية. الدعم الفني ممتاز والمميزات شاملة.',
      avatar: '👩‍💼',
      rating: 5
    },
    {
      name: 'محمد الشهري',
      role: 'مؤسس - TechHub',
      content: 'وفرت علينا الكثير من الوقت والجهد. النظام سهل الاستخدام والنتائج احترافية.',
      avatar: '👨‍💻',
      rating: 5
    }
  ],
  en: [
    {
      name: 'Ahmed Al-Maliki',
      role: 'Tech Director - King Saud University',
      content: 'Amazing platform that made managing hackathons professionally easy. Reports and analytics are amazing!',
      avatar: '👨‍💼',
      rating: 5
    },
    {
      name: 'Sara Al-Otaibi',
      role: 'Events Director - Innovation Authority',
      content: 'Best platform I\'ve used for managing tech events. Technical support is excellent and features are comprehensive.',
      avatar: '👩‍💼',
      rating: 5
    },
    {
      name: 'Mohammed Al-Shehri',
      role: 'Founder - TechHub',
      content: 'Saved us a lot of time and effort. The system is easy to use and results are professional.',
      avatar: '👨‍💻',
      rating: 5
    }
  ]
}

// How It Works Component
function ScrollStory() {
  const { language } = useLanguage()
  const isRTL = language === 'ar'

  const steps = {
    ar: [
      {
        icon: Rocket,
        title: 'أنشئ هاكاثونك',
        description: 'في 3 دقائق فقط، أنشئ هاكاثون احترافي بكل التفاصيل',
        color: 'from-blue-600 to-indigo-600',
        image: '📝',
        details: ['تحديد التاريخ والمكان', 'إضافة الجوائز', 'تخصيص الشعار']
      },
      {
        icon: Users,
        title: 'أضف المشاركين',
        description: 'استيراد جماعي من Excel أو إضافة يدوية سريعة',
        color: 'from-indigo-600 to-violet-600',
        image: '👥',
        details: ['رفع ملف Excel', 'تسجيل عبر الرابط', 'موافقات تلقائية']
      },
      {
        icon: Users,
        title: 'كوّن الفرق',
        description: 'تكوين ذكي للفرق بناءً على المهارات والتفضيلات',
        color: 'from-violet-600 to-purple-600',
        image: '🤝',
        details: ['تكوين تلقائي', 'تكوين يدوي', 'إعادة ترتيب']
      },
      {
        icon: Award,
        title: 'قيّم المشاريع',
        description: 'نظام تقييم متعدد المعايير مع حسابات تلقائية',
        color: 'from-purple-600 to-fuchsia-600',
        image: '⭐',
        details: ['معايير مخصصة', 'تقييم محكمين', 'نتائج فورية']
      },
      {
        icon: Crown,
        title: 'أعلن النتائج',
        description: 'شهادات احترافية وإعلان تلقائي للفائزين',
        color: 'from-fuchsia-600 to-pink-600',
        image: '🏆',
        details: ['شهادات PDF', 'إرسال تلقائي', 'تقارير شاملة']
      }
    ],
    en: [
      {
        icon: Rocket,
        title: 'Create Your Hackathon',
        description: 'In just 3 minutes, create a professional hackathon with all details',
        color: 'from-blue-600 to-indigo-600',
        image: '📝',
        details: ['Set Date & Location', 'Add Prizes', 'Customize Logo']
      },
      {
        icon: Users,
        title: 'Add Participants',
        description: 'Bulk import from Excel or quick manual addition',
        color: 'from-indigo-600 to-violet-600',
        image: '👥',
        details: ['Upload Excel File', 'Register via Link', 'Automatic Approvals']
      },
      {
        icon: Users,
        title: 'Form Teams',
        description: 'Smart team formation based on skills and preferences',
        color: 'from-violet-600 to-purple-600',
        image: '🤝',
        details: ['Auto Formation', 'Manual Formation', 'Reorganize']
      },
      {
        icon: Award,
        title: 'Evaluate Projects',
        description: 'Multi-criteria evaluation system with automatic calculations',
        color: 'from-purple-600 to-fuchsia-600',
        image: '⭐',
        details: ['Custom Criteria', 'Judge Evaluation', 'Instant Results']
      },
      {
        icon: Crown,
        title: 'Announce Results',
        description: 'Professional certificates and automatic winner announcements',
        color: 'from-fuchsia-600 to-pink-600',
        image: '🏆',
        details: ['PDF Certificates', 'Automatic Sending', 'Comprehensive Reports']
      }
    ]
  }

  const currentSteps = steps[language]

  return (
    <section className="py-24 lg:py-32 bg-slate-50 dark:bg-[#0B1120] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute left-0 top-0 w-1/2 h-1/2 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={cn("text-center mb-16 lg:mb-24", isRTL && "text-right")}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6 border border-blue-100 dark:border-blue-800">
            <Sparkles className="w-4 h-4" />
            {isRTL ? 'كيف يعمل؟' : 'How It Works?'}
          </div>

          <h2 className={cn(
            "text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight",
            isRTL && "text-arabic"
          )}>
            {isRTL ? 'من الفكرة إلى النتائج' : 'From Idea to Results'}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 mt-2">
              {isRTL ? 'في 5 خطوات بسيطة' : 'In 5 Simple Steps'}
            </span>
          </h2>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent -translate-y-1/2 z-0" />

          {currentSteps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative z-10"
              >
                <div className={cn(
                  "h-full bg-white dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-100 dark:border-slate-800",
                  isRTL && "text-right"
                )}>
                  {/* Icon and Number */}
                  <div className={cn("flex items-center justify-between mb-8", isRTL && "flex-row-reverse")}>
                    <div className={cn(
                      "w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300",
                      step.color
                    )}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-4xl font-black text-slate-100 dark:text-slate-800 select-none">
                      0{index + 1}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className={cn(
                    "text-2xl font-bold text-slate-900 dark:text-white mb-4",
                    isRTL && "text-arabic"
                  )}>
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className={cn(
                    "text-slate-600 dark:text-slate-400 mb-6 leading-relaxed",
                    isRTL && "text-arabic"
                  )}>
                    {step.description}
                  </p>

                  {/* Details List */}
                  <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                    {step.details.map((detail, idx) => (
                      <div
                        key={idx}
                        className={cn("flex items-center gap-3", isRTL ? "justify-end flex-row-reverse" : "justify-start")}
                      >
                        <div className={cn("w-1.5 h-1.5 rounded-full bg-gradient-to-r", step.color)} />
                        <span className={cn(
                          "text-sm font-medium text-slate-700 dark:text-slate-300",
                          isRTL && "text-arabic"
                        )}>
                          {detail}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default function LandingPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const { language, t } = useLanguage()
  const isRTL = language === 'ar'
  const [particlePositions, setParticlePositions] = useState<Array<{ left: number; top: number; duration: number; delay: number }>>([])

  // Generate particle positions only on client side to avoid hydration mismatch
  useEffect(() => {
    setParticlePositions(
      Array.from({ length: 20 }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: 3 + Math.random() * 2,
        delay: Math.random() * 2,
      }))
    )
  }, [])

  const handleGetStarted = () => {
    router.push('/register')
  }

  const handleEarlyAccess = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/register?email=${encodeURIComponent(email)}`)
  }

  const currentStats = stats[language]
  const currentFeatures = features[language]
  const currentPlans = plans[language]
  const currentTestimonials = testimonials[language]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Hero Section */}
      <section className="relative pt-20 sm:pt-24 pb-16 sm:pb-24 lg:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[auto] lg:min-h-screen flex items-center">
        {/* Enhanced Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Gradient Mesh Background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-white to-indigo-50 dark:from-slate-950 dark:via-[#0B1120] dark:to-slate-950"></div>

          {/* Animated Blobs - Enhanced */}
          <motion.div
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full blur-[100px]"
          />
          <motion.div
            animate={{
              x: [0, -50, 0],
              y: [0, -30, 0],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute -bottom-20 -left-20 w-[600px] h-[600px] bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-full blur-[100px]"
          />

          {/* Grid Pattern - Enhanced */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]"></div>

          {/* Floating particles */}
          {particlePositions.map((particle, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-500/30 rounded-full"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
              }}
              animate={{
                y: [0, -40, 0],
                opacity: [0, 0.8, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: particle.duration * 2,
                repeat: Infinity,
                delay: particle.delay,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Two Column Hero Layout */}
          <div className={cn(
            "grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[auto] lg:min-h-[70vh] py-8 lg:py-16",
            isRTL && "direction-rtl"
          )}>

            {/* Illustration Side */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
              className={cn(
                "flex items-center justify-center order-1 lg:order-1 relative",
                isRTL && "lg:order-2"
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-full blur-[80px] transform scale-75" />
              <div className="w-full max-w-[320px] sm:max-w-md lg:max-w-xl mx-auto relative z-10 drop-shadow-2xl">
                <LottieHero />
              </div>
            </motion.div>

            {/* Content Side */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
              className={cn(
                "space-y-8 order-2 lg:order-2 text-center",
                isRTL ? "lg:text-right lg:order-1" : "lg:text-left"
              )}
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={cn("flex justify-center", isRTL ? "lg:justify-end" : "lg:justify-start")}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-sm">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    {isRTL ? 'المنصة رقم 1 لإدارة الهاكاثونات' : '#1 Platform for Hackathon Management'}
                  </span>
                </div>
              </motion.div>

              {/* Main Heading */}
              <h1 className={cn(
                "text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight",
                isRTL ? "leading-tight text-arabic" : "leading-[1.1]"
              )}>
                <span className="block text-slate-900 dark:text-white mb-2">
                  {isRTL ? 'أدر هاكاثوناتك' : 'Manage Your'}
                </span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 pb-2">
                  {isRTL ? 'باحترافية' : 'Hackathons'}
                </span>
                <span className="block text-slate-900 dark:text-white text-2xl sm:text-4xl lg:text-5xl mt-2 font-bold opacity-90">
                  {isRTL ? 'من البداية للنهاية' : 'Like a Pro'}
                </span>
              </h1>

              {/* Description */}
              <p className={cn(
                "text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed mx-auto px-2 sm:px-0",
                isRTL ? "lg:mr-0 lg:ml-auto" : "lg:ml-0 lg:mr-auto",
                isRTL && "text-arabic"
              )}>
                {isRTL
                  ? 'منصة شاملة لإنشاء وإدارة الهاكاثونات، تسجيل المشاركين، تكوين الفرق، والتقييم. كل ما تحتاجه في مكان واحد.'
                  : 'All-in-one platform to create hackathons, manage participants, form teams, and judge projects. Everything you need in one place.'}
              </p>

              {/* CTA Buttons */}
              <div className={cn("flex flex-col sm:flex-row gap-4 pt-4 justify-center items-center", isRTL ? "lg:justify-end sm:flex-row-reverse" : "lg:justify-start")}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    onClick={handleGetStarted}
                    className="w-full sm:w-auto h-14 px-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 text-lg font-bold"
                  >
                    {isRTL ? 'ابدأ مجاناً الآن' : 'Get Started Free'}
                    <Rocket className={cn("w-5 h-5", isRTL ? "mr-2" : "ml-2")} />
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => router.push('/pricing')}
                    className="w-full sm:w-auto h-14 px-8 rounded-full border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-lg font-semibold text-slate-700 dark:text-slate-200"
                  >
                    {isRTL ? 'شاهد العرض' : 'See Demo'}
                  </Button>
                </motion.div>
              </div>

              {/* Trust Indicators */}
              <div className={cn("flex flex-wrap items-center gap-6 pt-4 text-sm font-medium text-slate-500 dark:text-slate-400 justify-center", isRTL ? "lg:justify-end flex-row-reverse" : "lg:justify-start")}>
                <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>{isRTL ? 'مجاني للبدء' : 'Free to start'}</span>
                </div>
                <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>{isRTL ? 'إعداد سريع' : 'Quick setup'}</span>
                </div>
                <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                  <div className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span>{isRTL ? 'آمن 100%' : '100% Secure'}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Platform Preview */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-12 sm:mt-20 lg:mt-28 relative"
          >
            {/* Preview Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-center mb-10"
            >
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-full mb-5 shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                <span className={cn(
                  "text-sm font-semibold text-slate-700 dark:text-slate-300",
                  isRTL && "text-arabic"
                )}>
                  {isRTL ? 'معاينة تفاعلية' : 'Interactive Preview'}
                </span>
              </div>
              <h3 className={cn(
                "text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-3",
                isRTL && "text-arabic"
              )}>
                {isRTL ? 'شاهد المنصة بالعمل' : 'See It In Action'}
              </h3>
              <p className={cn(
                "text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto",
                isRTL && "text-arabic"
              )}>
                {isRTL
                  ? 'استكشف لوحة التحكم الاحترافية'
                  : 'Explore the professional dashboard'}
              </p>
            </motion.div>

            <div className="hidden sm:block">
              <PlatformPreview />
            </div>
            {/* Mobile: Show simplified preview message */}
            <div className="sm:hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#155DFC] to-[#1248C9] rounded-2xl flex items-center justify-center">
                <LayoutDashboard className="w-8 h-8 text-white" />
              </div>
              <h4 className={cn("text-lg font-bold text-slate-900 dark:text-white mb-2", isRTL && "text-arabic")}>
                {isRTL ? 'لوحة تحكم احترافية' : 'Professional Dashboard'}
              </h4>
              <p className={cn("text-sm text-slate-600 dark:text-slate-400 mb-4", isRTL && "text-arabic")}>
                {isRTL ? 'شاهد المعاينة الكاملة على شاشة أكبر' : 'View full preview on a larger screen'}
              </p>
              <Button onClick={handleGetStarted} className="bg-[#155DFC] hover:bg-[#1248C9]">
                {isRTL ? 'جرب الآن' : 'Try Now'}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Scroll Story Section */}
      <ScrollStory />

      {/* Stats Section */}
      <section className="py-20 lg:py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-50 dark:bg-[#0B1120]" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {currentStats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 hover:border-blue-500/20 dark:hover:border-blue-500/20 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />

                    <div className="relative z-10">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-6 h-6" />
                      </div>

                      <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                        {stat.number}
                      </h3>
                      <p className="text-sm sm:text-base font-medium text-slate-500 dark:text-slate-400">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 lg:py-32 px-4 bg-white dark:bg-[#0B1120] relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 text-sm font-medium mb-6 border border-violet-100 dark:border-violet-800">
              <Zap className="w-4 h-4" />
              {isRTL ? 'المميزات' : 'Features'}
            </div>

            <h2 className={cn(
              "text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6",
              isRTL && "text-arabic"
            )}>
              {isRTL ? 'كل ما تحتاجه للنجاح' : 'Everything You Need'}
            </h2>
            <p className={cn(
              "text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed",
              isRTL && "text-arabic"
            )}>
              {isRTL ? 'أدوات احترافية صممت خصيصاً لإدارة الهاكاثونات بكفاءة عالية' : 'Professional tools designed specifically for efficient hackathon management'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {currentFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="h-full bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-8 transition-all duration-300 hover:bg-white dark:hover:bg-slate-800 hover:shadow-2xl hover:shadow-blue-500/10 border border-slate-100 dark:border-slate-800 relative overflow-hidden">
                    <div className={cn(
                      "absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-bl-full",
                      feature.color
                    )} />

                    <div className="relative z-10">
                      <div className={cn(
                        "w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300",
                        feature.color
                      )}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>

                      <h3 className={cn(
                        "text-xl font-bold text-slate-900 dark:text-white mb-3",
                        isRTL && "text-arabic"
                      )}>
                        {feature.title}
                      </h3>

                      <p className={cn(
                        "text-slate-600 dark:text-slate-400 leading-relaxed",
                        isRTL && "text-arabic"
                      )}>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 lg:py-32 px-4 bg-slate-50 dark:bg-[#0B1120] relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6 border border-blue-100 dark:border-blue-800">
              <TrendingUp className="w-4 h-4" />
              {isRTL ? 'الأسعار' : 'Pricing'}
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6">
              {isRTL ? 'خطط مرنة تناسب الجميع' : 'Flexible Plans for Everyone'}
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              {isRTL ? 'ابدأ مجاناً وقم بالترقية عندما ينمو هاكاثونك' : 'Start free and upgrade as your hackathon grows'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto items-start">
            {currentPlans.map((plan, index) => {
              const Icon = plan.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className={cn(
                    "relative group",
                    plan.popular && "md:-mt-8 md:mb-8 z-10"
                  )}
                >
                  <div className={cn(
                    "h-full rounded-3xl p-8 transition-all duration-300 border relative overflow-hidden",
                    plan.popular
                      ? "bg-slate-900 text-white shadow-2xl shadow-blue-500/20 border-blue-500/50"
                      : "bg-white dark:bg-slate-900/50 shadow-xl border-slate-100 dark:border-slate-800 hover:border-blue-500/20"
                  )}>
                    {plan.popular && (
                      <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />
                    )}

                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-lg",
                      plan.popular
                        ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    )}>
                      <Icon className="w-7 h-7" />
                    </div>

                    <h3 className={cn(
                      "text-2xl font-bold mb-2",
                      plan.popular ? "text-white" : "text-slate-900 dark:text-white"
                    )}>
                      {plan.name}
                    </h3>
                    <p className={cn(
                      "text-sm mb-8",
                      plan.popular ? "text-slate-400" : "text-slate-500 dark:text-slate-400"
                    )}>
                      {plan.description}
                    </p>

                    <div className="mb-8">
                      {plan.price !== null ? (
                        <div className="flex items-baseline gap-1">
                          <span className={cn(
                            "text-5xl font-black tracking-tight",
                            plan.popular ? "text-white" : "text-slate-900 dark:text-white"
                          )}>
                            ${plan.price}
                          </span>
                          <span className={cn(
                            "text-lg font-medium",
                            plan.popular ? "text-slate-400" : "text-slate-500 dark:text-slate-400"
                          )}>/{plan.period}</span>
                        </div>
                      ) : (
                        <div className={cn(
                          "text-4xl font-black tracking-tight",
                          plan.popular ? "text-white" : "text-slate-900 dark:text-white"
                        )}>
                          {plan.period}
                        </div>
                      )}
                    </div>

                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className={cn(
                            "w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                            plan.popular ? "bg-blue-500/20 text-blue-400" : "bg-green-500/10 text-green-500"
                          )}>
                            <CheckCircle2 className="w-3 h-3" />
                          </div>
                          <span className={cn(
                            "text-sm font-medium",
                            plan.popular ? "text-slate-300" : "text-slate-600 dark:text-slate-300"
                          )}>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className={cn(
                        "w-full h-14 rounded-xl text-base font-bold transition-all duration-300",
                        plan.popular
                          ? "bg-white text-slate-900 hover:bg-slate-100"
                          : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100"
                      )}
                      onClick={() => plan.price !== null ? router.push('/register') : router.push('/contact')}
                    >
                      {plan.cta}
                    </Button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 lg:py-32 px-4 relative overflow-hidden bg-slate-50 dark:bg-[#0B1120]">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm font-medium mb-6 border border-green-100 dark:border-green-800">
              <Heart className="w-4 h-4" />
              {isRTL ? 'آراء العملاء' : 'Testimonials'}
            </div>

            <h2 className={cn(
              "text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6",
              isRTL && "text-arabic"
            )}>
              {isRTL ? 'قصص نجاح حقيقية' : 'Real Success Stories'}
            </h2>
            <p className={cn(
              "text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto",
              isRTL && "text-arabic"
            )}>
              {isRTL ? 'انضم إلى آلاف المنظمات التي تثق بنا' : 'Join thousands of organizations that trust us'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {currentTestimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="h-full bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-100 dark:border-slate-800 relative">
                  <div className="absolute top-8 right-8 text-6xl text-slate-100 dark:text-slate-800 font-serif opacity-50">"</div>

                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  <p className={cn(
                    "text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed relative z-10",
                    isRTL && "text-arabic"
                  )}>
                    {testimonial.content}
                  </p>

                  <div className="flex items-center gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-xl text-white shadow-lg">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-900 dark:bg-[#0B1120]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-slate-900" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-3xl mb-8 shadow-2xl shadow-blue-500/30 rotate-3">
              <Rocket className="w-10 h-10 text-white" />
            </div>

            <h2 className={cn(
              "text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-8 tracking-tight",
              isRTL && "text-arabic"
            )}>
              {isRTL ? 'جاهز لإطلاق هاكاثونك؟' : 'Ready to Launch?'}
            </h2>
            <p className={cn(
              "text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed",
              isRTL && "text-arabic"
            )}>
              {isRTL ? 'انضم إلى آلاف المنظمات التي تثق بـ HackPro لإدارة فعالياتها التقنية' : 'Join thousands of organizations that trust HackPro for their tech events'}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="w-full sm:w-auto h-16 px-10 rounded-full bg-white text-slate-900 hover:bg-slate-100 text-lg font-bold shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <Rocket className={cn("w-5 h-5", isRTL ? "ml-2" : "mr-2")} />
                {isRTL ? 'ابدأ مجاناً' : 'Start Free'}
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push('/contact')}
                className="w-full sm:w-auto h-16 px-10 rounded-full border-2 border-slate-700 text-white hover:bg-slate-800 text-lg font-bold hover:scale-105 transition-all duration-300"
              >
                <Mail className={cn("w-5 h-5", isRTL ? "ml-2" : "mr-2")} />
                {isRTL ? 'تواصل معنا' : 'Contact Us'}
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-8 mt-12 text-slate-400 text-sm font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>{isRTL ? 'بدون بطاقة ائتمان' : 'No credit card required'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span>{isRTL ? 'إعداد فوري' : 'Instant setup'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                <span>{isRTL ? 'دعم مجاني' : 'Free support'}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#0B1120] border-t border-slate-100 dark:border-slate-800 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Brand */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Rocket className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  HackPro
                </span>
              </div>
              <p className={cn(
                "text-slate-500 dark:text-slate-400 leading-relaxed",
                isRTL && "text-arabic"
              )}>
                {isRTL
                  ? 'منصة احترافية لإدارة الهاكاثونات والمسابقات التقنية'
                  : 'Professional platform for managing hackathons and tech competitions'}
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className={cn(
                "font-bold text-slate-900 dark:text-white mb-6",
                isRTL && "text-arabic"
              )}>
                {isRTL ? 'المنتج' : 'Product'}
              </h4>
              <ul className="space-y-4">
                <li>
                  <Link href="/features" className={cn(
                    "text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors",
                    isRTL && "text-arabic"
                  )}>
                    {isRTL ? 'المميزات' : 'Features'}
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className={cn(
                    "text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors",
                    isRTL && "text-arabic"
                  )}>
                    {isRTL ? 'الأسعار' : 'Pricing'}
                  </Link>
                </li>
                <li>
                  <Link href="/hackathons" className={cn(
                    "text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors",
                    isRTL && "text-arabic"
                  )}>
                    {isRTL ? 'الهاكاثونات' : 'Hackathons'}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className={cn(
                "font-bold text-slate-900 dark:text-white mb-6",
                isRTL && "text-arabic"
              )}>
                {isRTL ? 'الشركة' : 'Company'}
              </h4>
              <ul className="space-y-4">
                <li>
                  <Link href="/about" className={cn(
                    "text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors",
                    isRTL && "text-arabic"
                  )}>
                    {isRTL ? 'من نحن' : 'About Us'}
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className={cn(
                    "text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors",
                    isRTL && "text-arabic"
                  )}>
                    {isRTL ? 'تواصل معنا' : 'Contact'}
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className={cn(
                    "text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors",
                    isRTL && "text-arabic"
                  )}>
                    {isRTL ? 'المدونة' : 'Blog'}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className={cn(
                "font-bold text-slate-900 dark:text-white mb-6",
                isRTL && "text-arabic"
              )}>
                {isRTL ? 'قانوني' : 'Legal'}
              </h4>
              <ul className="space-y-4">
                <li>
                  <Link href="/privacy" className={cn(
                    "text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors",
                    isRTL && "text-arabic"
                  )}>
                    {isRTL ? 'الخصوصية' : 'Privacy'}
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className={cn(
                    "text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors",
                    isRTL && "text-arabic"
                  )}>
                    {isRTL ? 'الشروط' : 'Terms'}
                  </Link>
                </li>
                <li>
                  <Link href="/security" className={cn(
                    "text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors",
                    isRTL && "text-arabic"
                  )}>
                    {isRTL ? 'الأمان' : 'Security'}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className={cn(
                "text-sm text-slate-500 dark:text-slate-400 text-center md:text-left",
                isRTL && "text-arabic"
              )}>
                {isRTL
                  ? '© 2025 HackPro. جميع الحقوق محفوظة.'
                  : '© 2025 HackPro. All rights reserved.'}
              </p>
              <div className="flex items-center gap-6">
                <a
                  href="https://github.com/belalwws/hackpro-saas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  aria-label="GitHub"
                >
                  <Code className="w-5 h-5" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  aria-label="Twitter"
                >
                  <Globe className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
