'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BookOpen, 
  Code, 
  Lock, 
  Globe, 
  Users, 
  Shield, 
  Zap,
  Database,
  FileText,
  Award,
  Building2,
  User,
  MessageSquare,
  Settings,
  ExternalLink,
  Copy,
  Check,
  AlertCircle,
  Info,
  Rocket,
  Key,
  Server
} from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Endpoint {
  method: string
  path: string
  description: string
  englishDescription: string
  authRequired: boolean
  requiredRole?: string
  requestBody?: any
  response?: any
  queryParams?: any
  note?: string
}

interface Category {
  category: string
  englishCategory: string
  endpoints: Endpoint[]
}

interface ApiDocumentation {
  api: {
    name: string
    version: string
    baseUrl: string
    description: string
    englishDescription: string
    authentication: {
      type: string
      method: string
      cookieName: string
      headerName: string
    }
    currentUser: {
      id: string
      email: string
      name: string
      role: string
    }
  }
  endpoints: {
    [key: string]: Category
  }
  usage: any
  rateLimiting: any
  errors: any
  support: any
}

const methodColors: Record<string, string> = {
  GET: 'bg-blue-500',
  POST: 'bg-green-500',
  PUT: 'bg-yellow-500',
  PATCH: 'bg-orange-500',
  DELETE: 'bg-red-500',
}

const categoryIcons: Record<string, any> = {
  authentication: Lock,
  hackathons: Rocket,
  admin: Shield,
  participants: Users,
  judges: Award,
  supervisors: User,
  organization: Building2,
  user: User,
  blog: FileText,
  certificates: Award,
  external: Globe,
  system: Server,
}

