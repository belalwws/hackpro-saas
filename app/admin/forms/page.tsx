"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, FileText, Eye, Edit, Trash2, Users, Calendar, BarChart3, Share2, Mail, Copy, Send, Award, UserCheck, Palette, ExternalLink, Settings, MessageSquare, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Hackathon {
  id: string
  title: string
  description: string
  status: string
}

export default function FormsManagement() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [hackathons, setHackathons] = useState<Hackathon[]>([])
  const [selectedHackathon, setSelectedHackathon] = useState<string>('')

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/login')
      return
    }
    fetchHackathons()
  }, [user, router])

  const fetchHackathons = async () => {
    try {
      const response = await fetch('/api/hackathons?all=true')
      if (response.ok) {
        const data = await response.json()
        // API returns { hackathons: [...] }
        const hackathonsArray = Array.isArray(data.hackathons) ? data.hackathons : (Array.isArray(data) ? data : [])
        setHackathons(hackathonsArray)
        if (hackathonsArray.length > 0) {
          setSelectedHackathon(hackathonsArray[0].id)
        }
      } else {
        setHackathons([])
      }
    } catch (error) {
      console.error('Error fetching hackathons:', error)
      setHackathons([])
    } finally {
      setLoading(false)
    }
  }

  const copyLink = async (url: string, label: string) => {
    try {
      await navigator.clipboard.writeText(url)
      alert(`تم نسخ رابط ${label} بنجاح!`)
    } catch (error) {
      console.error('Error copying link:', error)
      alert('حدث خطأ في نسخ الرابط')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50/50 to-blue-100/50 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-blue-600 dark:text-blue-400 font-semibold">جاري تحميل الفورمات...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-blue-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 p-6 mb-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-3">
                    إدارة الفورمات
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    إدارة جميع فورمات الهاكاثون من مكان واحد
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Hackathon Selector */}
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-md rounded-xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    اختر الهاكاثون
                  </label>
                  <Select value={selectedHackathon} onValueChange={setSelectedHackathon}>
                    <SelectTrigger className="w-full h-11 dark:bg-slate-700 dark:border-slate-600 hover:border-blue-400 transition-colors">
                      <SelectValue placeholder="اختر هاكاثون" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-slate-700">
                      {hackathons.map((hackathon) => (
                        <SelectItem key={hackathon.id} value={hackathon.id} className="dark:text-slate-200">
                          {hackathon.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {selectedHackathon && (
                  <div className="text-sm pt-8">
                    <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-700 px-3 py-1.5 font-medium">
                      {hackathons.find(h => h.id === selectedHackathon)?.status}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Forms Grid */}
        {selectedHackathon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Tabs defaultValue="judges" className="flex gap-6 items-start">
              {/* Content */}
              <div className="flex-1 min-w-0">

              {/* Judge Forms Tab */}
              <TabsContent value="judges">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Judge Application Form */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Card className="hover:shadow-2xl transition-all duration-300 border-2 border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-800 rounded-xl overflow-hidden group hover:border-blue-400 dark:hover:border-blue-600">
                      <CardHeader className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-blue-900/20 p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 dark:bg-blue-500/10 rounded-full -mr-16 -mt-16"></div>
                        <div className="flex items-center justify-between relative z-10">
                          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg group-hover:scale-110 transition-transform">
                            <Award className="w-6 h-6 text-white" />
                          </div>
                          <Badge className="bg-blue-600 dark:bg-blue-500 text-white px-3 py-1 font-semibold shadow-md">محكمين</Badge>
                        </div>
                        <CardTitle className="text-xl text-blue-900 dark:text-blue-100 mt-6 font-bold relative z-10">
                          فورم طلب الانضمام كمحكم
                        </CardTitle>
                        <CardDescription className="dark:text-slate-300 text-sm leading-relaxed relative z-10">
                          فورم ديناميكي لاستقبال طلبات المحكمين - أضف الحقول التي تريدها
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6 space-y-3">
                        <div className="flex flex-col gap-2.5">
                          <Link href={`/admin/judge-form-builder/${selectedHackathon}`}>
                            <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 dark:from-blue-600 dark:to-indigo-600 shadow-md hover:shadow-lg transition-all h-10 font-medium">
                              <Settings className="w-4 h-4 ml-2" />
                              بناء الفورم
                            </Button>
                          </Link>
                          
                          <Button
                            variant="outline"
                            className="w-full border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20 transition-all h-10 font-medium"
                            onClick={() => window.open(`/judge/apply/${selectedHackathon}`, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4 ml-2" />
                            معاينة الفورم
                          </Button>

                          <Button
                            variant="outline"
                            className="w-full dark:border-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all h-10 font-medium"
                            onClick={() => copyLink(`${window.location.origin}/judge/apply/${selectedHackathon}`, 'فورم المحكمين')}
                          >
                            <Copy className="w-4 h-4 ml-2" />
                            نسخ الرابط
                          </Button>

                          <Link href="/admin/judges">
                            <Button variant="outline" className="w-full border-blue-300 dark:border-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all h-10 font-medium">
                              <Users className="w-4 h-4 ml-2" />
                              إدارة الطلبات
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Judge Invitation Form */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Card className="hover:shadow-2xl transition-all duration-300 border-2 border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-800 rounded-xl overflow-hidden group hover:border-blue-400 dark:hover:border-blue-600">
                      <CardHeader className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-blue-900/20 p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 dark:bg-blue-500/10 rounded-full -mr-16 -mt-16"></div>
                        <div className="flex items-center justify-between relative z-10">
                          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg group-hover:scale-110 transition-transform">
                            <Mail className="w-6 h-6 text-white" />
                          </div>
                          <Badge className="bg-blue-600 dark:bg-blue-500 text-white px-3 py-1 font-semibold shadow-md">دعوات</Badge>
                        </div>
                        <CardTitle className="text-xl text-blue-900 dark:text-blue-100 mt-6 font-bold relative z-10">
                          نظام دعوات المحكمين
                        </CardTitle>
                        <CardDescription className="dark:text-slate-300 text-sm leading-relaxed relative z-10">
                          إرسال دعوات مخصصة للمحكمين عبر البريد الإلكتروني
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6 space-y-3">
                        <div className="flex flex-col gap-2.5">
                          <Link href="/admin/judges">
                            <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 dark:from-blue-600 dark:to-indigo-600 shadow-md hover:shadow-lg transition-all h-10 font-medium">
                              <Mail className="w-4 h-4 ml-2" />
                              إدارة الدعوات
                            </Button>
                          </Link>

                          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                            <p className="font-semibold mb-2 text-blue-800 dark:text-blue-200 flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              نظام الدعوات
                            </p>
                            <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">يمكنك إرسال دعوات مخصصة للمحكمين مع روابط تسجيل فريدة</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </TabsContent>

              {/* Expert Forms Tab */}
              <TabsContent value="experts">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Expert Application Form */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Card className="hover:shadow-2xl transition-all duration-300 border-2 border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-800 rounded-xl overflow-hidden group hover:border-blue-400 dark:hover:border-blue-600">
                      <CardHeader className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-blue-900/20 p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 dark:bg-blue-500/10 rounded-full -mr-16 -mt-16"></div>
                        <div className="flex items-center justify-between relative z-10">
                          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg group-hover:scale-110 transition-transform">
                            <Users className="w-6 h-6 text-white" />
                          </div>
                          <Badge className="bg-blue-600 dark:bg-blue-500 text-white px-3 py-1 font-semibold shadow-md">خبراء</Badge>
                        </div>
                        <CardTitle className="text-xl text-blue-900 dark:text-blue-100 mt-6 font-bold relative z-10">
                          فورم طلب الانضمام كخبير
                        </CardTitle>
                        <CardDescription className="dark:text-slate-300 text-sm leading-relaxed relative z-10">
                          فورم ديناميكي لاستقبال طلبات الخبراء - أضف الحقول والصور التي تريدها
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6 space-y-3">
                        <div className="flex flex-col gap-2.5">
                          <Link href={`/admin/expert-form-builder/${selectedHackathon}`}>
                            <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 dark:from-blue-600 dark:to-indigo-600 shadow-md hover:shadow-lg transition-all h-10 font-medium">
                              <Settings className="w-4 h-4 ml-2" />
                              بناء الفورم
                            </Button>
                          </Link>
                          
                          <Button
                            variant="outline"
                            className="w-full border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20 transition-all h-10 font-medium"
                            onClick={() => window.open(`/expert/apply/${selectedHackathon}`, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4 ml-2" />
                            معاينة الفورم
                          </Button>

                          <Button
                            variant="outline"
                            className="w-full dark:border-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all h-10 font-medium"
                            onClick={() => copyLink(`${window.location.origin}/expert/apply/${selectedHackathon}`, 'فورم الخبراء')}
                          >
                            <Copy className="w-4 h-4 ml-2" />
                            نسخ الرابط
                          </Button>

                          <Link href="/admin/experts">
                            <Button variant="outline" className="w-full border-blue-300 dark:border-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all h-10 font-medium">
                              <Users className="w-4 h-4 ml-2" />
                              إدارة الطلبات
                            </Button>
                          </Link>
                        </div>
                        
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 mt-4">
                          <p className="font-semibold mb-2 text-blue-800 dark:text-blue-200 flex items-center gap-2">
                            <Award className="w-4 h-4" />
                            مميزات الفورم
                          </p>
                          <ul className="text-xs space-y-1.5 text-blue-700 dark:text-blue-300">
                            <li className="flex items-center gap-1.5">• رفع صورة الخبير على Cloudinary</li>
                            <li className="flex items-center gap-1.5">• حقول ديناميكية قابلة للتخصيص</li>
                            <li className="flex items-center gap-1.5">• دعم المرفقات والملفات</li>
                            <li className="flex items-center gap-1.5">• معلومات احترافية للخبير</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Expert Invitation Form */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Card className="hover:shadow-2xl transition-all duration-300 border-2 border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-800 rounded-xl overflow-hidden group hover:border-blue-400 dark:hover:border-blue-600">
                      <CardHeader className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-blue-900/20 p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 dark:bg-blue-500/10 rounded-full -mr-16 -mt-16"></div>
                        <div className="flex items-center justify-between relative z-10">
                          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg group-hover:scale-110 transition-transform">
                            <Mail className="w-6 h-6 text-white" />
                          </div>
                          <Badge className="bg-blue-600 dark:bg-blue-500 text-white px-3 py-1 font-semibold shadow-md">دعوات</Badge>
                        </div>
                        <CardTitle className="text-xl text-blue-900 dark:text-blue-100 mt-6 font-bold relative z-10">
                          نظام دعوات الخبراء
                        </CardTitle>
                        <CardDescription className="dark:text-slate-300 text-sm leading-relaxed relative z-10">
                          إرسال دعوات مخصصة للخبراء عبر البريد الإلكتروني
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6 space-y-3">
                        <div className="flex flex-col gap-2.5">
                          <Link href="/admin/experts">
                            <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 dark:from-blue-600 dark:to-indigo-600 shadow-md hover:shadow-lg transition-all h-10 font-medium">
                              <Mail className="w-4 h-4 ml-2" />
                              إدارة الدعوات
                            </Button>
                          </Link>

                          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                            <p className="font-semibold mb-2 text-blue-800 dark:text-blue-200 flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              نظام الدعوات
                            </p>
                            <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">يمكنك إرسال دعوات مخصصة للخبراء مع روابط تسجيل فريدة</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </TabsContent>

              {/* Supervision Forms Tab */}
              <TabsContent value="supervision">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Supervision Application Form */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Card className="hover:shadow-2xl transition-all duration-300 border-2 border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-800 rounded-xl overflow-hidden group hover:border-blue-400 dark:hover:border-blue-600">
                      <CardHeader className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-blue-900/20 p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 dark:bg-blue-500/10 rounded-full -mr-16 -mt-16"></div>
                        <div className="flex items-center justify-between relative z-10">
                          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg group-hover:scale-110 transition-transform">
                            <UserCheck className="w-6 h-6 text-white" />
                          </div>
                          <Badge className="bg-blue-600 dark:bg-blue-500 text-white px-3 py-1 font-semibold shadow-md">إشراف</Badge>
                        </div>
                        <CardTitle className="text-xl text-blue-900 dark:text-blue-100 mt-6 font-bold relative z-10">
                          فورم طلب الانضمام للإشراف
                        </CardTitle>
                        <CardDescription className="dark:text-slate-300 text-sm leading-relaxed relative z-10">
                          فورم ديناميكي لاستقبال طلبات الإشراف - أضف الحقول والصور التي تريدها
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6 space-y-3">
                        <div className="flex flex-col gap-2.5">
                          <Link href={`/admin/supervision-form-builder/${selectedHackathon}`}>
                            <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 dark:from-blue-600 dark:to-indigo-600 shadow-md hover:shadow-lg transition-all h-10 font-medium">
                              <Settings className="w-4 h-4 ml-2" />
                              بناء الفورم
                            </Button>
                          </Link>
                          
                          <Button
                            variant="outline"
                            className="w-full border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20 transition-all h-10 font-medium"
                            onClick={() => window.open(`/supervision/${selectedHackathon}`, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4 ml-2" />
                            معاينة الفورم
                          </Button>

                          <Button
                            variant="outline"
                            className="w-full dark:border-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all h-10 font-medium"
                            onClick={() => copyLink(`${window.location.origin}/supervision/${selectedHackathon}`, 'فورم الإشراف')}
                          >
                            <Copy className="w-4 h-4 ml-2" />
                            نسخ الرابط
                          </Button>

                          <Link href={`/admin/supervision-submissions/${selectedHackathon}`}>
                            <Button variant="outline" className="w-full border-blue-300 dark:border-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all h-10 font-medium">
                              <Users className="w-4 h-4 ml-2" />
                              إدارة الطلبات
                            </Button>
                          </Link>
                        </div>
                        
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 mt-4">
                          <p className="font-semibold mb-2 text-blue-800 dark:text-blue-200 flex items-center gap-2">
                            <Award className="w-4 h-4" />
                            مميزات الفورم
                          </p>
                          <ul className="text-xs space-y-1.5 text-blue-700 dark:text-blue-300">
                            <li className="flex items-center gap-1.5">• رفع صور الغلاف على Cloudinary</li>
                            <li className="flex items-center gap-1.5">• حقول ديناميكية قابلة للتخصيص</li>
                            <li className="flex items-center gap-1.5">• دعم المرفقات والملفات</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </TabsContent>



              {/* Feedback Forms Tab */}
              <TabsContent value="feedback">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Hackathon Feedback Form */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Card className="hover:shadow-2xl transition-all duration-300 border-2 border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-800 rounded-xl overflow-hidden group hover:border-blue-400 dark:hover:border-blue-600">
                      <CardHeader className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-blue-900/20 p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 dark:bg-blue-500/10 rounded-full -mr-16 -mt-16"></div>
                        <div className="flex items-center justify-between relative z-10">
                          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg group-hover:scale-110 transition-transform">
                            <MessageSquare className="w-6 h-6 text-white" />
                          </div>
                          <Badge className="bg-blue-600 dark:bg-blue-500 text-white px-3 py-1 font-semibold shadow-md">تقييم</Badge>
                        </div>
                        <CardTitle className="text-xl text-blue-900 dark:text-blue-100 mt-6 font-bold relative z-10">
                          فورم تقييم الهاكاثون
                        </CardTitle>
                        <CardDescription className="dark:text-slate-300 text-sm leading-relaxed relative z-10">
                          فورم ديناميكي لجمع آراء وتقييمات المشاركين - أضف الحقول التي تريدها
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6 space-y-3">
                        <div className="flex flex-col gap-2.5">
                          <Link href={`/admin/feedback-form-builder/${selectedHackathon}`}>
                            <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 dark:from-blue-600 dark:to-indigo-600 shadow-md hover:shadow-lg transition-all h-10 font-medium">
                              <Settings className="w-4 h-4 ml-2" />
                              بناء الفورم
                            </Button>
                          </Link>

                          <Button
                            variant="outline"
                            className="w-full border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20 transition-all h-10 font-medium"
                            onClick={() => window.open(`/feedback/${selectedHackathon}`, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4 ml-2" />
                            معاينة الفورم
                          </Button>

                          <Button
                            variant="outline"
                            className="w-full dark:border-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all h-10 font-medium"
                            onClick={() => copyLink(`${window.location.origin}/feedback/${selectedHackathon}`, 'فورم التقييم')}
                          >
                            <Copy className="w-4 h-4 ml-2" />
                            نسخ الرابط
                          </Button>

                          <Link href={`/admin/hackathons/${selectedHackathon}/feedback-results`}>
                            <Button variant="outline" className="w-full border-blue-300 dark:border-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all h-10 font-medium">
                              <BarChart3 className="w-4 h-4 ml-2" />
                              عرض النتائج
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </TabsContent>

              {/* Registration Forms Tab */}
              <TabsContent value="registration">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Registration Form */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Card className="hover:shadow-2xl transition-all duration-300 border-2 border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-800 rounded-xl overflow-hidden group hover:border-blue-400 dark:hover:border-blue-600">
                      <CardHeader className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-blue-900/20 p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 dark:bg-blue-500/10 rounded-full -mr-16 -mt-16"></div>
                        <div className="flex items-center justify-between relative z-10">
                          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg group-hover:scale-110 transition-transform">
                            <Users className="w-6 h-6 text-white" />
                          </div>
                          <Badge className="bg-blue-600 dark:bg-blue-500 text-white px-3 py-1 font-semibold shadow-md">تسجيل</Badge>
                        </div>
                        <CardTitle className="text-xl text-blue-900 dark:text-blue-100 mt-6 font-bold relative z-10">
                          فورم تسجيل المشاركين
                        </CardTitle>
                        <CardDescription className="dark:text-slate-300 text-sm leading-relaxed relative z-10">
                          فورم التسجيل الديناميكي للمشاركين في الهاكاثون
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6 space-y-3">
                        <div className="flex flex-col gap-2.5">
                          <Link href={`/admin/hackathons/${selectedHackathon}/registration-form`}>
                            <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 dark:from-blue-600 dark:to-indigo-600 shadow-md hover:shadow-lg transition-all h-10 font-medium">
                              <Settings className="w-4 h-4 ml-2" />
                              إعداد الفورم
                            </Button>
                          </Link>

                          <Link href={`/admin/hackathons/${selectedHackathon}/registration-form-schedule`}>
                            <Button variant="outline" className="w-full border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20 transition-all h-10 font-medium">
                              <Clock className="w-4 h-4 ml-2" />
                              جدولة المواعيد
                            </Button>
                          </Link>

                          <Link href={`/admin/hackathons/${selectedHackathon}/register-form-design`}>
                            <Button variant="outline" className="w-full border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all h-10 font-medium">
                              <Palette className="w-4 h-4 ml-2" />
                              تصميم الفورم
                            </Button>
                          </Link>

                          <Button
                            variant="outline"
                            className="w-full dark:border-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all h-10 font-medium"
                            onClick={() => window.open(`/hackathons/${selectedHackathon}/register-form`, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4 ml-2" />
                            معاينة الفورم
                          </Button>

                          <Button
                            variant="outline"
                            className="w-full dark:border-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all h-10 font-medium"
                            onClick={() => copyLink(`${window.location.origin}/hackathons/${selectedHackathon}/register-form`, 'فورم التسجيل')}
                          >
                            <Copy className="w-4 h-4 ml-2" />
                            نسخ الرابط
                          </Button>

                          <Link href={`/admin/hackathons/${selectedHackathon}/form-submissions`}>
                            <Button variant="outline" className="w-full border-blue-300 dark:border-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all h-10 font-medium">
                              <FileText className="w-4 h-4 ml-2" />
                              النماذج المرسلة
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </TabsContent>
              </div>

              {/* Sidebar - Right Side */}
              <div className="w-64 shrink-0 sticky top-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg p-4">
                  <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3 px-2">الفورمات</h3>
                  <TabsList className="flex flex-col w-full h-auto bg-transparent p-0 gap-1.5">
                    <TabsTrigger 
                      value="judges"
                      className="w-full justify-start data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-700 data-[state=active]:hover:from-blue-600 data-[state=active]:hover:to-indigo-700 rounded-lg py-3 px-3 dark:text-slate-200 font-medium"
                    >
                      <Award className="w-4 h-4 ml-2" />
                      فورم المحكمين
                    </TabsTrigger>
                    <TabsTrigger 
                      value="experts"
                      className="w-full justify-start data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-700 data-[state=active]:hover:from-blue-600 data-[state=active]:hover:to-indigo-700 rounded-lg py-3 px-3 dark:text-slate-200 font-medium"
                    >
                      <Users className="w-4 h-4 ml-2" />
                      فورم الخبراء
                    </TabsTrigger>
                    <TabsTrigger 
                      value="supervision"
                      className="w-full justify-start data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-700 data-[state=active]:hover:from-blue-600 data-[state=active]:hover:to-indigo-700 rounded-lg py-3 px-3 dark:text-slate-200 font-medium"
                    >
                      <UserCheck className="w-4 h-4 ml-2" />
                      فورم الإشراف
                    </TabsTrigger>
                    <TabsTrigger 
                      value="feedback"
                      className="w-full justify-start data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-700 data-[state=active]:hover:from-blue-600 data-[state=active]:hover:to-indigo-700 rounded-lg py-3 px-3 dark:text-slate-200 font-medium"
                    >
                      <MessageSquare className="w-4 h-4 ml-2" />
                      فورم التقييم
                    </TabsTrigger>
                    <TabsTrigger 
                      value="registration"
                      className="w-full justify-start data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-700 data-[state=active]:hover:from-blue-600 data-[state=active]:hover:to-indigo-700 rounded-lg py-3 px-3 dark:text-slate-200 font-medium"
                    >
                      <Users className="w-4 h-4 ml-2" />
                      فورم التسجيل
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>
            </Tabs>
          </motion.div>
        )}

        {/* Empty State */}
        {!selectedHackathon && hackathons.length === 0 && (
          <Card className="text-center p-12 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <FileText className="w-16 h-16 text-gray-400 dark:text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-slate-300 mb-2">
              لا توجد هاكاثونات
            </h3>
            <p className="text-gray-500 dark:text-slate-400 mb-6">
              قم بإنشاء هاكاثون أولاً لإدارة الفورمات
            </p>
            <Link href="/admin/hackathons">
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 dark:from-blue-600 dark:to-indigo-600">
                <Plus className="w-4 h-4 ml-2" />
                إنشاء هاكاثون
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  )
}

