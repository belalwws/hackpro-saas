'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Trash2, 
  RefreshCw, 
  Loader2,
  ArrowLeft,
  Filter,
  Search,
  Trophy,
  Users,
  UserPlus,
  Calendar,
  Award,
  Mail,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  Megaphone
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { useNotifications, Notification } from '@/hooks/useNotifications'
import { useLanguage } from '@/contexts/language-context'
import { formatDistanceToNow, format } from 'date-fns'
import { ar, enUS } from 'date-fns/locale'

// Get icon based on notification type
function getNotificationIcon(type: string) {
  const iconMap: Record<string, React.ReactNode> = {
    system: <Info className="w-5 h-5" />,
    announcement: <Megaphone className="w-5 h-5" />,
    hackathon_created: <Calendar className="w-5 h-5" />,
    hackathon_updated: <Calendar className="w-5 h-5" />,
    hackathon_started: <Calendar className="w-5 h-5" />,
    hackathon_ended: <Calendar className="w-5 h-5" />,
    hackathon_reminder: <Bell className="w-5 h-5" />,
    registration_received: <UserPlus className="w-5 h-5" />,
    registration_approved: <CheckCircle className="w-5 h-5" />,
    registration_rejected: <AlertCircle className="w-5 h-5" />,
    team_created: <Users className="w-5 h-5" />,
    team_joined: <Users className="w-5 h-5" />,
    team_left: <Users className="w-5 h-5" />,
    team_updated: <Users className="w-5 h-5" />,
    team_submission: <Users className="w-5 h-5" />,
    evaluation_started: <Award className="w-5 h-5" />,
    evaluation_completed: <Award className="w-5 h-5" />,
    score_received: <Award className="w-5 h-5" />,
    results_announced: <Trophy className="w-5 h-5" />,
    certificate_ready: <Award className="w-5 h-5" />,
    certificate_sent: <Mail className="w-5 h-5" />,
    judge_assigned: <Award className="w-5 h-5" />,
    expert_assigned: <Award className="w-5 h-5" />,
    evaluation_reminder: <Bell className="w-5 h-5" />,
    invitation_received: <Mail className="w-5 h-5" />,
    invitation_accepted: <CheckCircle className="w-5 h-5" />,
    invitation_expired: <AlertCircle className="w-5 h-5" />,
    message: <Mail className="w-5 h-5" />,
    alert: <AlertCircle className="w-5 h-5" />,
    success: <CheckCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
  }
  return iconMap[type] || <Bell className="w-5 h-5" />
}

function getIconColor(type: string, priority: string) {
  if (priority === 'urgent') return 'text-red-500 bg-red-100 dark:bg-red-900/30'
  if (priority === 'high') return 'text-orange-500 bg-orange-100 dark:bg-orange-900/30'
  
  const colorMap: Record<string, string> = {
    registration_approved: 'text-green-500 bg-green-100 dark:bg-green-900/30',
    registration_rejected: 'text-red-500 bg-red-100 dark:bg-red-900/30',
    results_announced: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30',
    certificate_ready: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30',
    success: 'text-green-500 bg-green-100 dark:bg-green-900/30',
    warning: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30',
    error: 'text-red-500 bg-red-100 dark:bg-red-900/30',
    announcement: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
  }
  return colorMap[type] || 'text-slate-500 bg-slate-100 dark:bg-slate-800'
}

export default function NotificationsPage() {
  const router = useRouter()
  const { language } = useLanguage()
  const isRTL = language === 'ar'
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  
  const {
    notifications,
    unreadCount,
    total,
    loading,
    hasMore,
    loadMore,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllRead,
    refresh,
  } = useNotifications({ limit: 50 })

  // Filter notifications based on tab and search
  const filteredNotifications = notifications.filter(n => {
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'unread' && !n.isRead) ||
      (activeTab === 'read' && n.isRead)
    
    const matchesSearch = !searchQuery || 
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.titleAr && n.titleAr.includes(searchQuery)) ||
      (n.messageAr && n.messageAr.includes(searchQuery))
    
    return matchesTab && matchesSearch
  })

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id)
    }
    if (notification.link) {
      router.push(notification.link)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="rounded-full"
              >
                <ArrowLeft className={cn("h-5 w-5", isRTL && "rotate-180")} />
              </Button>
              <div>
                <h1 className={cn(
                  "text-2xl font-bold text-slate-900 dark:text-white",
                  isRTL && "text-arabic"
                )}>
                  {isRTL ? 'الإشعارات' : 'Notifications'}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {isRTL 
                    ? `${unreadCount} إشعار غير مقروء من ${total}`
                    : `${unreadCount} unread of ${total} total`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={refresh}
                disabled={loading}
              >
                <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
                {isRTL ? 'تحديث' : 'Refresh'}
              </Button>
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                >
                  <CheckCheck className="h-4 w-4 mr-2" />
                  {isRTL ? 'قراءة الكل' : 'Mark all read'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder={isRTL ? 'بحث في الإشعارات...' : 'Search notifications...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">
                {isRTL ? 'الكل' : 'All'}
              </TabsTrigger>
              <TabsTrigger value="unread">
                {isRTL ? 'غير مقروء' : 'Unread'}
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="read">
                {isRTL ? 'مقروء' : 'Read'}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Notifications List */}
        {loading && notifications.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Bell className="h-16 w-16 mb-4 opacity-20" />
            <p className={cn("text-lg font-medium", isRTL && "text-arabic")}>
              {isRTL ? 'لا توجد إشعارات' : 'No notifications'}
            </p>
            <p className={cn("text-sm", isRTL && "text-arabic")}>
              {isRTL ? 'ستظهر إشعاراتك هنا' : 'Your notifications will appear here'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 cursor-pointer transition-all hover:shadow-md",
                  !notification.isRead && "border-l-4 border-l-blue-500"
                )}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className={cn(
                    "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center",
                    getIconColor(notification.type, notification.priority)
                  )}>
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className={cn(
                          "font-semibold text-slate-900 dark:text-white",
                          isRTL && "text-arabic"
                        )}>
                          {isRTL && notification.titleAr ? notification.titleAr : notification.title}
                        </h3>
                        <p className={cn(
                          "text-sm text-slate-600 dark:text-slate-400 mt-1",
                          isRTL && "text-arabic"
                        )}>
                          {isRTL && notification.messageAr ? notification.messageAr : notification.message}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <span className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-blue-500" />
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-xs text-slate-400">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                          locale: isRTL ? ar : enUS,
                        })}
                        {' • '}
                        {format(new Date(notification.createdAt), 'PPp', {
                          locale: isRTL ? ar : enUS,
                        })}
                      </p>
                      
                      <div className="flex items-center gap-1">
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2"
                            onClick={(e) => {
                              e.stopPropagation()
                              markAsRead(notification.id)
                            }}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            {isRTL ? 'قراءة' : 'Read'}
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-slate-400 hover:text-red-500"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteNotification(notification.id)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Load More */}
            {hasMore && (
              <div className="text-center py-4">
                <Button
                  variant="outline"
                  onClick={loadMore}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  {isRTL ? 'تحميل المزيد' : 'Load more'}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Delete Read Notifications */}
        {notifications.some(n => n.isRead) && (
          <div className="mt-8 text-center">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-500 hover:text-red-500"
              onClick={deleteAllRead}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isRTL ? 'حذف الإشعارات المقروءة' : 'Delete read notifications'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
