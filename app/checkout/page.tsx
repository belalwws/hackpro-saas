'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PaymentGateway } from '@/components/payment-gateway'
import {
  CheckCircle2,
  ArrowRight,
  Shield,
  Zap,
  Users,
  Mail,
  HardDrive,
  Crown,
  Sparkles,
  Building2,
  Lock,
  Clock
} from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const plansData = {
  free: {
    name: 'البداية',
    nameEn: 'Starter',
    icon: Sparkles,
    color: 'from-gray-500 to-gray-600',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      '1 هاكاثون نشط',
      '50 مشارك',
      '10 أعضاء فريق',
      '1GB تخزين',
      '100 إيميل/شهر'
    ]
  },
  professional: {
    name: 'الاحترافي',
    nameEn: 'Professional',
    icon: Crown,
    color: 'from-blue-600 to-purple-600',
    monthlyPrice: 299,
    yearlyPrice: 2990,
    features: [
      '10 هاكاثونات نشطة',
      'مشاركين غير محدودين',
      'فريق غير محدود',
      '50GB تخزين',
      '5,000 إيميل/شهر',
      'تحليلات متقدمة',
      'صفحات هبوط مخصصة',
      'دعم أولوية'
    ]
  },
  enterprise: {
    name: 'المؤسسات',
    nameEn: 'Enterprise',
    icon: Building2,
    color: 'from-purple-600 to-pink-600',
    monthlyPrice: null,
    yearlyPrice: null,
    features: [
      'كل شيء غير محدود',
      'نطاق مخصص',
      'API مخصص',
      'مدير حساب مخصص',
      'تدريب وإعداد',
      'SLA مضمون',
      'دعم 24/7'
    ]
  }
}

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const planId = searchParams.get('plan') || 'professional'
  const billingCycle = (searchParams.get('billing') || 'monthly') as 'monthly' | 'yearly'

  const plan = plansData[planId as keyof typeof plansData]
  const amount = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice

  if (!plan || amount === null) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">خطة غير صالحة</h2>
            <p className="text-slate-600 mb-6">
              يرجى اختيار خطة صالحة من صفحة الأسعار
            </p>
            <Button onClick={() => router.push('/pricing')}>
              العودة إلى الأسعار
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const Icon = plan.icon

  const handlePaymentSuccess = async (paymentData: any) => {
    setLoading(true)
    
    try {
      // TODO: Send payment data to backend to create subscription
      // const response = await fetch('/api/subscriptions/create', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     plan: planId,
      //     billingCycle,
      //     paymentData
      //   })
      // })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      setPaymentSuccess(true)

      // Redirect to success page after 2 seconds
      setTimeout(() => {
        router.push('/organizations?payment=success')
      }, 2000)
    } catch (error) {
      console.error('Error creating subscription:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error)
    // Show error notification
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
        >
          <Card className="max-w-md border-2 border-green-200 shadow-2xl">
            <CardContent className="p-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl"
              >
                <CheckCircle2 className="w-12 h-12 text-white" />
              </motion.div>
              
              <h2 className="text-3xl font-black text-slate-900 mb-3">
                تم الدفع بنجاح!
              </h2>
              
              <p className="text-lg text-slate-600 mb-6">
                تم تفعيل اشتراكك في خطة {plan.name}
              </p>

              <div className="flex items-center justify-center gap-2 text-sm text-slate-600 mb-8">
                <Clock className="w-4 h-4" />
                <span>جاري التوجيه إلى لوحة التحكم...</span>
              </div>

              <div className="animate-pulse">
                <div className="w-12 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded mx-auto"></div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Badge className="mb-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg shadow-lg">
            <Lock className="w-5 h-5 ml-2" />
            الدفع الآمن
          </Badge>
          
          <h1 className="text-4xl sm:text-5xl font-display font-black text-slate-900 dark:text-slate-100 mb-2">
            أكمل عملية الاشتراك
          </h1>
          
          <p className="text-lg text-slate-600 dark:text-slate-400">
            أنت على بعد خطوة واحدة من البدء
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Order Summary - Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="border-2 sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  ملخص الطلب
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Plan Info */}
                <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                  <div className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br",
                    plan.color
                  )}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      خطة {plan.nameEn}
                    </p>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">
                    ما ستحصل عليه:
                  </h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pricing Breakdown */}
                <div className="space-y-3 pt-4 border-t-2 border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">
                      {billingCycle === 'monthly' ? 'الاشتراك الشهري' : 'الاشتراك السنوي'}
                    </span>
                    <span className="font-semibold">${amount}</span>
                  </div>
                  
                  {billingCycle === 'yearly' && (
                    <div className="flex justify-between text-green-600">
                      <span>التوفير السنوي</span>
                      <span className="font-semibold">$598</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                    <span>الضريبة</span>
                    <span>محسوبة عند الدفع</span>
                  </div>

                  <div className="flex justify-between pt-3 border-t-2 border-slate-200 dark:border-slate-800">
                    <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      الإجمالي
                    </span>
                    <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                      ${amount}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-500 text-center pt-2">
                    {billingCycle === 'monthly' 
                      ? 'يتم تجديد الاشتراك تلقائياً كل شهر'
                      : 'يتم تجديد الاشتراك تلقائياً كل سنة'
                    }
                  </p>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span>دفع آمن 100%</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>استرجاع 30 يوم</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <Lock className="w-4 h-4 text-green-600" />
                    <span>تشفير SSL</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <Zap className="w-4 h-4 text-green-600" />
                    <span>تفعيل فوري</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Payment Form - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <PaymentGateway
              amount={amount!}
              plan={planId}
              billingCycle={billingCycle}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />

            {/* Back to Pricing */}
            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                onClick={() => router.push('/pricing')}
                className="text-slate-600 hover:text-slate-900"
              >
                <ArrowRight className="w-4 h-4 ml-2" />
                العودة إلى الأسعار
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Security Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            معلومات الدفع الخاصة بك محمية بأعلى معايير الأمان
          </p>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center text-white text-xs font-bold">
                VISA
              </div>
              <div className="w-12 h-8 bg-gradient-to-r from-orange-600 to-red-600 rounded flex items-center justify-center text-white text-xs font-bold">
                MC
              </div>
              <div className="w-12 h-8 bg-gradient-to-r from-blue-800 to-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                AMEX
              </div>
            </div>
            <div className="text-xs text-slate-500">
              Powered by Stripe
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">جاري التحميل...</p>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}


