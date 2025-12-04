import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/auth/validate-reset-token - Validate reset token
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'رمز إعادة التعيين مطلوب' },
        { status: 400 }
      )
    }

    // Find user with this token
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpiry: {
          gt: new Date(), // Token not expired
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'رمز إعادة التعيين غير صحيح أو منتهي الصلاحية' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      message: 'الرمز صحيح',
      email: user.email, // Return email for display
    })
  } catch (error) {
    console.error('Error validating reset token:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء التحقق من الرمز' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'




