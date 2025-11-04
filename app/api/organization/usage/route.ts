import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { getUsage } from '@/lib/multi-tenancy'
import { startOfMonth } from 'date-fns'

/**
 * GET /api/organization/usage
 * 
 * Returns current usage metrics for the organization
 */
export async function GET(request: NextRequest) {
  try {
    // Get token
    let token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      const authHeader = request.headers.get('authorization')
      token = authHeader?.replace('Bearer ', '')
    }

    if (!token) {
      return NextResponse.json(
        { error: 'غير مصرح بالوصول' },
        { status: 401 }
      )
    }

    // Verify token
    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'رمز المصادقة غير صالح' },
        { status: 401 }
      )
    }

    const userId = payload.userId

    // Get user's organization
    const orgUser = await prisma.organizationUser.findFirst({
      where: {
        userId,
        organization: {
          status: 'active'
        }
      },
      include: {
        organization: true
      }
    })

    if (!orgUser) {
      return NextResponse.json(
        { error: 'لا توجد منظمة مرتبطة بهذا الحساب' },
        { status: 404 }
      )
    }

    const organizationId = orgUser.organization.id

    // Get current usage from multi-tenancy helper
    const usage = await getUsage(organizationId)

    // Get real-time counts for accuracy
    const [hackathonsCount, usersCount, participantsCount] = await Promise.all([
      prisma.hackathon.count({
        where: { organizationId }
      }),
      prisma.organizationUser.count({
        where: { organizationId }
      }),
      prisma.participant.count({
        where: {
          hackathon: {
            organizationId
          }
        }
      })
    ])

    // Combine metrics
    const currentUsage = {
      hackathonsUsed: hackathonsCount,
      usersUsed: usersCount,
      participantsUsed: participantsCount,
      emailsSent: usage.emailsSent,
      storageUsed: Number(usage.storageUsed),
      apiCallsMade: usage.apiCallsMade,
      period: startOfMonth(new Date())
    }

    return NextResponse.json({
      success: true,
      usage: currentUsage,
      limits: {
        hackathons: orgUser.organization.maxHackathons,
        users: orgUser.organization.maxUsers,
        participants: orgUser.organization.maxParticipants,
        emails: orgUser.organization.maxEmailsPerMonth,
        storage: Number(orgUser.organization.maxStorage)
      }
    })

  } catch (error) {
    console.error('Error fetching usage:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في تحميل بيانات الاستخدام' },
      { status: 500 }
    )
  }
}
