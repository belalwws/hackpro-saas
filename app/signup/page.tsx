'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Building2, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Check, 
  ArrowRight,
  Sparkles,
  Rocket,
  Crown,
  Zap
} from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const PLANS = [
  {
    id: 'free',
    name: 'مجاني',
    nameEn: 'Free',
    price: 0,
    icon: Sparkles,
    color: 'from-gray-500 to-gray-600',
    features: [
      '1 هاكاثون نشط',
      '10 مستخدمين',
      '50 مشارك',
      '100 إيميل شهرياً',
      '1GB تخزين',
      'المميزات الأساسية'
    ]
  },
  {
    id: 'starter',
    name: 'مبتدئ',
    nameEn: 'Starter',
    price: 99,
    icon: Rocket,
    color: 'from-blue-500 to-blue-600',
    popular: true,
    features: [
      '3 هاكاثونات نشطة',
      '50 مستخدم',
      '200 مشارك',
      '1,000 إيميل شهرياً',
      '10GB تخزين',
      'جميع المميزات الأساسية',
      'دعم أولوية'
    ]
  },
  {
    id: 'professional',
    name: 'احترافي',
    nameEn: 'Professional',
    price: 299,
    icon: Crown,
    color: 'from-purple-500 to-purple-600',
    features: [
      '10 هاكاثونات نشطة',
      'مستخدمين غير محدودين',
      'مشاركين غير محدودين',
      '5,000 إيميل شهرياً',
      '50GB تخزين',
      'جميع المميزات المتقدمة',
      'دعم 24/7',
      'مدير حساب مخصص'
    ]
  }
]

