'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useScroll, useTransform, useSpring } from 'framer-motion'
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
  Bell
} from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const stats = [
  { number: '500+', label: 'هاكاثون ناجح', icon: Rocket },
  { number: '50K+', label: 'مشارك نشط', icon: Users },
  { number: '95%', label: 'رضا العملاء', icon: Heart },
  { number: '24/7', label: 'دعم متواصل', icon: Clock }
]

const features = [
  {
    icon: Zap,
    title: 'إدارة ذكية',
    description: 'نظام متكامل لإدارة الهاكاثونات من البداية للنهاية بكفاءة عالية',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Users,
    title: 'تنظيم الفرق',
    description: 'تكوين تلقائي ويدوي للفرق مع إدارة ذكية للمشاركين',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Award,
    title: 'شهادات احترافية',
    description: 'توليد وإرسال شهادات مخصصة تلقائياً لجميع المشاركين',
    color: 'from-orange-500 to-red-500'
  },
  {
    icon: BarChart3,
    title: 'تحليلات متقدمة',
    description: 'تقارير وإحصائيات تفصيلية لمتابعة الأداء واتخاذ القرارات',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Shield,
    title: 'أمان عالي',
    description: 'حماية متقدمة للبيانات مع صلاحيات مرنة لكل مستخدم',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    icon: Globe,
    title: 'متعدد اللغات',
    description: 'دعم كامل للغة العربية والإنجليزية مع واجهة سلسة',
    color: 'from-pink-500 to-rose-500'
  }
]

