export type BlockType = 
  | 'hero' 
  | 'about' 
  | 'schedule' 
  | 'prizes' 
  | 'faq' 
  | 'contact' 
  | 'stats' 
  | 'testimonials'
  | 'features'
  | 'gallery'
  | 'countdown'
  | 'sponsors'
  | 'timeline'
  | 'pricing'
  | 'cta'

export interface Block {
  id: string
  type: BlockType
  enabled: boolean
  order: number
  data: Record<string, any>
  styles?: Record<string, any>
}

export interface BlockConfig {
  name: { ar: string; en: string }
  icon: string
  category: 'content' | 'layout' | 'interactive' | 'media'
  defaultData: (hackathon?: any) => Record<string, any>
  defaultStyles?: Record<string, any>
}

export const BLOCK_CONFIGS: Record<BlockType, BlockConfig> = {
  hero: {
    name: { ar: 'القسم الرئيسي', en: 'Hero Section' },
    icon: '✨',
    category: 'content',
    defaultData: (hackathon) => ({
      title: hackathon?.title || 'هاكاثون الابتكار',
      subtitle: hackathon?.description || 'انضم إلينا في رحلة الإبداع والابتكار',
      ctaText: 'سجل الآن',
      ctaLink: `/hackathons/${hackathon?.id || ''}/register-form`,
      backgroundImage: '',
      overlay: true,
      alignment: 'center'
    }),
    defaultStyles: {
      minHeight: '600px',
      textAlign: 'center'
    }
  },
  about: {
    name: { ar: 'عن الهاكاثون', en: 'About' },
    icon: '📝',
    category: 'content',
    defaultData: (hackathon) => ({
      title: 'عن الهاكاثون',
      description: hackathon?.description || '',
      image: '',
      features: []
    })
  },
  schedule: {
    name: { ar: 'الجدول الزمني', en: 'Schedule' },
    icon: '📅',
    category: 'content',
    defaultData: (hackathon) => ({
      title: 'الجدول الزمني',
      events: []
    })
  },
  prizes: {
    name: { ar: 'الجوائز', en: 'Prizes' },
    icon: '🏆',
    category: 'content',
    defaultData: () => ({
      title: 'الجوائز',
      prizes: []
    })
  },
  faq: {
    name: { ar: 'الأسئلة الشائعة', en: 'FAQ' },
    icon: '❓',
    category: 'content',
    defaultData: () => ({
      title: 'الأسئلة الشائعة',
      questions: []
    })
  },
  contact: {
    name: { ar: 'تواصل معنا', en: 'Contact' },
    icon: '📧',
    category: 'interactive',
    defaultData: () => ({
      title: 'تواصل معنا',
      email: '',
      phone: '',
      address: '',
      socialLinks: {}
    })
  },
  stats: {
    name: { ar: 'الإحصائيات', en: 'Statistics' },
    icon: '📊',
    category: 'content',
    defaultData: () => ({
      title: 'إحصائيات الهاكاثون',
      stats: []
    })
  },
  testimonials: {
    name: { ar: 'آراء المشاركين', en: 'Testimonials' },
    icon: '💬',
    category: 'content',
    defaultData: () => ({
      title: 'آراء المشاركين',
      testimonials: []
    })
  },
  features: {
    name: { ar: 'المميزات', en: 'Features' },
    icon: '⭐',
    category: 'content',
    defaultData: () => ({
      title: 'مميزات الهاكاثون',
      features: []
    })
  },
  gallery: {
    name: { ar: 'معرض الصور', en: 'Gallery' },
    icon: '🖼️',
    category: 'media',
    defaultData: () => ({
      title: 'معرض الصور',
      images: []
    })
  },
  countdown: {
    name: { ar: 'العد التنازلي', en: 'Countdown' },
    icon: '⏰',
    category: 'interactive',
    defaultData: (hackathon) => ({
      title: 'العد التنازلي',
      targetDate: hackathon?.startDate || new Date().toISOString()
    })
  },
  sponsors: {
    name: { ar: 'الرعاة', en: 'Sponsors' },
    icon: '🤝',
    category: 'content',
    defaultData: () => ({
      title: 'الرعاة',
      sponsors: []
    })
  },
  timeline: {
    name: { ar: 'الخط الزمني', en: 'Timeline' },
    icon: '📈',
    category: 'content',
    defaultData: () => ({
      title: 'الخط الزمني',
      events: []
    })
  },
  pricing: {
    name: { ar: 'الأسعار', en: 'Pricing' },
    icon: '💰',
    category: 'content',
    defaultData: () => ({
      title: 'الأسعار',
      plans: []
    })
  },
  cta: {
    name: { ar: 'دعوة للعمل', en: 'Call to Action' },
    icon: '🎯',
    category: 'interactive',
    defaultData: (hackathon) => ({
      title: 'سجل الآن',
      subtitle: 'لا تفوت الفرصة',
      ctaText: 'سجل الآن',
      ctaLink: `/hackathons/${hackathon?.id || ''}/register-form`
    })
  }
}

