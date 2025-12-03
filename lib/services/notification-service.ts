import { prisma } from '@/lib/prisma'
import { NotificationType, NotificationPriority } from '@prisma/client'

// Types
export interface CreateNotificationInput {
  userId: string
  type: NotificationType
  title: string
  titleAr?: string
  message: string
  messageAr?: string
  link?: string
  icon?: string
  imageUrl?: string
  priority?: NotificationPriority
  resourceType?: string
  resourceId?: string
  actionType?: string
  metadata?: Record<string, any>
  expiresAt?: Date
}

export interface NotificationFilters {
  userId: string
  isRead?: boolean
  type?: NotificationType
  priority?: NotificationPriority
  limit?: number
  offset?: number
}

// Notification Service
export const NotificationService = {
  /**
   * Create a new notification
   */
  async create(input: CreateNotificationInput) {
    return prisma.notification.create({
      data: {
        userId: input.userId,
        type: input.type,
        title: input.title,
        titleAr: input.titleAr,
        message: input.message,
        messageAr: input.messageAr,
        link: input.link,
        icon: input.icon,
        imageUrl: input.imageUrl,
        priority: input.priority || 'normal',
        resourceType: input.resourceType,
        resourceId: input.resourceId,
        actionType: input.actionType,
        metadata: input.metadata,
        expiresAt: input.expiresAt,
      },
    })
  },

  /**
   * Create multiple notifications (bulk)
   */
  async createMany(inputs: CreateNotificationInput[]) {
    return prisma.notification.createMany({
      data: inputs.map(input => ({
        userId: input.userId,
        type: input.type,
        title: input.title,
        titleAr: input.titleAr,
        message: input.message,
        messageAr: input.messageAr,
        link: input.link,
        icon: input.icon,
        imageUrl: input.imageUrl,
        priority: input.priority || 'normal',
        resourceType: input.resourceType,
        resourceId: input.resourceId,
        actionType: input.actionType,
        metadata: input.metadata,
        expiresAt: input.expiresAt,
      })),
    })
  },

  /**
   * Get notifications for a user
   */
  async getByUser(filters: NotificationFilters) {
    const where: any = {
      userId: filters.userId,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } },
      ],
    }

    if (filters.isRead !== undefined) {
      where.isRead = filters.isRead
    }

    if (filters.type) {
      where.type = filters.type
    }

    if (filters.priority) {
      where.priority = filters.priority
    }

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: filters.limit || 20,
        skip: filters.offset || 0,
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({
        where: {
          userId: filters.userId,
          isRead: false,
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } },
          ],
        },
      }),
    ])

    return {
      notifications,
      total,
      unreadCount,
      hasMore: (filters.offset || 0) + notifications.length < total,
    }
  },

  /**
   * Get a single notification by ID
   */
  async getById(id: string, userId: string) {
    return prisma.notification.findFirst({
      where: { id, userId },
    })
  },

  /**
   * Mark a notification as read
   */
  async markAsRead(id: string, userId: string) {
    return prisma.notification.updateMany({
      where: { id, userId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    })
  },

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    })
  },

  /**
   * Delete a notification
   */
  async delete(id: string, userId: string) {
    return prisma.notification.deleteMany({
      where: { id, userId },
    })
  },

  /**
   * Delete all read notifications for a user
   */
  async deleteAllRead(userId: string) {
    return prisma.notification.deleteMany({
      where: { userId, isRead: true },
    })
  },

  /**
   * Get unread count for a user
   */
  async getUnreadCount(userId: string) {
    return prisma.notification.count({
      where: {
        userId,
        isRead: false,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
    })
  },

  /**
   * Clean up expired notifications
   */
  async cleanupExpired() {
    return prisma.notification.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    })
  },

  // ========================================
  // HELPER METHODS FOR COMMON NOTIFICATIONS
  // ========================================

  /**
   * Notify user about hackathon registration
   */
  async notifyRegistration(userId: string, hackathonId: string, hackathonTitle: string, status: 'received' | 'approved' | 'rejected') {
    const messages = {
      received: {
        title: 'Registration Received',
        titleAr: 'تم استلام طلب التسجيل',
        message: `Your registration for "${hackathonTitle}" has been received and is pending review.`,
        messageAr: `تم استلام طلب تسجيلك في "${hackathonTitle}" وهو قيد المراجعة.`,
        type: 'registration_received' as NotificationType,
      },
      approved: {
        title: 'Registration Approved',
        titleAr: 'تم قبول التسجيل',
        message: `Congratulations! Your registration for "${hackathonTitle}" has been approved.`,
        messageAr: `مبروك! تم قبول تسجيلك في "${hackathonTitle}".`,
        type: 'registration_approved' as NotificationType,
      },
      rejected: {
        title: 'Registration Rejected',
        titleAr: 'تم رفض التسجيل',
        message: `Unfortunately, your registration for "${hackathonTitle}" was not approved.`,
        messageAr: `للأسف، لم يتم قبول تسجيلك في "${hackathonTitle}".`,
        type: 'registration_rejected' as NotificationType,
      },
    }

    const msg = messages[status]
    return this.create({
      userId,
      type: msg.type,
      title: msg.title,
      titleAr: msg.titleAr,
      message: msg.message,
      messageAr: msg.messageAr,
      link: `/hackathons/${hackathonId}`,
      resourceType: 'hackathon',
      resourceId: hackathonId,
      actionType: status,
      priority: status === 'approved' ? 'high' : 'normal',
    })
  },

  /**
   * Notify user about team assignment
   */
  async notifyTeamAssignment(userId: string, hackathonId: string, teamId: string, teamName: string) {
    return this.create({
      userId,
      type: 'team_joined',
      title: 'Team Assignment',
      titleAr: 'تم تعيينك في فريق',
      message: `You have been assigned to team "${teamName}".`,
      messageAr: `تم تعيينك في فريق "${teamName}".`,
      link: `/hackathons/${hackathonId}/teams/${teamId}`,
      resourceType: 'team',
      resourceId: teamId,
      actionType: 'assigned',
      priority: 'high',
    })
  },

  /**
   * Notify about evaluation results
   */
  async notifyResults(userId: string, hackathonId: string, hackathonTitle: string, rank?: number) {
    const isWinner = rank && rank <= 3
    return this.create({
      userId,
      type: 'results_announced',
      title: isWinner ? 'Congratulations! 🎉' : 'Results Announced',
      titleAr: isWinner ? 'مبروك! 🎉' : 'تم إعلان النتائج',
      message: isWinner 
        ? `You ranked #${rank} in "${hackathonTitle}"!`
        : `Results for "${hackathonTitle}" have been announced.`,
      messageAr: isWinner
        ? `حصلت على المركز ${rank} في "${hackathonTitle}"!`
        : `تم إعلان نتائج "${hackathonTitle}".`,
      link: `/hackathons/${hackathonId}/results`,
      resourceType: 'hackathon',
      resourceId: hackathonId,
      actionType: 'results',
      priority: isWinner ? 'urgent' : 'high',
    })
  },

  /**
   * Notify about certificate availability
   */
  async notifyCertificate(userId: string, hackathonId: string, hackathonTitle: string, certificateUrl: string) {
    return this.create({
      userId,
      type: 'certificate_ready',
      title: 'Certificate Ready',
      titleAr: 'شهادتك جاهزة',
      message: `Your certificate for "${hackathonTitle}" is ready for download.`,
      messageAr: `شهادتك في "${hackathonTitle}" جاهزة للتحميل.`,
      link: certificateUrl,
      resourceType: 'hackathon',
      resourceId: hackathonId,
      actionType: 'certificate',
      priority: 'high',
    })
  },

  /**
   * Notify admins about new registration
   */
  async notifyAdminsNewRegistration(adminUserIds: string[], hackathonId: string, participantName: string) {
    const inputs: CreateNotificationInput[] = adminUserIds.map(userId => ({
      userId,
      type: 'registration_received' as NotificationType,
      title: 'New Registration',
      titleAr: 'تسجيل جديد',
      message: `${participantName} has registered for the hackathon.`,
      messageAr: `قام ${participantName} بالتسجيل في الهاكاثون.`,
      link: `/admin/hackathons/${hackathonId}/participants`,
      resourceType: 'hackathon',
      resourceId: hackathonId,
      actionType: 'new_registration',
    }))

    return this.createMany(inputs)
  },

  /**
   * Send system announcement to all users
   */
  async sendAnnouncement(userIds: string[], title: string, titleAr: string, message: string, messageAr: string, link?: string) {
    const inputs: CreateNotificationInput[] = userIds.map(userId => ({
      userId,
      type: 'announcement' as NotificationType,
      title,
      titleAr,
      message,
      messageAr,
      link,
      priority: 'high' as NotificationPriority,
    }))

    return this.createMany(inputs)
  },
}

export default NotificationService