const plans = [
  {
    name: 'البداية',
    nameEn: 'Starter',
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
    nameEn: 'Professional',
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
    nameEn: 'Enterprise',
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
]

const testimonials = [
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
]

// Platform Preview Component - Professional & Calm Version with Interactive Demo
function PlatformPreview() {
  const [activeElement, setActiveElement] = useState<string | null>(null)
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipContent, setTooltipContent] = useState('')
  const [cursorPosition, setCursorPosition] = useState({ x: 50, y: 50 })
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<'create' | 'details' | 'participants' | null>(null)
  const [formData, setFormData] = useState({ title: '', date: '', participants: 0 })
  const previewRef = useRef<HTMLDivElement>(null)

  // Cursor animation sequence - Fixed positions
  useEffect(() => {
    const sequences = [
      // Start from center
      { x: 50, y: 50, element: null, delay: 1500, tooltip: '', action: null },
      // Move to notification bell (top right)
      { x: 94, y: 10, element: 'notifications', delay: 1200, tooltip: 'الإشعارات', action: null },
      // Move to new hackathon button (next to bell)
      { x: 83, y: 10, element: 'new-hackathon', delay: 1200, tooltip: 'إنشاء هاكاثون جديد', action: 'open-create' },
      // Modal opens - move to center
      { x: 50, y: 50, element: null, delay: 800, tooltip: '', action: null },
      // Click on title field
      { x: 50, y: 38, element: 'form-title', delay: 1000, tooltip: 'اسم الهاكاثون', action: 'type-title' },
      // Click on date field
      { x: 50, y: 48, element: 'form-date', delay: 1200, tooltip: 'تاريخ البدء', action: 'type-date' },
      // Click on participants field
      { x: 50, y: 58, element: 'form-participants', delay: 1200, tooltip: 'عدد المشاركين', action: 'type-participants' },
      // Click create button
      { x: 40, y: 68, element: 'create-btn', delay: 1200, tooltip: 'إنشاء الآن', action: 'create-hackathon' },
      // Modal closes - return to dashboard
      { x: 50, y: 25, element: null, delay: 1000, tooltip: '', action: 'close-modal' },
      // Move to first stat card (far left)
      { x: 15, y: 34, element: 'stat-1', delay: 1200, tooltip: 'هاكاثونات نشطة', action: null },
      // Move to second stat card
      { x: 35, y: 34, element: 'stat-2', delay: 1000, tooltip: 'إجمالي المشاركين', action: null },
      // Move to third stat card
      { x: 55, y: 34, element: 'stat-3', delay: 1000, tooltip: 'مشاريع مكتملة', action: null },
      // Move to fourth stat card (far right)
      { x: 75, y: 34, element: 'stat-4', delay: 1000, tooltip: 'متوسط التقييم', action: null },
      // Move to activity section (left side)
      { x: 25, y: 62, element: 'activity-1', delay: 1200, tooltip: 'نشاط جديد', action: 'open-details' },
      // Hackathon details modal opens
      { x: 50, y: 50, element: null, delay: 2000, tooltip: '', action: null },
      // Close details modal
      { x: 50, y: 25, element: null, delay: 1000, tooltip: '', action: 'close-modal' },
      // Move to second activity
      { x: 25, y: 68, element: 'activity-2', delay: 1200, tooltip: 'مشارك جديد', action: 'open-participants' },
      // Participants modal is open
      { x: 50, y: 55, element: null, delay: 2500, tooltip: '', action: null },
      // Close and reset
      { x: 50, y: 20, element: null, delay: 800, tooltip: '', action: 'close-modal' }
    ]

    let currentIndex = 0
    let timeoutId: NodeJS.Timeout

    const animateCursor = () => {
      if (currentIndex >= sequences.length) {
        currentIndex = 0
      }

      const seq = sequences[currentIndex]
      
      // Move cursor
      setCursorPosition({ x: seq.x, y: seq.y })
      
      // Handle actions
      setTimeout(() => {
        if (seq.action === 'open-create') {
          setModalType('create')
          setShowModal(true)
          setFormData({ title: '', date: '', participants: 0 })
        } else if (seq.action === 'type-title') {
          setFormData(prev => ({ ...prev, title: 'هاكاثون الابتكار 2025' }))
        } else if (seq.action === 'type-date') {
          setFormData(prev => ({ ...prev, date: '2025-03-15' }))
        } else if (seq.action === 'type-participants') {
          setFormData(prev => ({ ...prev, participants: 150 }))
        } else if (seq.action === 'create-hackathon') {
          // Simulate creation
        } else if (seq.action === 'open-details') {
          setModalType('details')
          setShowModal(true)
        } else if (seq.action === 'open-participants') {
          setModalType('participants')
          setShowModal(true)
        } else if (seq.action === 'close-modal') {
          setShowModal(false)
          setModalType(null)
        }

        if (seq.element) {
          setActiveElement(seq.element)
          setTooltipContent(seq.tooltip)
          setShowTooltip(true)
          
          setTimeout(() => {
            setShowTooltip(false)
            setActiveElement(null)
          }, 800)
        } else {
          setActiveElement(null)
        }
      }, 600)

      currentIndex++
      timeoutId = setTimeout(animateCursor, seq.delay)
    }

    timeoutId = setTimeout(animateCursor, 2000)

    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.8 }}
      className="mt-20 relative w-full flex justify-center"
    >
      {/* Main Dashboard Preview - Extra Wide */}
      <div 
        ref={previewRef}
        className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 w-[96vw] max-w-[1800px]"
      >
        {/* Browser Chrome */}
        <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 flex items-center gap-3 border-b border-slate-200 dark:border-slate-700">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600"></div>
            <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600"></div>
            <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600"></div>
          </div>
          <div className="flex-1 mx-6">
            <div className="bg-white dark:bg-slate-900 rounded-lg px-4 py-2 text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2 border border-slate-200 dark:border-slate-700">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-mono text-xs">app.hackpro.sa/dashboard</span>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="bg-slate-50 dark:bg-slate-950 p-6">
          {/* Top Bar with Quick Actions */}
            <motion.div
            initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex items-center justify-between mb-6"
          >
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-0.5">
                مرحباً بك 👋
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                نظرة عامة على هاكاثوناتك
              </p>
            </div>
            <div className="flex gap-2">
              <button 
                className={cn(
                  "px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg font-semibold text-xs transition-all",
                  activeElement === 'new-hackathon' ? 'ring-2 ring-blue-500 ring-offset-1 scale-105' : ''
                )}
              >
                هاكاثون جديد
              </button>
              <button 
                className={cn(
                  "w-9 h-9 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center transition-all border border-slate-200 dark:border-slate-700 relative",
                  activeElement === 'notifications' ? 'ring-2 ring-blue-500 ring-offset-1 scale-110' : ''
                )}
              >
                <Bell className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
              </button>
            </div>
            </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 mb-6">
            {/* Professional Stat Cards */}
            {[
              { 
                id: 'stat-1',
                icon: Rocket, 
                label: 'هاكاثونات نشطة', 
                value: '12',
                bgColor: 'bg-blue-50 dark:bg-blue-950/20',
                iconColor: 'text-blue-600 dark:text-blue-400',
                delay: 0.3
              },
              { 
                id: 'stat-2',
                icon: Users, 
                label: 'إجمالي المشاركين', 
                value: '1,250',
                bgColor: 'bg-violet-50 dark:bg-violet-950/20',
                iconColor: 'text-violet-600 dark:text-violet-400',
                delay: 0.4
              },
              { 
                id: 'stat-3',
                icon: Award, 
                label: 'مشاريع مكتملة', 
                value: '348',
                bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
                iconColor: 'text-emerald-600 dark:text-emerald-400',
                delay: 0.5
              },
              { 
                id: 'stat-4',
                icon: Star, 
                label: 'متوسط التقييم', 
                value: '4.8',
                bgColor: 'bg-amber-50 dark:bg-amber-950/20',
                iconColor: 'text-amber-600 dark:text-amber-400',
                delay: 0.6
              }
            ].map((stat, index) => {
              const Icon = stat.icon
              const isActive = activeElement === stat.id
              return (
            <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    scale: isActive ? 1.05 : 1
                  }}
                  transition={{ delay: stat.delay, duration: 0.5 }}
                  className={cn(
                    "bg-white dark:bg-slate-900 rounded-xl p-4 border transition-all",
                    isActive 
                      ? 'border-blue-500 shadow-xl ring-2 ring-blue-500 ring-offset-1' 
                      : 'border-slate-200 dark:border-slate-800 hover:shadow-lg'
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", stat.bgColor)}>
                      <Icon className={cn("w-5 h-5", stat.iconColor)} />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-0.5">
                    {stat.value}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </p>
            </motion.div>
              )
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Recent Activity - Professional Design */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  النشاط الأخير
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  آخر 24 ساعة
                  </span>
              </div>
              <div className="space-y-2.5">
                {[
                  { id: 'activity-1', user: 'أحمد محمد', action: 'انضم إلى هاكاثون الابتكار', time: '2 د', bgColor: 'bg-blue-100 dark:bg-blue-950/30', textColor: 'text-blue-600 dark:text-blue-400' },
                  { id: 'activity-2', user: 'فاطمة علي', action: 'قدمت مشروع جديد', time: '15 د', bgColor: 'bg-violet-100 dark:bg-violet-950/30', textColor: 'text-violet-600 dark:text-violet-400' },
                  { id: 'activity-3', user: 'خالد أحمد', action: 'حصل على المركز الأول', time: '1 س', bgColor: 'bg-emerald-100 dark:bg-emerald-950/30', textColor: 'text-emerald-600 dark:text-emerald-400' },
                  { id: 'activity-4', user: 'سارة محمود', action: 'بدأت تقييم المشاريع', time: '2 س', bgColor: 'bg-amber-100 dark:bg-amber-950/30', textColor: 'text-amber-600 dark:text-amber-400' }
                ].map((activity, index) => {
                  const isActive = activeElement === activity.id
                  return (
                    <div
                      key={index}
                      className={cn(
                        "flex items-center gap-3 p-2.5 rounded-lg transition-all",
                        isActive 
                          ? 'bg-blue-50 dark:bg-blue-950/30 ring-2 ring-blue-500 scale-105' 
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs",
                        activity.bgColor,
                        activity.textColor
                      )}>
                        {activity.user[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">
                          {activity.user}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {activity.action}
                        </p>
                      </div>
                      <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                        {activity.time}
                      </span>
                    </div>
                  )
                })}
              </div>
            </motion.div>

            {/* Upcoming Events */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800"
            >
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4">
                الهاكاثونات القادمة
              </h3>
              <div className="space-y-3">
                {[
                  { title: 'هاكاثون الذكاء الاصطناعي', date: '15 يناير', participants: 45, color: 'bg-blue-500' },
                  { title: 'تحدي التطبيقات', date: '22 يناير', participants: 32, color: 'bg-violet-500' },
                  { title: 'هاكاثون التقنية', date: '5 فبراير', participants: 28, color: 'bg-emerald-500' }
                ].map((event, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-xs font-medium text-slate-900 dark:text-slate-100 mb-1">
                          {event.title}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {event.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {event.participants}
                          </span>
                        </div>
                      </div>
                    </div>
                    {index < 2 && (
                      <div className="h-px bg-slate-200 dark:bg-slate-800"></div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Animated Cursor */}
            <motion.div
          className="absolute pointer-events-none z-50"
          animate={{
            left: `${cursorPosition.x}%`,
            top: `${cursorPosition.y}%`,
          }}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.1, 0.25, 1]
          }}
          style={{ willChange: 'left, top' }}
        >
          {/* Cursor Icon */}
          <div className="relative -translate-x-1 -translate-y-1">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-2xl"
            >
              <path
                d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
                fill="white"
                stroke="#1e293b"
                strokeWidth="1.5"
              />
              <path
                d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
                fill="url(#cursorGradient)"
                fillOpacity="0.9"
              />
              <defs>
                <linearGradient id="cursorGradient" x1="3" y1="3" x2="20" y2="20">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Click Effect - Ripple */}
            {activeElement && (
              <>
                <motion.div
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="absolute top-2 left-2 w-6 h-6 border-2 border-blue-500 rounded-full"
                />
                <motion.div
                  initial={{ scale: 0, opacity: 0.8 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="absolute top-2 left-2 w-6 h-6 bg-blue-500 rounded-full"
                />
              </>
            )}

            {/* Cursor Trail */}
            <motion.div
              className="absolute top-2 left-2 w-2 h-2 bg-blue-500 rounded-full opacity-60"
              animate={{
                scale: [1, 0],
                opacity: [0.6, 0]
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
        </div>
            </motion.div>

        {/* Tooltip */}
        {showTooltip && tooltipContent && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute z-50 pointer-events-none"
            style={{
              left: `${cursorPosition.x}%`,
              top: `${cursorPosition.y}%`,
              transform: 'translate(20px, -10px)'
            }}
          >
            <div className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-3 py-2 rounded-lg text-sm font-medium shadow-xl whitespace-nowrap">
              {tooltipContent}
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-900 dark:bg-slate-100 rotate-45"></div>
          </div>
          </motion.div>
        )}

        {/* Modals */}
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-8"
          >
            {/* Create Hackathon Modal */}
            {modalType === 'create' && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-2xl w-full shadow-2xl"
              >
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                  إنشاء هاكاثون جديد
                </h3>
                <div className="space-y-4">
                  {/* Title Field */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      اسم الهاكاثون
                    </label>
                    <div 
                      className={cn(
                        "w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 rounded-lg transition-all",
                        activeElement === 'form-title' 
                          ? "border-blue-500 ring-2 ring-blue-500/20" 
                          : "border-slate-200 dark:border-slate-700"
                      )}
                    >
                      <span className={cn(
                        "text-slate-900 dark:text-slate-100",
                        formData.title ? "" : "text-slate-400"
                      )}>
                        {formData.title || "أدخل اسم الهاكاثون..."}
                      </span>
                      {activeElement === 'form-title' && formData.title && (
                        <motion.span
                          animate={{ opacity: [1, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity }}
                          className="inline-block w-0.5 h-5 bg-blue-600 ml-1"
                        />
                      )}
                    </div>
        </div>
        
                  {/* Date Field */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      تاريخ البدء
                    </label>
                    <div 
                      className={cn(
                        "w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 rounded-lg transition-all",
                        activeElement === 'form-date' 
                          ? "border-blue-500 ring-2 ring-blue-500/20" 
                          : "border-slate-200 dark:border-slate-700"
                      )}
                    >
                      <span className={cn(
                        "text-slate-900 dark:text-slate-100",
                        formData.date ? "" : "text-slate-400"
                      )}>
                        {formData.date || "اختر التاريخ..."}
                      </span>
          </div>
        </div>

                  {/* Participants Field */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      الحد الأقصى للمشاركين
                    </label>
                    <div 
                      className={cn(
                        "w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 rounded-lg transition-all",
                        activeElement === 'form-participants' 
                          ? "border-blue-500 ring-2 ring-blue-500/20" 
                          : "border-slate-200 dark:border-slate-700"
                      )}
                    >
                      <span className={cn(
                        "text-slate-900 dark:text-slate-100",
                        formData.participants ? "" : "text-slate-400"
                      )}>
                        {formData.participants || "أدخل عدد المشاركين..."}
                      </span>
        </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 pt-4">
                    <button 
                      className={cn(
                        "flex-1 px-6 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg font-semibold transition-all",
                        activeElement === 'create-btn' && "ring-2 ring-blue-500 ring-offset-2 scale-105"
                      )}
                    >
                      إنشاء الهاكاثون
                    </button>
                    <button className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg font-semibold border-2 border-slate-200 dark:border-slate-700">
                      إلغاء
                    </button>
          </div>
        </div>
              </motion.div>
            )}

            {/* Hackathon Details Modal */}
            {modalType === 'details' && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-3xl w-full shadow-2xl"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                      هاكاثون الابتكار 2025
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      15 مارس 2025 - 17 مارس 2025
                    </p>
        </div>
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    نشط
            </Badge>
          </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 dark:bg-blue-950/20 rounded-xl p-4">
                    <Users className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">150</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">مشارك</p>
          </div>
                  <div className="bg-violet-50 dark:bg-violet-950/20 rounded-xl p-4">
                    <Rocket className="w-6 h-6 text-violet-600 dark:text-violet-400 mb-2" />
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">45</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">مشروع</p>
        </div>
                  <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-xl p-4">
                    <Award className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mb-2" />
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">12</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">فريق</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">المراحل</h4>
                  {[
                    { name: 'التسجيل', status: 'مكتمل', color: 'green' },
                    { name: 'تكوين الفرق', status: 'جاري', color: 'blue' },
                    { name: 'التطوير', status: 'قريباً', color: 'slate' }
                  ].map((phase, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                      <span className="font-medium text-slate-900 dark:text-slate-100">{phase.name}</span>
                      <Badge className={cn(
                        phase.color === 'green' && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                        phase.color === 'blue' && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                        phase.color === 'slate' && "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                      )}>
                        {phase.status}
                      </Badge>
        </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Participants Modal */}
            {modalType === 'participants' && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-3xl w-full shadow-2xl"
              >
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                  المشاركون (150)
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {[
                    { name: 'أحمد محمد علي', email: 'ahmed@example.com', team: 'فريق الابتكار', role: 'مطور' },
                    { name: 'فاطمة أحمد', email: 'fatima@example.com', team: 'فريق التقنية', role: 'مصممة' },
                    { name: 'محمد خالد', email: 'mohamed@example.com', team: 'فريق الإبداع', role: 'مطور' },
                    { name: 'سارة محمود', email: 'sara@example.com', team: 'فريق النجاح', role: 'محكمة' },
                    { name: 'خالد علي', email: 'khaled@example.com', team: 'فريق الابتكار', role: 'مطور' }
                  ].map((participant, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-violet-500 rounded-full flex items-center justify-center text-white font-bold">
                        {participant.name[0]}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900 dark:text-slate-100">{participant.name}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{participant.email}</p>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{participant.team}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">{participant.role}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      {/* Subtle Decorative Elements */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-violet-500/5 dark:bg-violet-500/10 rounded-full blur-3xl"></div>
    </motion.div>
  )
}

// Scroll Story Component
function ScrollStory() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const steps = [
    {
      icon: Rocket,
      title: 'أنشئ هاكاثونك',
      description: 'في 3 دقائق فقط، أنشئ هاكاثون احترافي بكل التفاصيل',
      color: 'from-blue-500 to-cyan-500',
      image: '📝',
      details: ['تحديد التاريخ والمكان', 'إضافة الجوائز', 'تخصيص الشعار']
    },
    {
      icon: Users,
      title: 'أضف المشاركين',
      description: 'استيراد جماعي من Excel أو إضافة يدوية سريعة',
      color: 'from-purple-500 to-pink-500',
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
  ]

  return (
    <div ref={containerRef} className="relative py-32">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <Badge className="mb-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg">
            <Target className="w-5 h-5 ml-2" />
            كيف يعمل؟
            </Badge>
          <h2 className="text-5xl sm:text-6xl font-display font-black text-slate-900 dark:text-slate-100 mb-6">
            من الفكرة إلى النتائج
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              في 5 خطوات بسيطة
            </span>
            </h2>
        </motion.div>

        <div className="space-y-32">
          {steps.map((step, index) => {
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
                      "space-y-6",
                      !isEven && "lg:col-start-2"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-xl",
                        step.color
                      )}>
                        <Icon className="w-8 h-8 text-white" />
          </div>
                      <div className="w-12 h-12 rounded-full bg-slate-900 dark:bg-white flex items-center justify-center">
                        <span className="text-2xl font-black text-white dark:text-slate-900">
                          {index + 1}
                        </span>
        </div>
        </div>

                    <h3 className="text-4xl font-black text-slate-900 dark:text-slate-100">
                      {step.title}
                    </h3>

                    <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
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
                          className="flex items-center gap-3"
                        >
                          <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
                          <span className="text-lg text-slate-700 dark:text-slate-300 font-medium">
                            {detail}
                          </span>
                        </motion.li>
                      ))}
                    </ul>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
              size="lg"
                        className={cn(
                          "text-lg px-8 py-6 rounded-xl shadow-lg bg-gradient-to-r",
                          step.color,
                          "hover:shadow-xl transition-all"
                        )}
                      >
                        جرّب الآن
                        <ArrowLeft className="w-5 h-5 mr-2" />
                      </Button>
                    </motion.div>
                  </motion.div>

                  {/* Visual Side */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className={cn(
                      "relative",
                      isEven ? "lg:col-start-2" : "lg:col-start-1"
                    )}
                  >
                    <div className="relative group">
                      {/* Main Card */}
                      <div className="relative z-10 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-8 shadow-2xl border-2 border-slate-200 dark:border-slate-700 group-hover:scale-105 transition-transform duration-500">
                        <div className="text-center mb-6">
                          <span className="text-8xl">{step.image}</span>
        </div>

                        {/* Demo Content */}
                        {index === 0 && (
                          <div className="space-y-3">
                            <div className="h-4 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full w-3/4"></div>
                            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full w-5/6"></div>
                            <div className="grid grid-cols-2 gap-3 mt-4">
                              <div className="h-20 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
                              <div className="h-20 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
          </div>
        </div>
                        )}

                        {index === 1 && (
                          <div className="space-y-2">
                            {[1, 2, 3].map((i) => (
                              <motion.div
                                key={i}
                                initial={{ x: -50, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg"
                              >
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full"></div>
                                <div className="flex-1 space-y-1">
                                  <div className="h-2 bg-purple-300 rounded w-3/4"></div>
                                  <div className="h-2 bg-slate-300 dark:bg-slate-700 rounded w-1/2"></div>
        </div>
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                              </motion.div>
                            ))}
                          </div>
                        )}

                        {index === 2 && (
                          <div className="grid grid-cols-2 gap-3">
                            {[1, 2, 3, 4].map((i) => (
                              <motion.div
                                key={i}
                                initial={{ scale: 0, rotate: -180 }}
                                whileInView={{ scale: 1, rotate: 0 }}
                                transition={{ delay: i * 0.1, type: "spring" }}
                                className="p-4 bg-slate-100 dark:bg-slate-800 rounded-xl"
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-400 rounded"></div>
                                  <div className="h-2 bg-green-300 rounded flex-1"></div>
                </div>
                                <div className="flex gap-1">
                                  {[1, 2, 3].map((j) => (
                                    <div key={j} className="w-4 h-4 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
                                  ))}
              </div>
                              </motion.div>
                            ))}
            </div>
                        )}

                        {index === 3 && (
                          <div className="space-y-3">
                            {[5, 4, 3].map((stars, i) => (
                              <div key={i} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                <div className="flex gap-1 mb-2">
                                  {[...Array(5)].map((_, j) => (
                                    <Star
                                      key={j}
                                      className={cn(
                                        "w-5 h-5",
                                        j < stars ? "fill-yellow-400 text-yellow-400" : "text-slate-300"
                                      )}
                                    />
                                  ))}
            </div>
                                <div className="h-2 bg-slate-300 dark:bg-slate-700 rounded w-full"></div>
            </div>
                            ))}
            </div>
                        )}

                        {index === 4 && (
                          <div className="space-y-2">
                            {[1, 2, 3].map((i) => (
                              <motion.div
                                key={i}
                                initial={{ x: 50, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg"
                              >
                                <div className={cn(
                                  "w-10 h-10 rounded-full flex items-center justify-center font-bold text-white",
                                  i === 1 && "bg-gradient-to-br from-yellow-400 to-yellow-600",
                                  i === 2 && "bg-gradient-to-br from-slate-300 to-slate-500",
                                  i === 3 && "bg-gradient-to-br from-orange-400 to-orange-600"
                                )}>
                                  {i}
          </div>
                                <div className="flex-1">
                                  <div className="h-2 bg-yellow-300 rounded w-full mb-1"></div>
                                  <div className="h-2 bg-slate-300 dark:bg-slate-700 rounded w-2/3"></div>
          </div>
                                <Award className="w-6 h-6 text-yellow-500" />
                              </motion.div>
                            ))}
        </div>
                        )}
          </div>

                      {/* Decorative Elements */}
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className={cn(
                          "absolute -top-6 -right-6 w-24 h-24 rounded-2xl bg-gradient-to-br opacity-20 blur-xl",
                          step.color
                        )}
                      />
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className={cn(
                          "absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-gradient-to-br opacity-20 blur-xl",
                          step.color
                        )}
                      />
          </div>
                  </motion.div>
        </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
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
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-600 rounded-full shadow-lg shadow-blue-500/50"
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

  const handleGetStarted = () => {
    router.push('/signup')
  }

  const handleEarlyAccess = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/signup?email=${encodeURIComponent(email)}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-screen flex items-center">
        {/* Enhanced Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Gradient Mesh Background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-blue-950 dark:to-purple-950"></div>
          
          {/* Animated Blobs */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/30 to-blue-400/30 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          
          {/* Light rays */}
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-blue-400/0 via-blue-400/50 to-blue-400/0 animate-pulse"></div>
          <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-purple-400/0 via-purple-400/50 to-purple-400/0 animate-pulse animation-delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8 mb-16"
          >
            {/* Enhanced Badge with Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-block"
            >
              <Badge className="px-8 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-lg font-bold shadow-2xl shadow-purple-500/50 border-2 border-white/20 backdrop-blur-sm hover:scale-105 transition-transform cursor-pointer">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="inline-block ml-2"
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
                منصة SaaS رائدة لإدارة الهاكاثونات
              </Badge>
            </motion.div>

            {/* Enhanced Main Heading */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <h1 className="text-5xl sm:text-6xl lg:text-8xl font-display font-black leading-tight">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-slate-100 dark:via-white dark:to-slate-100 mb-4">
                  أطلق هاكاثونك التالي
                </span>
                <span className="block">
                  <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient-x bg-[length:200%_auto]">
                    بثقة واحترافية
                  </span>
                  <motion.span
                    animate={{ rotate: [0, 10, 0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    className="inline-block ml-4"
                  >
                    🚀
                  </motion.span>
                </span>
              </h1>
              
              {/* Decorative lines */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full"
              />
            </motion.div>

            {/* Enhanced Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <p className="text-xl sm:text-2xl lg:text-3xl text-slate-700 dark:text-slate-200 max-w-4xl mx-auto leading-relaxed font-medium">
                المنصة <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">#1</span> عربياً لإدارة الهاكاثونات
              </p>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-700 dark:text-blue-300 font-semibold text-sm"
                >
                  ⚡ سريع
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-700 dark:text-purple-300 font-semibold text-sm"
                >
                  💪 قوي
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="px-4 py-2 bg-pink-100 dark:bg-pink-900/30 rounded-full text-pink-700 dark:text-pink-300 font-semibold text-sm"
                >
                  😍 سهل
                </motion.div>
        </div>
            </motion.div>

            {/* Enhanced CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  onClick={handleGetStarted}
                  className="text-xl px-12 py-8 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300 group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    ابدأ مجاناً الآن
                    <Rocket className="w-6 h-6 group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform" />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  />
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => router.push('/pricing')}
                  className="text-xl px-12 py-8 rounded-2xl border-3 border-slate-900 dark:border-white hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-all duration-300 group font-bold"
                >
                  عرض الأسعار
                  <TrendingUp className="w-6 h-6 mr-3 group-hover:translate-y-[-2px] transition-transform" />
                </Button>
              </motion.div>
            </motion.div>

            {/* Enhanced Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="pt-8"
            >
              <div className="inline-flex items-center gap-8 px-8 py-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50">
                <motion.div 
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.1 }}
                >
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
      </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">بدون بطاقة</span>
    </motion.div>
                
                <div className="w-px h-8 bg-slate-300 dark:bg-slate-700"></div>
                
                <motion.div 
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.1 }}
                >
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
      </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">5 دقائق إعداد</span>
                </motion.div>
                
                <div className="w-px h-8 bg-slate-300 dark:bg-slate-700"></div>
                
                <motion.div 
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.1 }}
                >
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">دعم مجاني</span>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Platform Preview */}
          <PlatformPreview />
        </div>
      </section>

      {/* Scroll Story Section */}
      <ScrollStory />

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
  return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 text-white mb-4 shadow-lg">
                    <Icon className="w-7 h-7" />
        </div>
                  <h3 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                    {stat.number}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">{stat.label}</p>
                </motion.div>
              )
            })}
    </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 px-4 py-2 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100">
              <Target className="w-4 h-4 ml-2" />
              المميزات
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-display font-black text-slate-900 dark:text-slate-100 mb-4">
              كل ما تحتاجه لنجاح هاكاثونك
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              مميزات قوية ومتكاملة تجعل إدارة الهاكاثونات أسهل وأسرع
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="group"
                >
                  <Card className="h-full border-2 border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 hover:shadow-2xl">
                    <CardContent className="p-8">
                      <div className={cn(
                        "w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform",
                        feature.color
                      )}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-4 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 px-4 py-2 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-100">
              <TrendingUp className="w-4 h-4 ml-2" />
              الأسعار
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-display font-black text-slate-900 dark:text-slate-100 mb-4">
              خطط مرنة تناسب احتياجاتك
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              ابدأ مجاناً وقم بالترقية عندما تحتاج
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => {
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
                      <Badge className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
                        <Star className="w-4 h-4 ml-2" />
                        الأكثر شعبية
          </Badge>
        </div>
      )}
                  
                  <Card className={cn(
                    "h-full border-2 transition-all duration-300",
                    plan.popular 
                      ? "border-blue-500 shadow-2xl shadow-blue-500/20 dark:border-blue-400" 
                      : "border-slate-200 dark:border-slate-800 hover:border-blue-300"
                  )}>
                    <CardContent className="p-8">
                      <div className={cn(
                        "w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-lg",
                        plan.popular 
                          ? "bg-gradient-to-br from-blue-600 to-purple-600" 
                          : "bg-gradient-to-br from-slate-600 to-slate-700"
                      )}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>

                      <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                        {plan.name}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
                        {plan.description}
                      </p>

      <div className="mb-6">
                        {plan.price !== null ? (
                          <>
                            <div className="flex items-baseline gap-2">
                              <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                ${plan.price}
                              </span>
                              <span className="text-slate-600 dark:text-slate-400">/{plan.period}</span>
        </div>
                          </>
                        ) : (
                          <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                            {plan.period}
      </div>
                        )}
                      </div>

      <ul className="space-y-3 mb-8">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                            <span className="text-slate-700 dark:text-slate-300">{feature}</span>
          </li>
        ))}
      </ul>

      <Button 
                        className={cn(
                          "w-full py-6 text-lg font-bold rounded-xl",
                          plan.popular
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl"
                            : "bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600"
                        )}
                        onClick={() => plan.price !== null ? router.push('/signup') : router.push('/contact')}
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
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 px-4 py-2 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100">
              <Heart className="w-4 h-4 ml-2" />
              آراء العملاء
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-display font-black text-slate-900 dark:text-slate-100 mb-4">
              محبوبون من قبل الآلاف
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-2 border-slate-200 dark:border-slate-800 hover:shadow-xl transition-shadow">
                  <CardContent className="p-8">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-2xl">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-slate-100">
                          {testimonial.name}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10"></div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-display font-black text-white mb-6">
              جاهز لتبدأ؟
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              انضم إلى مئات المنظمات التي تستخدم HackPro لإدارة هاكاثوناتها
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
        size="lg"
                onClick={handleGetStarted}
                className="text-lg px-8 py-6 rounded-full bg-white text-blue-600 hover:bg-slate-100 shadow-2xl group"
              >
                ابدأ مجاناً الآن
                <Rocket className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push('/contact')}
                className="text-lg px-8 py-6 rounded-full border-2 border-white text-white hover:bg-white/10"
              >
                تواصل معنا
                <Mail className="w-5 h-5 mr-2" />
      </Button>
            </div>

            <p className="text-white/80 mt-6 text-sm">
              لا تحتاج إلى بطاقة ائتمانية • إعداد فوري • دعم مجاني
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
