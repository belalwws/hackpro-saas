import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendTemplatedEmail } from '@/lib/mailer'

// POST /api/auth/send-otp - Send OTP code for registration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, password, organizationName, organizationSlug } = body

    // Validate required fields
    if (!email || !name || !password || !organizationName || !organizationSlug) {
      return NextResponse.json({ 
        error: 'جميع الحقول مطلوبة' 
      }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ 
        error: 'البريد الإلكتروني مستخدم بالفعل' 
      }, { status: 400 })
    }

    // Check if organization slug already exists
    const existingOrg = await prisma.organization.findUnique({
      where: { slug: organizationSlug }
    })

    if (existingOrg) {
      return NextResponse.json({ 
        error: 'معرّف المؤسسة مستخدم بالفعل. جرّب معرّفاً آخر' 
      }, { status: 400 })
    }

    // Generate 6-digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Delete any existing OTP for this email and type
    try {
      await (prisma as any).otpVerification.deleteMany({
        where: {
          email,
          type: 'registration',
          verified: false
        }
      })
    } catch (deleteError) {
      console.log('⚠️ Could not delete existing OTP (table might not exist yet):', deleteError)
    }

    // Create new OTP record
    const otpRecord = await (prisma as any).otpVerification.create({
      data: {
        email,
        code: otpCode,
        type: 'registration',
        expiresAt,
        registrationData: {
          name,
          password, // Will be hashed when verified
          organizationName,
          organizationSlug
        }
      }
    })

    // Send OTP email
    try {
      await sendTemplatedEmail(
        'otp_verification' as any,
        email,
        {
          participantName: name,
          participantEmail: email,
          otpCode: otpCode,
          organizationName: organizationName,
          expiresIn: '10 دقائق'
        }
      )
      console.log('✅ OTP email sent successfully to:', email)
    } catch (emailError) {
      console.error('❌ Failed to send OTP email:', emailError)
      // Delete OTP record if email fails
      try {
        await (prisma as any).otpVerification.delete({
          where: { id: otpRecord.id }
        })
      } catch (deleteError) {
        console.error('Failed to delete OTP record:', deleteError)
      }
      return NextResponse.json({ 
        error: 'فشل إرسال كود التحقق. يرجى المحاولة مرة أخرى' 
      }, { status: 500 })
    }

    return NextResponse.json({
      message: 'تم إرسال كود التحقق إلى بريدك الإلكتروني',
      expiresAt: expiresAt.toISOString()
    })

  } catch (error) {
    console.error('❌ Error in send-otp:', error)
    return NextResponse.json({ 
      error: 'حدث خطأ في إرسال كود التحقق' 
    }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'

