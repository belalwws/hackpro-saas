import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

/**
 * POST /api/organization/switch
 * 
 * Switch to a different organization
 * User must be a member of the target organization
 */
export async function POST(request: NextRequest) {
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

    // Get request body
    const body = await request.json()
    const { organizationId } = body

    if (!organizationId) {
      return NextResponse.json(
        { error: 'معرف المنظمة مطلوب' },
        { status: 400 }
      )
    }

    // Check if user is member of the target organization
    const orgUser = await prisma.organizationUser.findUnique({
      where: {
        userId_organizationId: {
          userId,
          organizationId
        }
      },
      include: {
        organization: true
      }
    })

    if (!orgUser) {
      return NextResponse.json(
        { error: 'ليس لديك صلاحية للوصول إلى هذه المنظمة' },
        { status: 403 }
      )
    }

    if (orgUser.organization.status !== 'active') {
      return NextResponse.json(
        { error: 'هذه المنظمة غير نشطة' },
        { status: 403 }
      )
    }

    // Success - organization can be switched
    // Note: We're not storing the "current" org in DB or cookie
    // The frontend will manage this state
    return NextResponse.json({
      success: true,
      message: 'تم تبديل المنظمة بنجاح',
      organization: orgUser.organization
    })

  } catch (error) {
    console.error('Error switching organization:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في تبديل المنظمة' },
      { status: 500 }
    )
  }
}
