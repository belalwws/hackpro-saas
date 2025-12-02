import { 
  LayoutTemplate, 
  Info, 
  Calendar, 
  Trophy, 
  HelpCircle, 
  Mail, 
  BarChart3, 
  MessageSquare, 
  Star, 
  Image as ImageIcon, 
  Timer, 
  Users, 
  TrendingUp, 
  CreditCard, 
  MousePointerClick 
} from 'lucide-react'
import React from 'react'

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
  icon: React.ReactNode
  category: 'content' | 'layout' | 'interactive' | 'media'
  defaultData: (hackathon?: any) => Record<string, any>
  defaultStyles?: Record<string, any>
}

export const BLOCK_CONFIGS: Record<BlockType, BlockConfig> = {
  hero: {
    name: { ar: 'القسم الرئيسي', en: 'Hero Section' },
    icon: React.createElement(LayoutTemplate, { className: "w-5 h-5" }),
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
    icon: React.createElement(Info, { className: "w-5 h-5" }),
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
    icon: React.createElement(Calendar, { className: "w-5 h-5" }),
    category: 'content',
    defaultData: (hackathon) => ({
      title: 'الجدول الزمني',
      events: []
    })
  },
  prizes: {
    name: { ar: 'الجوائز', en: 'Prizes' },
    icon: React.createElement(Trophy, { className: "w-5 h-5" }),
    category: 'content',
    defaultData: () => ({
      title: 'الجوائز',
      prizes: []
    })
  },
  faq: {
    name: { ar: 'الأسئلة الشائعة', en: 'FAQ' },
    icon: React.createElement(HelpCircle, { className: "w-5 h-5" }),
    category: 'content',
    defaultData: () => ({
      title: 'الأسئلة الشائعة',
      questions: []
    })
  },
  contact: {
    name: { ar: 'تواصل معنا', en: 'Contact' },
    icon: React.createElement(Mail, { className: "w-5 h-5" }),
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
    icon: React.createElement(BarChart3, { className: "w-5 h-5" }),
    category: 'content',
    defaultData: () => ({
      title: 'إحصائيات الهاكاثون',
      stats: []
    })
  },
  testimonials: {
    name: { ar: 'آراء المشاركين', en: 'Testimonials' },
    icon: React.createElement(MessageSquare, { className: "w-5 h-5" }),
    category: 'content',
    defaultData: () => ({
      title: 'آراء المشاركين',
      testimonials: []
    })
  },
  features: {
    name: { ar: 'المميزات', en: 'Features' },
    icon: React.createElement(Star, { className: "w-5 h-5" }),
    category: 'content',
    defaultData: () => ({
      title: 'مميزات الهاكاثون',
      features: []
    })
  },
  gallery: {
    name: { ar: 'معرض الصور', en: 'Gallery' },
    icon: React.createElement(ImageIcon, { className: "w-5 h-5" }),
    category: 'media',
    defaultData: () => ({
      title: 'معرض الصور',
      images: []
    })
  },
  countdown: {
    name: { ar: 'العد التنازلي', en: 'Countdown' },
    icon: React.createElement(Timer, { className: "w-5 h-5" }),
    category: 'interactive',
    defaultData: (hackathon) => ({
      title: 'العد التنازلي',
      targetDate: hackathon?.startDate || new Date().toISOString()
    })
  },
  sponsors: {
    name: { ar: 'الرعاة', en: 'Sponsors' },
    icon: React.createElement(Users, { className: "w-5 h-5" }),
    category: 'content',
    defaultData: () => ({
      title: 'الرعاة',
      sponsors: []
    })
  },
  timeline: {
    name: { ar: 'الخط الزمني', en: 'Timeline' },
    icon: React.createElement(TrendingUp, { className: "w-5 h-5" }),
    category: 'content',
    defaultData: () => ({
      title: 'الخط الزمني',
      events: []
    })
  },
  pricing: {
    name: { ar: 'الأسعار', en: 'Pricing' },
    icon: React.createElement(CreditCard, { className: "w-5 h-5" }),
    category: 'content',
    defaultData: () => ({
      title: 'الأسعار',
      plans: []
    })
  },
  cta: {
    name: { ar: 'دعوة للعمل', en: 'Call to Action' },
    icon: React.createElement(MousePointerClick, { className: "w-5 h-5" }),
    category: 'interactive',
    defaultData: (hackathon) => ({
      title: 'سجل الآن',
      subtitle: 'لا تفوت الفرصة',
      ctaText: 'سجل الآن',
      ctaLink: `/hackathons/${hackathon?.id || ''}/register-form`
    })
  }
}


