'use client'

import React from 'react'
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Trash2, 
  RefreshCw, 
  Loader2,
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { Notification } from '@/hooks/useNotifications'
import { formatDistanceToNow } from 'date-fns'
import { ar, enUS } from 'date-fns/locale'

interface NotificationListProps {
  notifications: Notification[]
  loading: boolean
  hasMore: boolean
  onLoadMore: () => void
  onNotificationClick: (notification: Notification) => void
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
  onDelete: (id: string) => void
  onRefresh: () => void
  isRTL: boolean
}

// Get icon based on notification type
function getNotificationIcon(type: string) {
  const iconMap: Record<string, React.ReactNode> = {
    // System
    system: <Info className="w-5 h-5" />,
    announcement: <Megaphone className="w-5 h-5" />,
    
    // Hackathon
    hackathon_created: <Calendar className="w-5 h-5" />,
    hackathon_updated: <Calendar className="w-5 h-5" />,
    hackathon_started: <Calendar className="w-5 h-5" />,
    hackathon_ended: <Calendar className="w-5 h-5" />,
    hackathon_reminder: <Bell className="w-5 h-5" />,
    
    // Participant
    registration_received: <UserPlus className="w-5 h-5" />,
    registration_approved: <CheckCircle className="w-5 h-5" />,
    registration_rejected: <AlertCircle className="w-5 h-5" />,
    
    // Team
    team_created: <Users className="w-5 h-5" />,
    team_joined: <Users className="w-5 h-5" />,
    team_left: <Users className="w-5 h-5" />,
    team_updated: <Users className="w-5 h-5" />,
    team_submission: <Users className="w-5 h-5" />,
    
    // Evaluation
    evaluation_started: <Award className="w-5 h-5" />,
    evaluation_completed: <Award className="w-5 h-5" />,
    score_received: <Award className="w-5 h-5" />,
    results_announced: <Trophy className="w-5 h-5" />,
    
    // Certificate
    certificate_ready: <Award className="w-5 h-5" />,
    certificate_sent: <Mail className="w-5 h-5" />,
    
    // Judge/Expert
    judge_assigned: <Award className="w-5 h-5" />,
    expert_assigned: <Award className="w-5 h-5" />,
    evaluation_reminder: <Bell className="w-5 h-5" />,
    
    // Invitation
    invitation_received: <Mail className="w-5 h-5" />,
    invitation_accepted: <CheckCircle className="w-5 h-5" />,
    invitation_expired: <AlertCircle className="w-5 h-5" />,
    
    // General
    message: <Mail className="w-5 h-5" />,
    alert: <AlertCircle className="w-5 h-5" />,
    success: <CheckCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
  }
  
  return iconMap[type] || <Bell className="w-5 h-5" />
}

// Get icon color based on notification type
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

export function NotificationList({
  notifications,
  loading,
  hasMore,
  onLoadMore,
  onNotificationClick,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onRefresh,
  isRTL,
}: NotificationListProps) {
  const hasUnread = notifications.some(n => !n.isRead)

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
        <h3 className={cn(
          "font-semibold text-slate-900 dark:text-slate-100",
          isRTL && "text-arabic"
        )}>
          {isRTL ? 'الإشعارات' : 'Notifications'}
        </h3>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onRefresh}
            disabled={loading}
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
          {hasUnread && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs"
              onClick={onMarkAllAsRead}
            >
              <CheckCheck className="h-4 w-4 mr-1" />
              {isRTL ? 'قراءة الكل' : 'Read all'}
            </Button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <ScrollArea className="h-[400px]">
        {loading && notifications.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <Bell className="h-12 w-12 mb-3 opacity-20" />
            <p className={cn("text-sm", isRTL && "text-arabic")}>
              {isRTL ? 'لا توجد إشعارات' : 'No notifications'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "flex gap-3 p-4 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50",
                  !notification.isRead && "bg-blue-50/50 dark:bg-blue-900/10"
                )}
                onClick={() => onNotificationClick(notification)}
              >
                {/* Icon */}
                <div className={cn(
                  "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
                  getIconColor(notification.type, notification.priority)
                )}>
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn(
                      "text-sm font-medium text-slate-900 dark:text-slate-100 line-clamp-1",
                      isRTL && "text-arabic"
                    )}>
                      {isRTL && notification.titleAr ? notification.titleAr : notification.title}
                    </p>
                    {!notification.isRead && (
                      <span className="flex-shrink-0 w-2 h-2 mt-1.5 rounded-full bg-blue-500" />
                    )}
                  </div>
                  <p className={cn(
                    "text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mt-0.5",
                    isRTL && "text-arabic"
                  )}>
                    {isRTL && notification.messageAr ? notification.messageAr : notification.message}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                      locale: isRTL ? ar : enUS,
                    })}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex-shrink-0 flex items-start gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!notification.isRead && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e) => {
                        e.stopPropagation()
                        onMarkAsRead(notification.id)
                      }}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-slate-400 hover:text-red-500"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(notification.id)
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}

            {/* Load More */}
            {hasMore && (
              <div className="p-4 text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLoadMore}
                  disabled={loading}
                  className="w-full"
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
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-slate-200 dark:border-slate-700 p-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-sm text-slate-600 dark:text-slate-400"
          onClick={() => window.location.href = '/notifications'}
        >
          {isRTL ? 'عرض كل الإشعارات' : 'View all notifications'}
        </Button>
      </div>
    </div>
  )
}

export default NotificationList
