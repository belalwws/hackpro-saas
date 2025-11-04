import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

/**
 * GET /api/organization/list
 * 
 * Returns all organizations the user belongs to
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

    // Get all organizations the user belongs to
    const orgUsers = await prisma.organizationUser.findMany({
      where: {
        userId,
        organization: {
          status: {
            in: ['active', 'trial']
          }
        }
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
            plan: true,
            status: true,
            primaryColor: true,
            secondaryColor: true,
            accentColor: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        joinedAt: 'asc'
      }
    })

    const organizations = orgUsers.map(ou => ({
      ...ou.organization,
      role: ou.role,
      isOwner: ou.isOwner,
      joinedAt: ou.joinedAt
    }))

    return NextResponse.json({
      success: true,
      organizations
    })

  } catch (error) {
    console.error('Error fetching organizations:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في تحميل قائمة المنظمات' },
      { status: 500 }
    )
  }
}

