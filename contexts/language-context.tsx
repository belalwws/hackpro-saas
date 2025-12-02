"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'ar' | 'en'

interface LanguageContextType {
  language: Language
  toggleLanguage: () => void
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Translations
const translations = {
  ar: {
    // Header
    'nav.home': 'الرئيسية',
    'nav.about': 'من نحن',
    'nav.features': 'المميزات',
    'nav.pricing': 'الأسعار',
    'nav.blog': 'المدونة',
    'nav.contact': 'تواصل معنا',
    'nav.hackathons': 'الهاكاثونات',
    'nav.forms': 'النماذج',
    'nav.results': 'النتائج',
    'nav.dashboard': 'لوحة التحكم',
    'nav.profile': 'الملف الشخصي',
    'nav.settings': 'إعدادات النظام',
    'nav.logout': 'تسجيل الخروج',
    'nav.login': 'تسجيل الدخول',
    'nav.register': 'ابدأ مجاناً',
    'nav.theme.light': 'الوضع الفاتح',
    'nav.theme.dark': 'الوضع الداكن',
    'nav.language.switch': 'التبديل للعربية',

    // Hero Section
    'hero.badge': 'منصة SaaS متعددة المؤسسات',
    'hero.title.1': 'منصة',
    'hero.title.2': 'الهاكاثونات الاحترافية',
    'hero.description': 'أداة شاملة لتنظيم وإدارة وتقييم الهاكاثونات والمسابقات التقنية مع نظام Multi-Tenant كامل وتقارير متقدمة',
    'hero.cta.dashboard': 'انتقل إلى لوحة التحكم',
    'hero.cta.start': 'ابدأ مجاناً الآن',
    'hero.cta.demo': 'شاهد Demo',
    'hero.check.1': 'بدون بطاقة ائتمان',
    'hero.check.2': 'إعداد في دقائق',
    'hero.check.3': 'دعم فني مجاني',

    // Stats
    'stats.1.number': '100%',
    'stats.1.label': 'Multi-Tenant',
    'stats.2.number': '6+',
    'stats.2.label': 'أدوار مختلفة',
    'stats.3.number': '50+',
    'stats.3.label': 'هاكاثون منظم',
    'stats.4.number': '5',
    'stats.4.label': 'دقائق للإعداد',

    // Features
    'features.badge': 'المميزات',
    'features.title': 'كل ما تحتاجه لإدارة هاكاثون ناجح',
    'features.description': 'منصة متكاملة مع جميع الأدوات التي تحتاجها لتنظيم وتقييم الهاكاثونات',

    'feature.1.title': 'Multi-Tenancy',
    'feature.1.description': 'عدة مؤسسات على نفس المنصة مع عزل كامل للبيانات وتخصيص لكل مؤسسة',
    'feature.2.title': 'إدارة الفرق',
    'feature.2.description': 'نظام متقدم لتسجيل وإدارة المشاركين والفرق مع دعم CSV والاستيراد الجماعي',
    'feature.3.title': 'نظام التقييم',
    'feature.3.description': 'معايير تقييم مخصصة مع أوزان قابلة للتعديل ونظام تقييم احترافي',
    'feature.4.title': 'تقارير متقدمة',
    'feature.4.description': 'إحصائيات شاملة وتقارير تفصيلية مع تصدير Excel و PDF',
    'feature.5.title': 'نظام الصلاحيات',
    'feature.5.description': '6 أدوار مختلفة (Admin, Judge, Expert, Supervisor, Participant, Master)',
    'feature.6.title': 'أداء عالي',
    'feature.6.description': 'بنية مُحسّنة مع Retry Logic و Edge Runtime Support',
    'feature.7.title': 'واجهة عربية كاملة',
    'feature.7.description': 'دعم كامل للغة العربية مع RTL وتجربة مستخدم محلية',
    'feature.8.title': 'قاعدة بيانات قوية',
    'feature.8.description': 'PostgreSQL مع Prisma ORM ونظام Migrations متقدم',
    'feature.9.title': 'جدولة ذكية',
    'feature.9.description': 'نظام Form Scheduling مع فتح/إغلاق تلقائي للتسجيل والتقييم',

    // Pricing
    'pricing.badge': 'الأسعار',
    'pricing.title': 'خطط مرنة تناسب احتياجاتك',
    'pricing.description': 'ابدأ مجاناً ثم قم بالترقية عند الحاجة',
    'pricing.popular': 'الأكثر شعبية',
    'pricing.cta': 'ابدأ الآن',
    'pricing.free': 'مجاناً',
    'pricing.custom': 'مخصص',
    'pricing.monthly': '/شهرياً',

    // CTA
    'cta.title': 'جاهز للبدء؟',
    'cta.description': 'انضم الآن وابدأ في تنظيم هاكاثونك التالي بطريقة احترافية',
    'cta.button': 'ابدأ مجاناً الآن',

    // Footer
    'footer.tagline': 'منصة احترافية لإدارة الهاكاثونات والمسابقات التقنية',
    'footer.product': 'المنتج',
    'footer.features': 'المميزات',
    'footer.pricing': 'الأسعار',
    'footer.security': 'الأمان',
    'footer.company': 'الشركة',
    'footer.about': 'من نحن',
    'footer.blog': 'المدونة',
    'footer.contact': 'تواصل معنا',
    'footer.legal': 'قانوني',
    'footer.privacy': 'الخصوصية',
    'footer.terms': 'الشروط',
    'footer.license': 'الترخيص',
    'footer.copyright': '© 2025 HackPro. جميع الحقوق محفوظة.',

    // Profile Page
    'profile.title': 'الملف الشخصي',
    'profile.subtitle': 'إدارة بياناتك الشخصية وإعدادات الحساب',
    'profile.loading': 'جاري تحميل الملف الشخصي...',
    'profile.error.title': 'خطأ في تحميل الملف الشخصي',
    'profile.error.retry': 'إعادة المحاولة',
    'profile.tabs.profile': 'الملف الشخصي',
    'profile.tabs.participations': 'المشاركات',
    'profile.personal.title': 'معلوماتي الشخصية',
    'profile.personal.edit': 'تعديل',
    'profile.personal.save': 'حفظ التغييرات',
    'profile.personal.saving': 'جاري الحفظ...',
    'profile.personal.cancel': 'إلغاء',
    'profile.personal.upload': 'اضغط على الأيقونة لرفع صورة شخصية',
    'profile.personal.name': 'الاسم الكامل',
    'profile.personal.email': 'البريد الإلكتروني',
    'profile.personal.email.readonly': 'غير قابل للتعديل',
    'profile.personal.phone': 'رقم الهاتف',
    'profile.personal.city': 'المدينة',
    'profile.personal.nationality': 'الجنسية',
    'profile.personal.registrationDate': 'تاريخ التسجيل',
    'profile.personal.notSet': 'غير محدد',
    'profile.password.title': 'تغيير كلمة المرور',
    'profile.password.description': 'قم بتغيير كلمة المرور الخاصة بك عن طريق إدخال كلمة المرور الحالية ثم الجديدة',
    'profile.password.change': 'تغيير كلمة المرور',
    'profile.password.current': 'كلمة المرور الحالية',
    'profile.password.new': 'كلمة المرور الجديدة',
    'profile.password.confirm': 'تأكيد كلمة المرور الجديدة',
    'profile.password.changing': 'جاري التغيير...',
    'profile.password.mismatch': 'كلمة المرور الجديدة وتأكيدها غير متطابقين',
    'profile.password.minLength': 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل',
    'profile.participations.title': 'رحلتي في الهاكاثونات',
    'profile.participations.description': 'تتبع جميع مشاركاتك ومراحلها',
    'profile.participations.empty.title': 'ابدأ رحلتك!',
    'profile.participations.empty.description': 'لم تسجل في أي هاكاثون بعد',
    'profile.participations.empty.cta': 'استكشف الهاكاثونات',
    'profile.participations.view': 'عرض التفاصيل',
    'profile.status.pending': 'في الانتظار',
    'profile.status.approved': 'مقبول',
    'profile.status.rejected': 'مرفوض',
    'profile.hackathon.draft': 'مسودة',
    'profile.hackathon.open': 'مفتوح',
    'profile.hackathon.closed': 'مغلق',
    'profile.hackathon.completed': 'مكتمل',
    'profile.upload.error.type': 'نوع الملف غير مدعوم. يرجى اختيار صورة (JPG, PNG, WebP)',
    'profile.upload.error.size': 'حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت',
    'profile.upload.success': 'تم تحديث الصورة الشخصية بنجاح',
    'profile.update.success': 'تم تحديث الملف الشخصي بنجاح',
    'profile.update.error': 'حدث خطأ في تحديث الملف الشخصي',
    'profile.password.success': 'تم تغيير كلمة المرور بنجاح',
    'profile.password.error': 'حدث خطأ في تغيير كلمة المرور',
  },
  en: {
    // Header
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.features': 'Features',
    'nav.pricing': 'Pricing',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'nav.hackathons': 'Hackathons',
    'nav.forms': 'Forms',
    'nav.results': 'Results',
    'nav.dashboard': 'Dashboard',
    'nav.profile': 'Profile',
    'nav.settings': 'System Settings',
    'nav.logout': 'Logout',
    'nav.login': 'Login',
    'nav.register': 'Start Free',
    'nav.theme.light': 'Light Mode',
    'nav.theme.dark': 'Dark Mode',
    'nav.language.switch': 'Switch to English',

    // Hero Section
    'hero.badge': 'Multi-Tenant SaaS Platform',
    'hero.title.1': 'Professional',
    'hero.title.2': 'Hackathon Platform',
    'hero.description': 'Comprehensive tool for organizing, managing, and evaluating hackathons and tech competitions with full Multi-Tenant system and advanced reporting',
    'hero.cta.dashboard': 'Go to Dashboard',
    'hero.cta.start': 'Start Free Now',
    'hero.cta.demo': 'Watch Demo',
    'hero.check.1': 'No credit card required',
    'hero.check.2': 'Setup in minutes',
    'hero.check.3': 'Free technical support',

    // Stats
    'stats.1.number': '100%',
    'stats.1.label': 'Multi-Tenant',
    'stats.2.number': '6+',
    'stats.2.label': 'Different Roles',
    'stats.3.number': '50+',
    'stats.3.label': 'Organized Hackathons',
    'stats.4.number': '5',
    'stats.4.label': 'Minutes to Setup',

    // Features
    'features.badge': 'Features',
    'features.title': 'Everything you need for a successful hackathon',
    'features.description': 'Integrated platform with all the tools you need to organize and evaluate hackathons',

    'feature.1.title': 'Multi-Tenancy',
    'feature.1.description': 'Multiple organizations on the same platform with complete data isolation and customization per organization',
    'feature.2.title': 'Team Management',
    'feature.2.description': 'Advanced system for registering and managing participants and teams with CSV support and bulk import',
    'feature.3.title': 'Evaluation System',
    'feature.3.description': 'Custom evaluation criteria with adjustable weights and professional evaluation system',
    'feature.4.title': 'Advanced Reports',
    'feature.4.description': 'Comprehensive statistics and detailed reports with Excel and PDF export',
    'feature.5.title': 'Permission System',
    'feature.5.description': '6 different roles (Admin, Judge, Expert, Supervisor, Participant, Master)',
    'feature.6.title': 'High Performance',
    'feature.6.description': 'Optimized architecture with Retry Logic and Edge Runtime Support',
    'feature.7.title': 'Full Arabic Interface',
    'feature.7.description': 'Complete Arabic language support with RTL and localized user experience',
    'feature.8.title': 'Powerful Database',
    'feature.8.description': 'PostgreSQL with Prisma ORM and advanced Migrations system',
    'feature.9.title': 'Smart Scheduling',
    'feature.9.description': 'Form Scheduling system with automatic opening/closing for registration and evaluation',

    // Pricing
    'pricing.badge': 'Pricing',
    'pricing.title': 'Flexible plans to fit your needs',
    'pricing.description': 'Start free and upgrade when you need',
    'pricing.popular': 'Most Popular',
    'pricing.cta': 'Get Started',
    'pricing.free': 'Free',
    'pricing.custom': 'Custom',
    'pricing.monthly': '/month',

    // CTA
    'cta.title': 'Ready to Start?',
    'cta.description': 'Join now and start organizing your next hackathon professionally',
    'cta.button': 'Start Free Now',

    // Footer
    'footer.tagline': 'Professional platform for managing hackathons and tech competitions',
    'footer.product': 'Product',
    'footer.features': 'Features',
    'footer.pricing': 'Pricing',
    'footer.security': 'Security',
    'footer.company': 'Company',
    'footer.about': 'About Us',
    'footer.blog': 'Blog',
    'footer.contact': 'Contact',
    'footer.legal': 'Legal',
    'footer.privacy': 'Privacy',
    'footer.terms': 'Terms',
    'footer.license': 'License',
    'footer.copyright': '© 2025 HackPro. All rights reserved.',

    // Profile Page
    'profile.title': 'Profile',
    'profile.subtitle': 'Manage your personal information and account settings',
    'profile.loading': 'Loading profile...',
    'profile.error.title': 'Error loading profile',
    'profile.error.retry': 'Retry',
    'profile.tabs.profile': 'Profile',
    'profile.tabs.participations': 'Participations',
    'profile.personal.title': 'Personal Information',
    'profile.personal.edit': 'Edit',
    'profile.personal.save': 'Save Changes',
    'profile.personal.saving': 'Saving...',
    'profile.personal.cancel': 'Cancel',
    'profile.personal.upload': 'Click the icon to upload a profile picture',
    'profile.personal.name': 'Full Name',
    'profile.personal.email': 'Email Address',
    'profile.personal.email.readonly': 'Not Editable',
    'profile.personal.phone': 'Phone Number',
    'profile.personal.city': 'City',
    'profile.personal.nationality': 'Nationality',
    'profile.personal.registrationDate': 'Registration Date',
    'profile.personal.notSet': 'Not Set',
    'profile.password.title': 'Change Password',
    'profile.password.description': 'Change your password by entering your current password then the new one',
    'profile.password.change': 'Change Password',
    'profile.password.current': 'Current Password',
    'profile.password.new': 'New Password',
    'profile.password.confirm': 'Confirm New Password',
    'profile.password.changing': 'Changing...',
    'profile.password.mismatch': 'New password and confirmation do not match',
    'profile.password.minLength': 'New password must be at least 6 characters',
    'profile.participations.title': 'My Hackathon Journey',
    'profile.participations.description': 'Track all your participations and their stages',
    'profile.participations.empty.title': 'Start Your Journey!',
    'profile.participations.empty.description': 'You haven\'t registered for any hackathons yet',
    'profile.participations.empty.cta': 'Explore Hackathons',
    'profile.participations.view': 'View Details',
    'profile.status.pending': 'Pending',
    'profile.status.approved': 'Approved',
    'profile.status.rejected': 'Rejected',
    'profile.hackathon.draft': 'Draft',
    'profile.hackathon.open': 'Open',
    'profile.hackathon.closed': 'Closed',
    'profile.hackathon.completed': 'Completed',
    'profile.upload.error.type': 'File type not supported. Please choose an image (JPG, PNG, WebP)',
    'profile.upload.error.size': 'File size too large. Maximum 5MB',
    'profile.upload.success': 'Profile picture updated successfully',
    'profile.update.success': 'Profile updated successfully',
    'profile.update.error': 'An error occurred while updating profile',
    'profile.password.success': 'Password changed successfully',
    'profile.password.error': 'An error occurred while changing password',
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ar')
  const [mounted, setMounted] = useState(false)

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('hackpro-language') as Language | null
    if (savedLanguage) {
      setLanguageState(savedLanguage)
    }
    setMounted(true)
  }, [])

  // Apply language to document
  useEffect(() => {
    if (!mounted) return

    const root = document.documentElement
    
    root.setAttribute('lang', language)
    root.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr')

    localStorage.setItem('hackpro-language', language)
  }, [language, mounted])

  const toggleLanguage = () => {
    setLanguageState(prev => prev === 'ar' ? 'en' : 'ar')
  }

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['ar']] || key
  }

  // Always provide the context, even before mounted
  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