export default function SignupPage() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState('free')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    organizationName: '',
    organizationSlug: '',
    ownerName: '',
    ownerEmail: '',
    ownerPassword: '',
    ownerPhone: '',
    primaryColor: '#01645e',
    secondaryColor: '#3ab666',
    accentColor: '#c3e956'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/organization/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          plan: selectedPlan
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'فشل في إنشاء الحساب')
      }

      // Success! Redirect to admin dashboard
      router.push('/admin/dashboard')
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Auto-generate slug from organization name
    if (field === 'organizationName') {
      const slug = value
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
      setFormData(prev => ({ ...prev, organizationSlug: slug }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c3e956]/10 via-white to-[#3ab666]/10 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-[#01645e] mb-2">
            ابدأ رحلتك مع HackPro
          </h1>
          <p className="text-lg text-[#8b7632]">
            أنشئ منظمتك وابدأ في إدارة الهاكاثونات بكفاءة
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Plan Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#01645e]" />
                  اختر الخطة المناسبة
                </CardTitle>
                <CardDescription>
                  يمكنك الترقية أو التغيير في أي وقت
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {PLANS.map((plan) => {
                  const Icon = plan.icon
                  return (
                    <motion.div
                      key={plan.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div
                        onClick={() => setSelectedPlan(plan.id)}
                        className={cn(
                          "relative p-4 rounded-lg border-2 cursor-pointer transition-all",
                          selectedPlan === plan.id
                            ? "border-[#01645e] bg-[#01645e]/5 shadow-md"
                            : "border-gray-200 hover:border-[#01645e]/50"
                        )}
                      >
                        {plan.popular && (
                          <Badge className="absolute -top-2 right-4 bg-gradient-to-r from-[#01645e] to-[#3ab666]">
                            الأكثر شعبية
                          </Badge>
                        )}

                        <div className="flex items-start gap-4">
                          <div className={cn(
                            "p-3 rounded-lg bg-gradient-to-br",
                            plan.color,
                            "text-white"
                          )}>
                            <Icon className="w-6 h-6" />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-lg font-bold">{plan.name}</h3>
                              <div className="text-left">
                                {plan.price === 0 ? (
                                  <span className="text-2xl font-bold">مجاناً</span>
                                ) : (
                                  <>
                                    <span className="text-2xl font-bold">${plan.price}</span>
                                    <span className="text-sm text-muted-foreground">/شهر</span>
                                  </>
                                )}
                              </div>
                            </div>

                            <ul className="space-y-1.5 mt-3">
                              {plan.features.map((feature, idx) => (
                                <li key={idx} className="flex items-center gap-2 text-sm">
                                  <Check className="w-4 h-4 text-green-600 shrink-0" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {selectedPlan === plan.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-4 left-4"
                            >
                              <div className="w-6 h-6 rounded-full bg-[#01645e] flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Side - Signup Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>معلومات الحساب</CardTitle>
                <CardDescription>
                  أدخل معلومات المنظمة والمسؤول
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Tabs defaultValue="organization" dir="rtl">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="organization">المنظمة</TabsTrigger>
                      <TabsTrigger value="owner">المسؤول</TabsTrigger>
                    </TabsList>

                    <TabsContent value="organization" className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="orgName">اسم المنظمة *</Label>
                        <div className="relative">
                          <Building2 className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="orgName"
                            placeholder="مثال: شركة التقنية المتطورة"
                            className="pr-9"
                            value={formData.organizationName}
                            onChange={(e) => handleInputChange('organizationName', e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="orgSlug">
                          الرمز (Slug) *
                          <span className="text-xs text-muted-foreground mr-2">
                            (سيظهر في الرابط)
                          </span>
                        </Label>
                        <Input
                          id="orgSlug"
                          placeholder="advanced-tech"
                          value={formData.organizationSlug}
                          onChange={(e) => setFormData(prev => ({ ...prev, organizationSlug: e.target.value }))}
                          pattern="[a-z0-9-]+"
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          yoursite.com/<span className="font-semibold">{formData.organizationSlug || 'your-org'}</span>
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-2">
                          <Label>اللون الأساسي</Label>
                          <Input
                            type="color"
                            value={formData.primaryColor}
                            onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                            className="h-10"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>اللون الثانوي</Label>
                          <Input
                            type="color"
                            value={formData.secondaryColor}
                            onChange={(e) => setFormData(prev => ({ ...prev, secondaryColor: e.target.value }))}
                            className="h-10"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>لون التمييز</Label>
                          <Input
                            type="color"
                            value={formData.accentColor}
                            onChange={(e) => setFormData(prev => ({ ...prev, accentColor: e.target.value }))}
                            className="h-10"
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="owner" className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="ownerName">اسم المسؤول *</Label>
                        <div className="relative">
                          <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="ownerName"
                            placeholder="أحمد محمد"
                            className="pr-9"
                            value={formData.ownerName}
                            onChange={(e) => setFormData(prev => ({ ...prev, ownerName: e.target.value }))}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="ownerEmail">البريد الإلكتروني *</Label>
                        <div className="relative">
                          <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="ownerEmail"
                            type="email"
                            placeholder="admin@example.com"
                            className="pr-9"
                            value={formData.ownerEmail}
                            onChange={(e) => setFormData(prev => ({ ...prev, ownerEmail: e.target.value }))}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="ownerPassword">كلمة المرور *</Label>
                        <div className="relative">
                          <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="ownerPassword"
                            type="password"
                            placeholder="••••••••"
                            className="pr-9"
                            value={formData.ownerPassword}
                            onChange={(e) => setFormData(prev => ({ ...prev, ownerPassword: e.target.value }))}
                            required
                            minLength={6}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="ownerPhone">رقم الجوال</Label>
                        <div className="relative">
                          <Phone className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="ownerPhone"
                            type="tel"
                            placeholder="05xxxxxxxx"
                            className="pr-9"
                            value={formData.ownerPhone}
                            onChange={(e) => setFormData(prev => ({ ...prev, ownerPhone: e.target.value }))}
                          />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  {error && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#01645e] to-[#3ab666] text-white"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                        جاري الإنشاء...
                      </>
                    ) : (
                      <>
                        إنشاء الحساب
                        <ArrowRight className="mr-2 h-4 w-4" />
                      </>
                    )}
                  </Button>

                  <p className="text-center text-sm text-muted-foreground">
                    لديك حساب بالفعل؟{' '}
                    <Link href="/login" className="text-[#01645e] hover:underline font-semibold">
                      تسجيل الدخول
                    </Link>
                  </p>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}


