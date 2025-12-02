'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  CheckCircle2,
  X,
  Sparkles,
  Rocket,
  Crown,
  Building2,
  Zap,
  Shield,
  Users,
  Mail,
  HardDrive,
  BarChart3,
  Headphones,
  Code,
  Globe,
  Clock,
  Star,
  ArrowLeft,
  CreditCard
} from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const plans = [
  {
    id: 'free',
    name: 'البداية',
    nameEn: 'Starter',
    description: 'مثالي للفرق الصغيرة والتجريب',
    monthlyPrice: 0,
    yearlyPrice: 0,
    icon: Sparkles,
    color: 'from-gray-500 to-gray-600',
    popular: false,
    features: {
      hackathons: '1 هاكاثون نشط',
      participants: '50 مشارك',
      users: '10 أعضاء فريق',
      storage: '1GB تخزين',
      emails: '100 إيميل/شهر',
      analytics: 'إحصائيات أساسية',
      support: 'دعم المجتمع',
      customization: false,
      api: false,
      whitelabel: false,
      priority: false
    }
  },
  {
    id: 'professional',
    name: 'الاحترافي',
    nameEn: 'Professional',
    description: 'للمنظمات المتوسطة والمتقدمة',
    monthlyPrice: 299,
    yearlyPrice: 2990,
    savings: 598,
    icon: Crown,
    color: 'from-[#155DFC] to-[#1248C9]',
    popular: true,
    features: {
      hackathons: '10 هاكاثونات نشطة',
      participants: 'مشاركين غير محدودين',
      users: 'فريق غير محدود',
      storage: '50GB تخزين',
      emails: '5,000 إيميل/شهر',
      analytics: 'تحليلات متقدمة',
      support: 'دعم أولوية',
      customization: 'صفحات هبوط مخصصة',
      api: 'API كامل',
      whitelabel: true,
      priority: true,
      training: 'تدريب أونلاين'
    }
  },
  {
    id: 'enterprise',
    name: 'المؤسسات',
    nameEn: 'Enterprise',
    description: 'حلول مخصصة للمؤسسات الكبرى',
    monthlyPrice: null,
    yearlyPrice: null,
    icon: Building2,
    color: 'from-[#1248C9] to-[#0F3AA5]',
    popular: false,
    features: {
      hackathons: 'غير محدود',
      participants: 'غير محدود',
      users: 'غير محدود',
      storage: 'غير محدود',
      emails: 'غير محدود',
      analytics: 'تحليلات مخصصة',
      support: 'دعم 24/7',
      customization: 'تخصيص كامل',
      api: 'API مخصص',
      whitelabel: true,
      priority: true,
      training: 'تدريب شامل',
      dedicated: 'مدير حساب مخصص',
      sla: 'SLA مضمون',
      onboarding: 'إعداد كامل'
    }
  }
]

const comparisonFeatures = [
  { name: 'الهاكاثونات النشطة', icon: Zap, key: 'hackathons' },
  { name: 'عدد المشاركين', icon: Users, key: 'participants' },
  { name: 'أعضاء الفريق', icon: Users, key: 'users' },
  { name: 'مساحة التخزين', icon: HardDrive, key: 'storage' },
  { name: 'الإيميلات', icon: Mail, key: 'emails' },
  { name: 'التحليلات', icon: BarChart3, key: 'analytics' },
  { name: 'الدعم الفني', icon: Headphones, key: 'support' },
  { name: 'التخصيص', icon: Code, key: 'customization' },
  { name: 'API Access', icon: Code, key: 'api' },
  { name: 'White Label', icon: Globe, key: 'whitelabel' },
  { name: 'أولوية الدعم', icon: Clock, key: 'priority' }
]

