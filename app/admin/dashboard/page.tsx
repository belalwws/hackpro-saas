'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/language-context'
import { motion } from 'framer-motion'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { 
  Trophy, Users, Calendar, Settings, Bell, Search, Menu,
  BarChart3, Shield, Building2, Plus, TrendingUp, UserPlus,
  Clock, CheckCircle2, XCircle, Gavel, Eye, Palette, FileText, Award,
  Box, ChevronDown
} from 'lucide-react'
import { 
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

interface OrganizationStats {
  totalHackathons: number
  activeHackathons: number
  totalParticipants: number
  pendingParticipants: number
  approvedParticipants: number
  rejectedParticipants: number
  totalUsers: number
  totalTeams: number
  totalJudges: number
  recentHackathons: any[]
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const { language } = useLanguage()
  const [stats, setStats] = useState<OrganizationStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/login')
      return
    }
    fetchData()
  }, [user])

  const fetchData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const COLORS = ['#4f46e5', '#06b6d4', '#f59e0b', '#10b981', '#ef4444']

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative mb-6">
            <div className="w-24 h-24 border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Shield className="h-10 w-10 text-indigo-600 animate-pulse" />
            </div>
          </div>
          <p className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {language === 'ar' ? 'جاري التحميل...' : 'Loading Dashboard...'}
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer">
                <ChevronDown className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2 flex-1 max-w-md">
              <Search className="h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder={language === 'ar' ? 'ابحث عن مشاركين ، حکام ، هاکائونات' : 'Search for participants, judges, hackathons'} 
                className="bg-transparent border-none outline-none text-sm flex-1"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <div className="text-right">
              <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-[#155DFC]" />
                {language === 'ar' ? 'لوحة التحكم' : 'Control Panel'}
              </h1>
              <p className="text-xs text-gray-500">
                {language === 'ar' ? 'إدارة الهاكاثونات والمشاركين' : 'Manage Hackathons and Participants'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-row-reverse">
        {/* Main Content */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Banner */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-gradient-to-r from-[#155DFC] to-[#0E4CC3] rounded-lg p-6 text-white relative overflow-hidden"
            >
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-1">
                  {language === 'ar' ? `مرحباً, ${user?.name} 👋` : `Hello, ${user?.name} 👋`}
                </h2>
                <p className="text-blue-100 text-sm mb-3">
                  {language === 'ar' ? 'إليك نظرة عامة على مؤسستك' : 'Here\'s an overview of your organization'}
                </p>
                <Badge className="bg-blue-500 text-white border-none">
                  {language === 'ar' ? 'تم 12% منذ الأسبوع' : 'Completed 12% since last week'}
                </Badge>
              </div>
            </motion.div>

            {/* Stats Grid */}
            {stats && (
              <>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {language === 'ar' ? 'الإحصائيات الأساسية' : 'Basic Statistics'}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {language === 'ar' ? 'نظرة سريعة على أداء مؤسستك' : 'A quick look at your organization\'s performance'}
                  </p>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                  >
                    <Card className="p-6 bg-white border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <Box className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-gray-900 mb-1">{stats.totalHackathons}</div>
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        {language === 'ar' ? 'عدد الهاكاثونات' : 'Number of Hackathons'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {stats.activeHackathons} {language === 'ar' ? 'هاكاثون نشط' : 'Active Hackathon'}
                      </p>
                    </Card>

                    <Card className="p-6 bg-white border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-50 rounded-lg">
                          <CheckCircle2 className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-gray-900 mb-1">{stats.totalJudges}</div>
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        {language === 'ar' ? 'عدد المحكمين' : 'Number of Judges'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {language === 'ar' ? 'محكم' : 'Judge'}
                      </p>
                    </Card>

                    <Card className="p-6 bg-white border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <Users className="h-6 w-6 text-purple-600" />
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-gray-900 mb-1">{stats.pendingParticipants}</div>
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        {language === 'ar' ? 'الطلبات المعلقة' : 'Pending Requests'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {language === 'ar' ? 'معلق' : 'Pending'}
                      </p>
                    </Card>

                    <Card className="p-6 bg-white border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-orange-50 rounded-lg">
                          <BarChart3 className="h-6 w-6 text-orange-600" />
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-gray-900 mb-1">{stats.totalUsers}</div>
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        {language === 'ar' ? 'مؤسستك' : 'Your Organization'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {language === 'ar' ? 'في مؤسستك' : 'In your organization'}
                      </p>
                    </Card>
                  </motion.div>
                </div>

                {/* Request Status */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {language === 'ar' ? 'حالة الطلبات' : 'Request Status'}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {language === 'ar' ? 'تتبع حالة جميع الطلبات المقدمة' : 'Track the status of all submitted requests'}
                  </p>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    <Card className="p-6 bg-white border border-gray-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <XCircle className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900">{stats?.rejectedParticipants || 0}</div>
                          <h3 className="text-sm font-semibold text-gray-700">{language === 'ar' ? 'مرفوضة' : 'Rejected'}</h3>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        {language === 'ar' ? 'لا يوجد أي طلبات مرفوضة حافظ على هذا المستوى !' : 'There are no rejected requests, keep it up!'}
                      </p>
                    </Card>

                    <Card className="p-6 bg-white border border-gray-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900">{stats?.approvedParticipants || 0}</div>
                          <h3 className="text-sm font-semibold text-gray-700">{language === 'ar' ? 'مضافة' : 'Added/Approved'}</h3>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        {language === 'ar' ? 'لم يتم قبول أي طلبات بعد راجع الطلبات المضافة' : 'No requests have been accepted yet, review added requests'}
                      </p>
                    </Card>

                    <Card className="p-6 bg-white border border-gray-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                          <Clock className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900">{stats?.pendingParticipants || 0}</div>
                          <h3 className="text-sm font-semibold text-gray-700">{language === 'ar' ? 'معلقة' : 'Pending'}</h3>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        {language === 'ar' ? 'لا يوجد طلبات قيد الانتظار حالياً لمتابعة طلب جديد' : 'There are no pending requests currently to follow up on a new request'}
                      </p>
                    </Card>
                  </motion.div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {language === 'ar' ? 'أحسن الأدوات الأساسية سريعة' : 'Best quick essential tools'}
                  </p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    <Button 
                      className="w-full justify-start gap-2 bg-[#155DFC] hover:bg-[#0E4CC3] text-white h-auto py-4 px-6"
                      onClick={() => router.push('/admin/participants')}
                    >
                      <Plus className="h-5 w-5" />
                      <span className="font-semibold">{language === 'ar' ? 'إضافة مشاركين جديد' : 'Add New Participants'}</span>
                    </Button>
                    <Button 
                      className="w-full justify-start gap-2 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 h-auto py-4 px-6" 
                      variant="outline"
                      onClick={() => router.push('/admin/participants')}
                    >
                      <Users className="h-5 w-5" />
                      <span className="font-semibold">{language === 'ar' ? 'عرض المشاركين' : 'View Participants'}</span>
                    </Button>
                    <Button 
                      className="w-full justify-start gap-2 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 h-auto py-4 px-6" 
                      variant="outline"
                      onClick={() => router.push('/admin/judges')}
                    >
                      <Settings className="h-5 w-5" />
                      <span className="font-semibold">{language === 'ar' ? 'إدارة الحكام' : 'Manage Judges'}</span>
                    </Button>
                  </motion.div>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Sidebar */}
        <AdminSidebar />
      </div>
    </div>
  )
}
