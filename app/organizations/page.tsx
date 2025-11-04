'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useOrganization, formatBytes, getPlanName } from '@/hooks/use-organization'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Building2, 
  Users, 
  Zap, 
  Mail, 
  HardDrive,
  TrendingUp,
  Settings,
  CreditCard,
  BarChart3,
  AlertCircle,
  CheckCircle2,
  ArrowUpRight,
  Calendar,
  Globe,
  Palette
} from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function OrganizationsPage() {
  const router = useRouter()
  const { organization, usage, isLoading, refreshUsage, checkLimit, isOwner } = useOrganization()

  useEffect(() => {
    if (!isLoading && !organization) {
      router.push('/signup')
    }
  }, [isLoading, organization, router])

  useEffect(() => {
    if (organization) {
      refreshUsage()
    }
  }, [organization, refreshUsage])

  if (isLoading || !organization || !usage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#c3e956]/10 to-[#3ab666]/10 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#01645e]/20 border-t-[#01645e] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#01645e]">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  const usageMetrics = [
    {
      name: 'الهاكاثونات',
      key: 'hackathons',
      icon: Zap,
      color: 'text-blue-600 bg-blue-50',
      ...checkLimit('hackathons')
    },
    {
      name: 'المستخدمين',
      key: 'users',
      icon: Users,
      color: 'text-purple-600 bg-purple-50',
      ...checkLimit('users')
    },
    {
      name: 'المشاركين',
      key: 'participants',
      icon: Users,
      color: 'text-green-600 bg-green-50',
      ...checkLimit('participants')
    },
    {
      name: 'الإيميلات',
      key: 'emails',
      icon: Mail,
      color: 'text-orange-600 bg-orange-50',
      ...checkLimit('emails')
    },
    {
      name: 'التخزين',
      key: 'storage',
      icon: HardDrive,
      color: 'text-pink-600 bg-pink-50',
      ...checkLimit('storage'),
      formatValue: (v: number) => formatBytes(v)
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c3e956]/10 to-[#3ab666]/10 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold text-[#01645e] mb-2">
              {organization.name}
            </h1>
            <p className="text-[#8b7632] flex items-center gap-2">
              <Globe className="w-4 h-4" />
              {organization.slug}
              <Badge className="bg-gradient-to-r from-[#01645e] to-[#3ab666]">
                {getPlanName(organization.plan)}
              </Badge>
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push('/organizations/team')}
            >
              <Users className="w-4 h-4 ml-2" />
              الفريق
            </Button>
            {isOwner && (
              <Button
                onClick={() => router.push('/organizations/billing')}
                className="bg-gradient-to-r from-[#01645e] to-[#3ab666]"
              >
                <CreditCard className="w-4 h-4 ml-2" />
                الترقية
              </Button>
            )}
          </div>
        </motion.div>

        {/* Organization Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#01645e]" />
                معلومات المنظمة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">الخطة الحالية</p>
                  <p className="text-lg font-bold">{getPlanName(organization.plan)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">الحالة</p>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-lg font-bold">نشطة</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">تاريخ الإنشاء</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-lg font-bold">
                      {new Date(organization.createdAt).toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">الألوان</p>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full border-2 border-white shadow"
                      style={{ backgroundColor: organization.primaryColor }}
                    />
                    <div 
                      className="w-4 h-4 rounded-full border-2 border-white shadow"
                      style={{ backgroundColor: organization.secondaryColor }}
                    />
                    <div 
                      className="w-4 h-4 rounded-full border-2 border-white shadow"
                      style={{ backgroundColor: organization.accentColor }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Usage Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#01645e]" />
                الاستخدام الشهري
              </CardTitle>
              <CardDescription>
                استخدامك الحالي مقارنة بحدود خطتك
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {usageMetrics.map((metric, index) => {
                  const Icon = metric.icon
                  const isNearLimit = metric.percentage >= 80
                  const isAtLimit = !metric.allowed

                  return (
                    <motion.div
                      key={metric.key}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <Card className={cn(
                        "relative overflow-hidden",
                        isAtLimit && "border-red-200 bg-red-50/50"
                      )}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className={cn("p-2 rounded-lg", metric.color)}>
                              <Icon className="w-5 h-5" />
                            </div>
                            
                            {isAtLimit && (
                              <Badge variant="destructive" className="text-xs">
                                تجاوز الحد
                              </Badge>
                            )}
                            {isNearLimit && !isAtLimit && (
                              <Badge variant="outline" className="text-xs border-orange-500 text-orange-600">
                                قريب من الحد
                              </Badge>
                            )}
                          </div>

                          <h3 className="text-sm font-medium text-muted-foreground mb-1">
                            {metric.name}
                          </h3>
                          
                          <div className="flex items-baseline gap-2 mb-3">
                            <span className="text-2xl font-bold">
                              {metric.formatValue ? metric.formatValue(metric.current) : metric.current}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              / {metric.formatValue ? metric.formatValue(metric.limit) : metric.limit}
                            </span>
                          </div>

                          <div className="space-y-1.5">
                            <Progress 
                              value={Math.min(metric.percentage, 100)} 
                              className={cn(
                                "h-2",
                                isAtLimit && "[&>div]:bg-red-600",
                                isNearLimit && !isAtLimit && "[&>div]:bg-orange-500"
                              )}
                            />
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">
                                {metric.percentage}% مستخدم
                              </span>
                              {isAtLimit && (
                                <Button
                                  size="sm"
                                  variant="link"
                                  className="h-auto p-0 text-xs text-[#01645e]"
                                  onClick={() => router.push('/organizations/billing')}
                                >
                                  ترقية الخطة
                                  <ArrowUpRight className="w-3 h-3 mr-1" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>

              {/* Warning if near any limit */}
              {usageMetrics.some(m => m.percentage >= 80) && (
                <div className="mt-6 p-4 rounded-lg bg-orange-50 border border-orange-200 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-orange-900 mb-1">
                      اقتربت من حدود خطتك
                    </h4>
                    <p className="text-sm text-orange-700 mb-2">
                      لتجنب انقطاع الخدمة، ننصحك بالترقية إلى خطة أعلى.
                    </p>
                    <Button
                      size="sm"
                      onClick={() => router.push('/organizations/billing')}
                      className="bg-gradient-to-r from-[#01645e] to-[#3ab666]"
                    >
                      عرض خطط الترقية
                      <ArrowUpRight className="w-4 h-4 mr-2" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>إجراءات سريعة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col gap-2"
                  onClick={() => router.push('/organizations/team')}
                >
                  <Users className="w-6 h-6" />
                  <span>إدارة الفريق</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col gap-2"
                  onClick={() => router.push('/organizations/settings')}
                >
                  <Settings className="w-6 h-6" />
                  <span>الإعدادات</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col gap-2"
                  onClick={() => router.push('/organizations/billing')}
                >
                  <CreditCard className="w-6 h-6" />
                  <span>الفواتير</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col gap-2"
                  onClick={() => router.push('/admin/dashboard')}
                >
                  <TrendingUp className="w-6 h-6" />
                  <span>لوحة التحكم</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
