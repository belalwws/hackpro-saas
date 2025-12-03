'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '@/contexts/auth-context'

export interface Notification {
  id: string
  userId: string
  type: string
  title: string
  titleAr?: string
  message: string
  messageAr?: string
  link?: string
  icon?: string
  imageUrl?: string
  isRead: boolean
  readAt?: string
  priority: 'low' | 'normal' | 'high' | 'urgent'
  resourceType?: string
  resourceId?: string
  actionType?: string
  metadata?: Record<string, any>
  expiresAt?: string
  createdAt: string
  updatedAt: string
}

interface NotificationsState {
  notifications: Notification[]
  unreadCount: number
  total: number
  hasMore: boolean
  loading: boolean
  error: string | null
}

interface UseNotificationsOptions {
  pollingInterval?: number // in milliseconds, default 30000 (30 seconds)
  autoFetch?: boolean
  limit?: number
}

export function useNotifications(options: UseNotificationsOptions = {}) {
  const { pollingInterval = 30000, autoFetch = true, limit = 20 } = options
  const { user, loading: authLoading } = useAuth()
  
  const [state, setState] = useState<NotificationsState>({
    notifications: [],
    unreadCount: 0,
    total: 0,
    hasMore: false,
    loading: false,
    error: null,
  })

  const pollingRef = useRef<NodeJS.Timeout | null>(null)
  const isMountedRef = useRef(true)

  // Fetch notifications
  const fetchNotifications = useCallback(async (offset = 0, append = false) => {
    if (authLoading || !user?.id) return

    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const response = await fetch(`/api/notifications?limit=${limit}&offset=${offset}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch notifications')
      }

      const data = await response.json()

      if (isMountedRef.current) {
        setState(prev => ({
          ...prev,
          notifications: append 
            ? [...prev.notifications, ...data.notifications]
            : data.notifications,
          unreadCount: data.unreadCount,
          total: data.total,
          hasMore: data.hasMore,
          loading: false,
        }))
      }
    } catch (error) {
      if (isMountedRef.current) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        }))
      }
    }
  }, [user?.id, authLoading, limit])

  // Fetch unread count only (lightweight polling)
  const fetchUnreadCount = useCallback(async () => {
    if (authLoading || !user?.id) return

    try {
      const response = await fetch('/api/notifications/unread-count')
      
      if (response.ok) {
        const data = await response.json()
        if (isMountedRef.current) {
          setState(prev => ({ ...prev, unreadCount: data.count }))
        }
      }
    } catch (error) {
      console.error('Error fetching unread count:', error)
    }
  }, [user?.id, authLoading])

  // Load more notifications
  const loadMore = useCallback(() => {
    if (state.hasMore && !state.loading) {
      fetchNotifications(state.notifications.length, true)
    }
  }, [state.hasMore, state.loading, state.notifications.length, fetchNotifications])

  // Mark notification as read
  const markAsRead = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'PATCH',
      })

      if (response.ok) {
        setState(prev => ({
          ...prev,
          notifications: prev.notifications.map(n =>
            n.id === id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n
          ),
          unreadCount: Math.max(0, prev.unreadCount - 1),
        }))
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }, [])

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
      })

      if (response.ok) {
        setState(prev => ({
          ...prev,
          notifications: prev.notifications.map(n => ({
            ...n,
            isRead: true,
            readAt: new Date().toISOString(),
          })),
          unreadCount: 0,
        }))
      }
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }, [])

  // Delete notification
  const deleteNotification = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setState(prev => {
          const notification = prev.notifications.find(n => n.id === id)
          return {
            ...prev,
            notifications: prev.notifications.filter(n => n.id !== id),
            total: prev.total - 1,
            unreadCount: notification && !notification.isRead 
              ? prev.unreadCount - 1 
              : prev.unreadCount,
          }
        })
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }, [])

  // Delete all read notifications
  const deleteAllRead = useCallback(async () => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'DELETE',
      })

      if (response.ok) {
        setState(prev => ({
          ...prev,
          notifications: prev.notifications.filter(n => !n.isRead),
          total: prev.unreadCount,
        }))
      }
    } catch (error) {
      console.error('Error deleting read notifications:', error)
    }
  }, [])

  // Refresh notifications
  const refresh = useCallback(() => {
    fetchNotifications(0, false)
  }, [fetchNotifications])

  // Initial fetch
  useEffect(() => {
    if (autoFetch && !authLoading && user?.id) {
      fetchNotifications()
    }
  }, [autoFetch, authLoading, user?.id, fetchNotifications])

  // Polling for unread count
  useEffect(() => {
    if (!authLoading && user?.id && pollingInterval > 0) {
      pollingRef.current = setInterval(fetchUnreadCount, pollingInterval)
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
      }
    }
  }, [authLoading, user?.id, pollingInterval, fetchUnreadCount])

  // Cleanup
  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  return {
    ...state,
    fetchNotifications,
    loadMore,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllRead,
    refresh,
  }
}

export default useNotifications