export default function ApiDocumentationPage() {
  const router = useRouter()
  const [data, setData] = useState<ApiDocumentation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>('overview')

  useEffect(() => {
    fetchDocumentation()
  }, [])

  const fetchDocumentation = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/api', {
        credentials: 'include'
      })

      if (response.status === 401) {
        router.push('/login')
        return
      }

      if (!response.ok) {
        throw new Error('Failed to fetch documentation')
      }

      const result = await response.json()
      if (result.success) {
        setData(result)
      } else {
        setError(result.message || 'Failed to load documentation')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      if (err instanceof Error && err.message.includes('401')) {
        router.push('/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">جاري تحميل التوثيق...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              خطأ في التحميل
            </CardTitle>
            <CardDescription>{error || 'فشل تحميل التوثيق'}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/login')} className="w-full">
              تسجيل الدخول
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const categories = Object.entries(data.endpoints)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-blue-600" />
                {data.api.name}
              </h1>
              <p className="text-slate-600 mt-2">{data.api.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">v{data.api.version}</Badge>
                <Badge variant="secondary">{data.api.baseUrl}</Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600">المستخدم الحالي</p>
              <p className="font-semibold text-slate-900">{data.api.currentUser.name}</p>
              <Badge variant="outline" className="mt-1">{data.api.currentUser.role}</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6 mb-6">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="endpoints">الـ Endpoints</TabsTrigger>
            <TabsTrigger value="usage">كيفية الاستخدام</TabsTrigger>
            <TabsTrigger value="errors">الأخطاء</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  معلومات API
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">اسم API</p>
                    <p className="font-semibold">{data.api.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">الإصدار</p>
                    <p className="font-semibold">v{data.api.version}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Base URL</p>
                    <p className="font-semibold font-mono text-sm">{data.api.baseUrl}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">نوع المصادقة</p>
                    <p className="font-semibold">{data.api.authentication.type}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  المصادقة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-slate-600 mb-2">طريقة المصادقة:</p>
                  <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                    <p className="font-mono text-sm">
                      <span className="text-blue-600">Cookie:</span> {data.api.authentication.cookieName}
                    </p>
                    <p className="font-mono text-sm">
                      <span className="text-blue-600">Header:</span> {data.api.authentication.headerName}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-slate-600">
                  جميع الـ endpoints تتطلب مصادقة ما لم يُذكر خلاف ذلك
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Rate Limiting
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">افتراضي:</span>
                    <Badge>{data.rateLimiting.limits.default}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">مستخدم مسجل:</span>
                    <Badge>{data.rateLimiting.limits.authenticated}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">مدير:</span>
                    <Badge>{data.rateLimiting.limits.admin}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Endpoints Tab */}
          <TabsContent value="endpoints" className="space-y-6">
            {categories.map(([key, category]) => {
              const Icon = categoryIcons[key] || Code
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Icon className="w-5 h-5 text-blue-600" />
                        {category.category}
                        <span className="text-sm font-normal text-slate-500">
                          ({category.englishCategory})
                        </span>
                      </CardTitle>
                      <CardDescription>
                        {category.endpoints.length} endpoint
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {category.endpoints.map((endpoint, idx) => (
                          <div
                            key={idx}
                            className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors bg-white"
                          >
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <div className="flex items-center gap-3 flex-1">
                                <Badge
                                  className={cn(
                                    'text-white font-mono',
                                    methodColors[endpoint.method] || 'bg-gray-500'
                                  )}
                                >
                                  {endpoint.method}
                                </Badge>
                                <code className="text-sm font-mono text-slate-700 bg-slate-50 px-2 py-1 rounded flex-1">
                                  {endpoint.path}
                                </code>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(endpoint.path, `${key}-${idx}`)}
                                  className="h-8 w-8 p-0"
                                >
                                  {copied === `${key}-${idx}` ? (
                                    <Check className="w-4 h-4 text-green-600" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                            <p className="text-slate-700 mb-2">{endpoint.description}</p>
                            <p className="text-sm text-slate-500 mb-3">
                              {endpoint.englishDescription}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {endpoint.authRequired && (
                                <Badge variant="outline" className="text-xs">
                                  <Lock className="w-3 h-3 mr-1" />
                                  يتطلب مصادقة
                                </Badge>
                              )}
                              {endpoint.requiredRole && (
                                <Badge variant="secondary" className="text-xs">
                                  Role: {endpoint.requiredRole}
                                </Badge>
                              )}
                              {endpoint.note && (
                                <Badge variant="outline" className="text-xs">
                                  <Info className="w-3 h-3 mr-1" />
                                  {endpoint.note}
                                </Badge>
                              )}
                            </div>
                            {endpoint.requestBody && (
                              <div className="mt-3 pt-3 border-t border-slate-200">
                                <p className="text-xs font-semibold text-slate-600 mb-1">Request Body:</p>
                                <pre className="text-xs bg-slate-50 p-2 rounded overflow-x-auto">
                                  {JSON.stringify(endpoint.requestBody, null, 2)}
                                </pre>
                              </div>
                            )}
                            {endpoint.queryParams && (
                              <div className="mt-3 pt-3 border-t border-slate-200">
                                <p className="text-xs font-semibold text-slate-600 mb-1">Query Parameters:</p>
                                <pre className="text-xs bg-slate-50 p-2 rounded overflow-x-auto">
                                  {JSON.stringify(endpoint.queryParams, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </TabsContent>

          {/* Usage Tab */}
          <TabsContent value="usage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>كيفية استخدام API</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {data.usage.authentication.steps.map((step: any, idx: number) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-700 mb-1">{step.arabic}</p>
                      <p className="text-sm text-slate-500">{step.english}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>مثال على الطلب (cURL)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                    {data.usage.example.curl}
                  </pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(data.usage.example.curl, 'curl')}
                    className="absolute top-2 left-2"
                  >
                    {copied === 'curl' ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-white" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>مثال على الطلب (JavaScript)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                    {data.usage.example.javascript}
                  </pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(data.usage.example.javascript, 'js')}
                    className="absolute top-2 left-2"
                  >
                    {copied === 'js' ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-white" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Errors Tab */}
          <TabsContent value="errors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  رموز الأخطاء الشائعة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.errors.common.map((error: any, idx: number) => (
                    <div key={idx} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge
                          variant={error.code === 500 ? 'destructive' : 'outline'}
                          className="font-mono"
                        >
                          {error.code}
                        </Badge>
                        <p className="font-semibold">{error.message}</p>
                      </div>
                      <p className="text-sm text-slate-500">{error.english}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-slate-200 mt-12">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">{data.support.note}</p>
              <p className="text-sm text-slate-500 mt-1">{data.support.englishNote}</p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" size="sm" asChild>
                <a href={data.support.documentation} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  الوثائق
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href={data.support.issues} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  الإبلاغ عن مشكلة
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