export default function PricingPage() {
  const router = useRouter()
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const getPrice = (plan: typeof plans[0]) => {
    if (plan.monthlyPrice === null) return null
    return billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice
  }

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId)
    // Navigate to checkout with plan info
    router.push(`/checkout?plan=${planId}&billing=${billingCycle}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 px-6 py-2 bg-gradient-to-r from-[#155DFC] to-[#1248C9] text-white text-lg shadow-lg">
            <CreditCard className="w-5 h-5 ml-2" />
            الأسعار والباقات
          </Badge>
          
            <h1 className="text-5xl sm:text-6xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-[#155DFC] to-[#1248C9] dark:from-slate-100 dark:via-[#155DFC] dark:to-[#1248C9] mb-4">
            خطط مرنة تناسب احتياجاتك
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-8">
            ابدأ مجاناً وقم بالترقية عندما تنمو. جميع الخطط تشمل دعماً فنياً مجانياً
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 p-2 bg-slate-200 dark:bg-slate-800 rounded-full inline-flex">
            <Label
              htmlFor="billing-toggle"
              className={cn(
                "px-6 py-2 rounded-full cursor-pointer transition-all font-semibold",
                billingCycle === 'monthly' 
                  ? "bg-white dark:bg-slate-700 shadow-lg text-slate-900 dark:text-slate-100" 
                  : "text-slate-600 dark:text-slate-400"
              )}
              onClick={() => setBillingCycle('monthly')}
            >
              شهري
            </Label>
            
            <div className="relative">
              <Label
                htmlFor="billing-toggle"
                className={cn(
                  "px-6 py-2 rounded-full cursor-pointer transition-all font-semibold",
                  billingCycle === 'yearly' 
                    ? "bg-white dark:bg-slate-700 shadow-lg text-slate-900 dark:text-slate-100" 
                    : "text-slate-600 dark:text-slate-400"
                )}
                onClick={() => setBillingCycle('yearly')}
              >
                سنوي
              </Label>
              <Badge className="absolute -top-3 -left-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2 py-0.5">
                وفر 17%
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-20 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon
            const price = getPrice(plan)
            
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: plan.popular ? 1.05 : 1.02, y: plan.popular ? -8 : -5 }}
                className={cn(
                  "relative",
                  plan.popular && "lg:-mt-4 lg:mb-4"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-5 left-0 right-0 flex justify-center z-10">
                    <Badge className="px-6 py-2 bg-gradient-to-r from-[#155DFC] to-[#1248C9] text-white shadow-2xl text-base">
                      <Star className="w-5 h-5 ml-2 fill-white" />
                      الأكثر شعبية
                    </Badge>
                  </div>
                )}
                
                <Card className={cn(
                  "h-full border-2 transition-all duration-300 overflow-hidden",
                  plan.popular 
                    ? "border-blue-500 shadow-2xl shadow-blue-500/30 dark:border-blue-400" 
                    : "border-slate-200 dark:border-slate-800 hover:border-blue-300 hover:shadow-xl"
                )}>
                  {plan.popular && (
                    <div className="h-1 bg-gradient-to-r from-[#155DFC] via-[#1248C9] to-[#0F3AA5]"></div>
                  )}
                  
                  <CardContent className="p-8">
                    {/* Icon */}
                    <div className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-xl bg-gradient-to-br",
                      plan.color
                    )}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Plan Name */}
                    <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100 mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                      {plan.description}
                    </p>

                    {/* Price */}
                    <div className="mb-8">
                      {price !== null ? (
                        <>
                          <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#155DFC] to-[#1248C9]">
                              ${price}
                            </span>
                            <span className="text-slate-600 dark:text-slate-400">
                              /{billingCycle === 'monthly' ? 'شهر' : 'سنة'}
                            </span>
                          </div>
                          {billingCycle === 'yearly' && plan.savings && (
                            <p className="text-sm text-green-600 font-semibold">
                              وفر ${plan.savings} سنوياً
                            </p>
                          )}
                        </>
                      ) : (
                        <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#1248C9] to-[#0F3AA5]">
                          حسب الطلب
                        </div>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="space-y-4 mb-8">
                      {Object.entries(plan.features).map(([key, value]) => {
                        if (typeof value === 'boolean') {
                          return (
                            <li key={key} className="flex items-center gap-3">
                              {value ? (
                                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                              ) : (
                                <X className="w-5 h-5 text-slate-300 dark:text-slate-700 shrink-0" />
                              )}
                              <span className={cn(
                                "text-sm",
                                value ? "text-slate-700 dark:text-slate-300" : "text-slate-400 dark:text-slate-600 line-through"
                              )}>
                                {key === 'whitelabel' ? 'White Label' : 
                                 key === 'priority' ? 'دعم بأولوية' :
                                 key === 'customization' ? 'تخصيص الواجهة' :
                                 key === 'api' ? 'API Access' : key}
                              </span>
                            </li>
                          )
                        }
                        return (
                          <li key={key} className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                            <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">
                              {value}
                            </span>
                          </li>
                        )
                      })}
                    </ul>

                    {/* CTA Button */}
                    <Button
                      className={cn(
                        "w-full py-7 text-lg font-bold rounded-xl transition-all duration-300",
                        plan.popular
                          ? "bg-gradient-to-r from-[#155DFC] to-[#1248C9] hover:from-[#1248C9] hover:to-[#0F3AA5] shadow-xl hover:shadow-2xl"
                          : "bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600"
                      )}
                      onClick={() => handleSelectPlan(plan.id)}
                    >
                      {price !== null ? 'اشترك الآن' : 'تواصل معنا'}
                      {price !== null && (
                        <Rocket className="w-5 h-5 mr-2" />
                      )}
                    </Button>

                    {price === 0 && (
                      <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-3">
                        لا تحتاج بطاقة ائتمان
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-black text-center text-slate-900 dark:text-slate-100 mb-12">
            مقارنة شاملة للخطط
          </h2>

          <Card className="overflow-hidden border-2">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900">
                    <th className="text-right p-6 font-bold text-slate-900 dark:text-slate-100">
                      الميزة
                    </th>
                    {plans.map(plan => (
                      <th key={plan.id} className="p-6 text-center">
                        <div className="font-bold text-slate-900 dark:text-slate-100">
                          {plan.name}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((feature, index) => {
                    const Icon = feature.icon
                    return (
                      <tr 
                        key={feature.key}
                        className={cn(
                          "border-t border-slate-200 dark:border-slate-800",
                          index % 2 === 0 && "bg-slate-50/50 dark:bg-slate-900/50"
                        )}
                      >
                        <td className="p-6">
                          <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5 text-blue-600" />
                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                              {feature.name}
                            </span>
                          </div>
                        </td>
                        {plans.map(plan => {
                          const value = plan.features[feature.key as keyof typeof plan.features]
                          return (
                            <td key={plan.id} className="p-6 text-center">
                              {typeof value === 'boolean' ? (
                                value ? (
                                  <CheckCircle2 className="w-6 h-6 text-green-600 mx-auto" />
                                ) : (
                                  <X className="w-6 h-6 text-slate-300 dark:text-slate-700 mx-auto" />
                                )
                              ) : (
                                <span className="text-slate-700 dark:text-slate-300 font-medium">
                                  {value || '-'}
                                </span>
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-black text-center text-slate-900 dark:text-slate-100 mb-12">
            أسئلة شائعة
          </h2>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {[
              {
                q: 'هل يمكنني تغيير خطتي لاحقاً؟',
                a: 'نعم، يمكنك الترقية أو التخفيض في أي وقت. سيتم تطبيق التغييرات على الفور.'
              },
              {
                q: 'ما هي وسائل الدفع المقبولة؟',
                a: 'نقبل جميع البطاقات الائتمانية الرئيسية (Visa, Mastercard, Amex) والدفع الإلكتروني.'
              },
              {
                q: 'هل يوجد عقد طويل الأجل؟',
                a: 'لا، جميع خططنا بدون عقود ملزمة. يمكنك الإلغاء في أي وقت.'
              },
              {
                q: 'هل يمكنني الحصول على فاتورة؟',
                a: 'نعم، يتم إصدار فواتير تلقائية لكل دفعة ويمكنك تحميلها من لوحة التحكم.'
              }
            ].map((faq, index) => (
              <Card key={index} className="border-2">
                <CardHeader>
                  <CardTitle className="text-lg">{faq.q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-400">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <Card className="border-2 border-[#155DFC]/20 dark:border-[#155DFC]/30 bg-gradient-to-br from-[#E6F0FF] to-blue-50 dark:from-[#155DFC]/10 dark:to-[#1248C9]/10">
            <CardContent className="p-12">
              <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100 mb-4">
                هل لديك أسئلة؟
              </h3>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                فريقنا جاهز لمساعدتك في اختيار الخطة المناسبة
              </p>
              <Button
                size="lg"
                onClick={() => router.push('/contact')}
                className="bg-gradient-to-r from-[#155DFC] to-[#1248C9] hover:from-[#1248C9] hover:to-[#0F3AA5] px-8 py-6 text-lg"
              >
                تحدث مع فريق المبيعات
                <Mail className="w-5 h-5 mr-2" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
