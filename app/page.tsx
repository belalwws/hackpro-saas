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

// Scroll Story Component
function ScrollStory() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })
  const { language } = useLanguage()
  const isRTL = language === 'ar'

  const steps = {
    ar: [
    {
      icon: Rocket,
      title: 'أنشئ هاكاثونك',
      description: 'في 3 دقائق فقط، أنشئ هاكاثون احترافي بكل التفاصيل',
      color: 'from-[#155DFC] to-[#6A7282]',
      image: '📝',
      details: ['تحديد التاريخ والمكان', 'إضافة الجوائز', 'تخصيص الشعار']
    },
    {
      icon: Users,
      title: 'أضف المشاركين',
      description: 'استيراد جماعي من Excel أو إضافة يدوية سريعة',
      color: 'from-[#155DFC] to-[#6A7282]',
      image: '👥',
      details: ['رفع ملف Excel', 'تسجيل عبر الرابط', 'موافقات تلقائية']
    },
    {
      icon: Users,
      title: 'كوّن الفرق',
      description: 'تكوين ذكي للفرق بناءً على المهارات والتفضيلات',
      color: 'from-green-500 to-emerald-500',
      image: '🤝',
      details: ['تكوين تلقائي', 'تكوين يدوي', 'إعادة ترتيب']
    },
    {
      icon: Award,
      title: 'قيّم المشاريع',
      description: 'نظام تقييم متعدد المعايير مع حسابات تلقائية',
      color: 'from-orange-500 to-red-500',
      image: '⭐',
      details: ['معايير مخصصة', 'تقييم محكمين', 'نتائج فورية']
    },
    {
      icon: Award,
      title: 'أعلن النتائج',
      description: 'شهادات احترافية وإعلان تلقائي للفائزين',
      color: 'from-yellow-500 to-orange-500',
      image: '🏆',
      details: ['شهادات PDF', 'إرسال تلقائي', 'تقارير شاملة']
    }
    ],
    en: [
    {
      icon: Rocket,
      title: 'Create Your Hackathon',
      description: 'In just 3 minutes, create a professional hackathon with all details',
      color: 'from-[#155DFC] to-[#6A7282]',
      image: '📝',
      details: ['Set Date & Location', 'Add Prizes', 'Customize Logo']
    },
    {
      icon: Users,
      title: 'Add Participants',
      description: 'Bulk import from Excel or quick manual addition',
      color: 'from-[#155DFC] to-[#6A7282]',
      image: '👥',
      details: ['Upload Excel File', 'Register via Link', 'Automatic Approvals']
    },
    {
      icon: Users,
      title: 'Form Teams',
      description: 'Smart team formation based on skills and preferences',
      color: 'from-green-500 to-emerald-500',
      image: '🤝',
      details: ['Auto Formation', 'Manual Formation', 'Reorganize']
    },
    {
      icon: Award,
      title: 'Evaluate Projects',
      description: 'Multi-criteria evaluation system with automatic calculations',
      color: 'from-orange-500 to-red-500',
      image: '⭐',
      details: ['Custom Criteria', 'Judge Evaluation', 'Instant Results']
    },
    {
      icon: Award,
      title: 'Announce Results',
      description: 'Professional certificates and automatic winner announcements',
      color: 'from-yellow-500 to-orange-500',
      image: '🏆',
      details: ['PDF Certificates', 'Automatic Sending', 'Comprehensive Reports']
    }
  ]
  }
  
  const currentSteps = steps[language]

  return (
    <div ref={containerRef} className="relative py-12 sm:py-16 lg:py-32">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-20"
        >
          <Badge className="mb-4 sm:mb-6 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#155DFC] to-[#6A7282] text-white text-sm sm:text-lg">
            <Target className={cn("w-5 h-5", isRTL ? "ml-2" : "mr-2")} />
            {isRTL ? 'كيف يعمل؟' : 'How It Works?'}
            </Badge>
              <h2 className={cn(
                "text-2xl sm:text-4xl lg:text-6xl font-display font-black text-slate-900 dark:text-slate-100 mb-4 sm:mb-6 break-words",
                isRTL && "text-arabic leading-relaxed"
              )}>
            {isRTL ? (
              <>
                من الفكرة إلى النتائج
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#155DFC] to-[#6A7282]">
                  في 5 خطوات بسيطة
                </span>
              </>
            ) : (
              <>
                From Idea to Results
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#155DFC] to-[#6A7282]">
                  In 5 Simple Steps
                </span>
              </>
            )}
            </h2>
        </motion.div>

        <div className="space-y-12 sm:space-y-16 lg:space-y-32">
          {currentSteps.map((step, index) => {
            const Icon = step.icon
            const isEven = index % 2 === 0
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className={cn(
                  "grid lg:grid-cols-2 gap-12 items-center",
                  isEven ? "lg:grid-flow-col" : "lg:grid-flow-col-dense"
                )}>
                  {/* Content Side */}
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className={cn(
                      "space-y-6 text-center",
                      isRTL ? "lg:text-right" : "lg:text-left",
                      !isEven && "lg:col-start-2"
                    )}
                  >
                    <div className={cn("flex items-center gap-4 justify-center", isRTL ? "lg:justify-end" : "lg:justify-start")}>
                      <div className={cn(
                        "w-12 sm:w-16 h-12 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-xl",
                        step.color
                      )}>
                        <Icon className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
          </div>
                      <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-slate-900 dark:bg-white flex items-center justify-center">
                        <span className="text-xl sm:text-2xl font-black text-white dark:text-slate-900">
                          {index + 1}
                        </span>
        </div>
        </div>

                    <h3 className={cn(
                      "text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-slate-100 break-words",
                      isRTL && "text-arabic leading-relaxed"
                    )}>
                      {step.title}
                    </h3>

                    <p className={cn(
                      "text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-400 leading-relaxed break-words",
                      isRTL && "text-arabic"
                    )}>
                      {step.description}
                    </p>

                    <ul className="space-y-3">
                      {step.details.map((detail, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.4 + idx * 0.1 }}
                          className={cn("flex items-center gap-3 justify-center", isRTL ? "lg:justify-end" : "lg:justify-start")}
                        >
                          <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
                          <span className={cn(
                            "text-lg text-slate-700 dark:text-slate-300 font-medium break-words",
                            isRTL && "text-arabic"
                          )}>
                            {detail}
                          </span>
                        </motion.li>
                      ))}
                    </ul>

                    <div className={cn("flex", isRTL ? "justify-center lg:justify-end" : "justify-center lg:justify-start")}>
                      <Button
                        size="lg"
                        className={cn(
                          "text-sm sm:text-lg px-6 sm:px-8 py-4 sm:py-6 rounded-xl shadow-lg bg-gradient-to-r relative overflow-hidden group",
                          step.color,
                          "hover:shadow-2xl transition-all duration-300"
                        )}
                      >
                        {/* Shine effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        
                        <span className="relative z-10 flex items-center gap-2">
                          {isRTL ? 'جرّب الآن' : 'Try Now'}
                          <ArrowLeft className={cn("w-5 h-5", isRTL ? "mr-0" : "ml-0")} />
                        </span>
                      </Button>
                    </div>
                  </motion.div>

                  {/* Visual Side - Lottie Animation Only */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className={cn(
                      "relative flex items-center justify-center",
                      isEven ? "lg:col-start-2" : "lg:col-start-1"
                    )}
                  >
                    <div className="w-full max-w-[250px] sm:max-w-md lg:max-w-lg mx-auto">
                      <LottieStepAnimation stepIndex={index} />
                    </div>
                  </motion.div>
        </div>

                {/* Connector Line */}
                {index < currentSteps.length - 1 && (
                  <motion.div
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="absolute left-1/2 -translate-x-1/2 -bottom-16 w-1 h-32 bg-gradient-to-b from-slate-300 to-transparent dark:from-slate-700 origin-top"
                  >
                    <motion.div
                      animate={{ y: [0, 20, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#155DFC] rounded-full shadow-lg shadow-[#155DFC]/50"
                    />
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
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
      <section className="relative pt-16 sm:pt-20 pb-12 sm:pb-20 lg:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[auto] lg:min-h-screen flex items-center">
        {/* Enhanced Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Gradient Mesh Background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#E6F0FF] via-white to-[#FAF5FF] dark:from-slate-900 dark:via-slate-950 dark:to-slate-950"></div>
          
          {/* Animated Blobs - Enhanced */}
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-[#155DFC]/30 to-[#6A7282]/30 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-[#155DFC]/30 to-[#6A7282]/30 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, 50, 0],
              y: [0, 100, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-[#155DFC]/30 to-[#6A7282]/30 rounded-full blur-3xl"
          />
          
          {/* Grid Pattern - Enhanced */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-50"></div>
          
          {/* Floating particles */}
          {particlePositions.map((particle, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-[#155DFC]/20 rounded-full"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Two Column Hero Layout */}
          <div className={cn(
            "grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[auto] lg:min-h-[70vh] py-4 lg:py-16",
            isRTL && "direction-rtl"
          )}>
            
            {/* Illustration Side - Shows first on mobile, left on desktop LTR, right on desktop RTL */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={cn(
                "flex items-center justify-center order-1 lg:order-1",
                isRTL && "lg:order-2"
              )}
            >
              <div className="w-full max-w-[280px] sm:max-w-md lg:max-w-lg mx-auto">
                <LottieHero />
              </div>
            </motion.div>

            {/* Content Side - Shows second on mobile, right on desktop LTR, left on desktop RTL */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={cn(
                "space-y-7 order-2 lg:order-2 text-center",
                isRTL ? "lg:text-right lg:order-1" : "lg:text-left"
              )}
            >
              {/* Main Heading */}
              <h1 className={cn(
                "text-2xl sm:text-4xl lg:text-6xl font-display font-black",
                isRTL ? "leading-relaxed text-arabic" : "leading-[1.1]"
              )}>
                <span className="block text-slate-900 dark:text-white">
                  {isRTL ? 'أدر هاكاثوناتك' : 'Manage Your'}
                </span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#155DFC] to-[#1248C9]">
                  {isRTL ? 'باحترافية' : 'Hackathons'}
                </span>
                <span className="block text-slate-900 dark:text-white text-xl sm:text-3xl lg:text-5xl mt-1 sm:mt-2">
                  {isRTL ? 'من البداية للنهاية' : 'Like a Pro'}
                </span>
              </h1>

              {/* Description */}
              <p className={cn(
                "text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed mx-auto px-2 sm:px-0",
                isRTL ? "lg:mr-0 lg:ml-auto" : "lg:ml-0 lg:mr-auto",
                isRTL && "text-arabic"
              )}>
                {isRTL 
                  ? 'منصة شاملة لإنشاء وإدارة الهاكاثونات، تسجيل المشاركين، تكوين الفرق، والتقييم. كل ما تحتاجه في مكان واحد.'
                  : 'All-in-one platform to create hackathons, manage participants, form teams, and judge projects. Everything you need in one place.'}
              </p>

              {/* CTA Buttons */}
              <div className={cn("flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 justify-center items-center", isRTL ? "lg:justify-end sm:flex-row-reverse" : "lg:justify-start")}>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    onClick={handleGetStarted}
                    className="w-full sm:w-auto text-sm sm:text-base px-6 sm:px-7 py-5 sm:py-6 rounded-xl bg-[#155DFC] hover:bg-[#1248C9] shadow-lg shadow-blue-500/30 transition-all font-semibold"
                  >
                    {isRTL ? 'ابدأ مجاناً الآن' : 'Get Started Free'}
                    <Rocket className={cn("w-4 sm:w-5 h-4 sm:h-5", isRTL ? "mr-2" : "ml-2")} />
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => router.push('/pricing')}
                    className="w-full sm:w-auto text-sm sm:text-base px-6 sm:px-7 py-5 sm:py-6 rounded-xl border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-semibold"
                  >
                    {isRTL ? 'شاهد العرض' : 'See Demo'}
                  </Button>
                </motion.div>
              </div>

              {/* Trust Indicators */}
              <div className={cn("flex flex-wrap items-center gap-3 sm:gap-6 pt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 justify-center", isRTL ? "lg:justify-end flex-row-reverse" : "lg:justify-start")}>
                <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>{isRTL ? 'مجاني للبدء' : 'Free to start'}</span>
                </div>
                <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span>{isRTL ? 'إعداد سريع' : 'Quick setup'}</span>
                </div>
                <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                  <Shield className="w-4 h-4 text-[#155DFC]" />
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
      <section className="py-12 lg:py-20 px-4 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#155DFC]/5 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className={cn(
              "text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white",
              isRTL && "text-arabic"
            )}>
              {isRTL ? 'أرقام تتحدث عنا' : 'Numbers That Speak'}
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {currentStats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all border border-slate-100 dark:border-slate-700 text-center">
                    <div className="inline-flex items-center justify-center w-10 sm:w-14 h-10 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-[#155DFC] to-[#1248C9] text-white mb-2 sm:mb-4 shadow-lg group-hover:scale-110 transition-transform">
                      <Icon className="w-5 sm:w-7 h-5 sm:h-7" />
                    </div>
                    <h3 className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#155DFC] to-[#1248C9] mb-1 sm:mb-2">
                      {stat.number}
                    </h3>
                    <p className="text-xs sm:text-base text-slate-600 dark:text-slate-400 font-medium">{stat.label}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-100 dark:bg-blue-900/50 rounded-full mb-6"
            >
              <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-blue-700 dark:text-blue-300 font-semibold">
                {isRTL ? 'المميزات' : 'Features'}
              </span>
            </motion.div>
            <h2 className={cn(
              "text-3xl sm:text-5xl font-display font-black text-slate-900 dark:text-slate-100 mb-4",
              isRTL && "text-arabic leading-relaxed"
            )}>
              {isRTL ? 'كل ما تحتاجه لنجاح هاكاثونك' : 'Everything You Need'}
            </h2>
            <p className={cn(
              "text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto",
              isRTL && "text-arabic"
            )}>
              {isRTL ? 'مميزات قوية تجعل إدارة الهاكاثونات أسهل' : 'Powerful features that make hackathon management effortless'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {currentFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.5 }}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <div className="h-full bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-5 sm:p-7 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 dark:border-slate-700 relative overflow-hidden">
                    {/* Hover gradient effect */}
                    <div className={cn(
                      "absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity bg-gradient-to-br",
                      feature.color
                    )} />
                    
                    <div className="relative z-10">
                      <div className={cn(
                        "w-12 sm:w-14 h-12 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br flex items-center justify-center mb-4 sm:mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300",
                        feature.color
                      )}>
                        <Icon className="w-6 sm:w-7 h-6 sm:h-7 text-white" />
                      </div>
                      <h3 className={cn(
                        "text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 sm:mb-3",
                        isRTL && "text-arabic"
                      )}>
                        {feature.title}
                      </h3>
                      <p className={cn(
                        "text-slate-600 dark:text-slate-400 leading-relaxed text-xs sm:text-sm",
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
      <section className="py-12 sm:py-16 lg:py-24 px-4 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 px-4 py-2 bg-[#E6F0FF] text-[#155DFC] dark:bg-[#155DFC]/20 dark:text-[#E6F0FF]">
              <TrendingUp className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} />
              {isRTL ? 'الأسعار' : 'Pricing'}
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-display font-black text-slate-900 dark:text-slate-100 mb-4 break-words">
              {isRTL ? 'خطط مرنة تناسب احتياجاتك' : 'Flexible Plans to Fit Your Needs'}
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto break-words">
              {isRTL ? 'ابدأ مجاناً وقم بالترقية عندما تحتاج' : 'Start free and upgrade when you need'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {currentPlans.map((plan, index) => {
              const Icon = plan.icon
  return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: plan.popular ? 1.05 : 1.02 }}
                  className={cn(
                    "relative",
                    plan.popular && "md:-mt-4 md:mb-4"
                  )}
                >
                  {plan.popular && (
                    <div className="absolute -top-5 left-0 right-0 flex justify-center">
                      <Badge className="px-6 py-2 bg-gradient-to-r from-[#155DFC] to-[#1248C9] text-white shadow-lg">
                        <Star className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} />
                        {isRTL ? 'الأكثر شعبية' : 'Most Popular'}
          </Badge>
        </div>
      )}
                  
                  <Card className={cn(
                    "h-full border-2 transition-all duration-300",
                    plan.popular 
                      ? "border-blue-500 shadow-2xl shadow-blue-500/20 dark:border-blue-400" 
                      : "border-slate-200 dark:border-slate-800 hover:border-blue-300"
                  )}>
                    <CardContent className="p-5 sm:p-8">
                      <div className={cn(
                        "w-12 sm:w-14 h-12 sm:h-14 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg",
                        plan.popular 
                          ? "bg-gradient-to-br from-[#155DFC] to-[#1248C9]" 
                          : "bg-gradient-to-br from-slate-600 to-slate-700"
                      )}>
                        <Icon className="w-6 sm:w-7 h-6 sm:h-7 text-white" />
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2 break-words">
                        {plan.name}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mb-4 sm:mb-6 break-words">
                        {plan.description}
                      </p>

      <div className="mb-6">
                        {plan.price !== null ? (
                          <>
                            <div className="flex items-baseline gap-2">
                              <span className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#155DFC] to-[#1248C9]">
                                ${plan.price}
                              </span>
                              <span className="text-slate-600 dark:text-slate-400 break-words">/{plan.period}</span>
        </div>
                          </>
                        ) : (
                          <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#155DFC] to-[#1248C9]">
                            {plan.period}
      </div>
                        )}
                      </div>

      <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 sm:gap-3">
                            <CheckCircle2 className="w-4 sm:w-5 h-4 sm:h-5 text-green-600 shrink-0 mt-0.5" />
                            <span className="text-sm sm:text-base text-slate-700 dark:text-slate-300 break-words">{feature}</span>
          </li>
        ))}
      </ul>

      <Button 
                        className={cn(
                          "w-full py-5 sm:py-6 text-base sm:text-lg font-bold rounded-xl",
                          plan.popular
                            ? "bg-gradient-to-r from-[#155DFC] to-[#1248C9] hover:from-[#1248C9] hover:to-[#0F3AA5] shadow-xl"
                            : "bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600"
                        )}
                        onClick={() => plan.price !== null ? router.push('/register') : router.push('/contact')}
                      >
                        {plan.cta}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-[#E6F0FF] to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-[#155DFC]/10 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-100 dark:bg-green-900/50 rounded-full mb-6"
            >
              <Heart className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-green-700 dark:text-green-300 font-semibold">
                {isRTL ? 'آراء العملاء' : 'Testimonials'}
              </span>
            </motion.div>
            <h2 className={cn(
              "text-3xl sm:text-5xl font-display font-black text-slate-900 dark:text-slate-100 mb-4",
              isRTL && "text-arabic"
            )}>
              {isRTL ? 'ماذا يقول عملاؤنا' : 'What Our Customers Say'}
            </h2>
            <p className={cn(
              "text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto",
              isRTL && "text-arabic"
            )}>
              {isRTL ? 'آلاف العملاء يثقون بنا' : 'Trusted by thousands of happy customers'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {currentTestimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <div className="h-full bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-5 sm:p-7 shadow-lg hover:shadow-xl transition-all border border-slate-100 dark:border-slate-700">
                  {/* Quote icon */}
                  <div className="text-3xl sm:text-4xl text-blue-500/20 mb-3 sm:mb-4">"”</div>
                  
                  <div className="flex gap-1 mb-3 sm:mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 sm:w-5 h-4 sm:h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  <p className={cn(
                    "text-sm sm:text-base text-slate-700 dark:text-slate-300 mb-4 sm:mb-6 leading-relaxed",
                    isRTL && "text-arabic"
                  )}>
                    {testimonial.content}
                  </p>
                  
                  <div className="flex items-center gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-slate-100 dark:border-slate-700">
                    <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-gradient-to-br from-[#155DFC] to-[#1248C9] flex items-center justify-center text-xl sm:text-2xl shadow-lg shrink-0">
                      {testimonial.avatar}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 truncate">
                        {testimonial.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate">
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
      <section className="py-12 sm:py-20 lg:py-28 px-4 relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#155DFC] via-[#1248C9] to-[#0F3AA5]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        
        {/* Floating shapes */}
        <motion.div 
          animate={{ y: [-20, 20, -20], rotate: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-2xl"
        />
        <motion.div 
          animate={{ y: [20, -20, 20], rotate: [0, -10, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-20 right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl"
        />
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-8 backdrop-blur-sm"
            >
              <Rocket className="w-10 h-10 text-white" />
            </motion.div>
            
            <h2 className={cn(
              "text-2xl sm:text-4xl lg:text-6xl font-display font-black text-white mb-4 sm:mb-6",
              isRTL && "text-arabic"
            )}>
              {isRTL ? 'جاهز لتبدأ رحلتك؟' : 'Ready to Launch?'}
            </h2>
            <p className={cn(
              "text-base sm:text-xl text-white/90 mb-6 sm:mb-10 max-w-2xl mx-auto px-4",
              isRTL && "text-arabic"
            )}>
              {isRTL ? 'انضم إلى آلاف المنظمات التي تثق بـ HackPro' : 'Join thousands of organizations that trust HackPro'}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                <Button
                  size="lg"
                  onClick={handleGetStarted}
                  className="w-full sm:w-auto text-base sm:text-lg px-8 sm:px-10 py-5 sm:py-7 rounded-full bg-white text-blue-600 hover:bg-slate-100 shadow-2xl font-bold"
                >
                  <Rocket className={cn("w-4 sm:w-5 h-4 sm:h-5", isRTL ? "ml-2" : "mr-2")} />
                  {isRTL ? 'ابدأ مجاناً' : 'Start Free'}
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => router.push('/contact')}
                  className="w-full sm:w-auto text-base sm:text-lg px-8 sm:px-10 py-5 sm:py-7 rounded-full border-2 border-white/50 text-white hover:bg-white/10 backdrop-blur-sm"
                >
                  <Mail className={cn("w-4 sm:w-5 h-4 sm:h-5", isRTL ? "ml-2" : "mr-2")} />
                  {isRTL ? 'تواصل معنا' : 'Contact Us'}
                </Button>
              </motion.div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-6 sm:mt-10 text-white/80 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{isRTL ? 'بدون بطاقة ائتمان' : 'No credit card'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span>{isRTL ? 'إعداد فوري' : 'Instant setup'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span>{isRTL ? 'دعم مجاني' : 'Free support'}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-[#155DFC] to-[#1248C9] rounded-xl flex items-center justify-center shadow-lg">
                  <Rocket className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-[#155DFC] to-[#1248C9] bg-clip-text text-transparent">
                  HackPro
                </span>
              </div>
              <p className={cn(
                "text-sm text-slate-400 leading-relaxed",
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
                "text-white font-semibold mb-4",
                isRTL && "text-arabic"
              )}>
                {isRTL ? 'المنتج' : 'Product'}
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/features" className={cn(
                    "text-slate-400 hover:text-white transition-colors text-sm",
                    isRTL && "text-arabic"
                  )}>
                    {isRTL ? 'المميزات' : 'Features'}
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className={cn(
                    "text-slate-400 hover:text-white transition-colors text-sm",
                    isRTL && "text-arabic"
                  )}>
                    {isRTL ? 'الأسعار' : 'Pricing'}
                  </Link>
                </li>
                <li>
                  <Link href="/hackathons" className={cn(
                    "text-slate-400 hover:text-white transition-colors text-sm",
                    isRTL && "text-arabic"
                  )}>
                    {isRTL ? 'الهاكاثونات' : 'Hackathons'}
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className={cn(
                    "text-slate-400 hover:text-white transition-colors text-sm",
                    isRTL && "text-arabic"
                  )}>
                    {isRTL ? 'المدونة' : 'Blog'}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className={cn(
                "text-white font-semibold mb-4",
                isRTL && "text-arabic"
              )}>
                {isRTL ? 'الشركة' : 'Company'}
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className={cn(
                    "text-slate-400 hover:text-white transition-colors text-sm",
                    isRTL && "text-arabic"
                  )}>
                    {isRTL ? 'من نحن' : 'About Us'}
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className={cn(
                    "text-slate-400 hover:text-white transition-colors text-sm",
                    isRTL && "text-arabic"
                  )}>
                    {isRTL ? 'تواصل معنا' : 'Contact'}
                  </Link>
                </li>
                <li>
                  <Link href="/features" className={cn(
                    "text-slate-400 hover:text-white transition-colors text-sm",
                    isRTL && "text-arabic"
                  )}>
                    {isRTL ? 'المميزات' : 'Features'}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className={cn(
                "text-white font-semibold mb-4",
                isRTL && "text-arabic"
              )}>
                {isRTL ? 'قانوني' : 'Legal'}
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className={cn(
                    "text-slate-400 hover:text-white transition-colors text-sm",
                    isRTL && "text-arabic"
                  )}>
                    {isRTL ? 'الخصوصية' : 'Privacy'}
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className={cn(
                    "text-slate-400 hover:text-white transition-colors text-sm",
                    isRTL && "text-arabic"
                  )}>
                    {isRTL ? 'الشروط' : 'Terms'}
                  </Link>
                </li>
                <li>
                  <Link href="/security" className={cn(
                    "text-slate-400 hover:text-white transition-colors text-sm",
                    isRTL && "text-arabic"
                  )}>
                    {isRTL ? 'الأمان' : 'Security'}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-800 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className={cn(
                "text-sm text-slate-400 text-center md:text-left",
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
                  className="text-slate-400 hover:text-white transition-colors"
                  aria-label="GitHub"
                >
                  <Code className="w-5 h-5" />
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors"
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
