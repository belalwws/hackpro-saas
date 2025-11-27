import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

// POST /api/auth/verify-otp - Verify OTP and create account
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, code } = body

    if (!email || !code) {
      return NextResponse.json({ 
        error: 'البريد الإلكتروني وكود التحقق مطلوبان' 
      }, { status: 400 })
    }

    // Find OTP record
    const otpRecord = await (prisma as any).otpVerification.findFirst({
      where: {
        email,
        type: 'registration',
        verified: false
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    if (!otpRecord) {
      return NextResponse.json({ 
        error: 'كود التحقق غير صحيح أو منتهي الصلاحية' 
      }, { status: 400 })
    }

    // Check if OTP is expired
    if (new Date() > otpRecord.expiresAt) {
      await (prisma as any).otpVerification.delete({
        where: { id: otpRecord.id }
      })
      return NextResponse.json({ 
        error: 'كود التحقق منتهي الصلاحية. يرجى طلب كود جديد' 
      }, { status: 400 })
    }

    // Check attempts
    if (otpRecord.attempts >= otpRecord.maxAttempts) {
      await (prisma as any).otpVerification.delete({
        where: { id: otpRecord.id }
      })
      return NextResponse.json({ 
        error: 'تم تجاوز عدد المحاولات المسموح به. يرجى طلب كود جديد' 
      }, { status: 400 })
    }

    // Verify code
    if (otpRecord.code !== code) {
      // Increment attempts
      await (prisma as any).otpVerification.update({
        where: { id: otpRecord.id },
        data: {
          attempts: otpRecord.attempts + 1
        }
      })
      
      const remainingAttempts = otpRecord.maxAttempts - (otpRecord.attempts + 1)
      return NextResponse.json({ 
        error: `كود التحقق غير صحيح. محاولات متبقية: ${remainingAttempts}` 
      }, { status: 400 })
    }

    // Mark OTP as verified
    await (prisma as any).otpVerification.update({
      where: { id: otpRecord.id },
      data: {
        verified: true,
        verifiedAt: new Date()
      }
    })

    // Get registration data
    const registrationData = otpRecord.registrationData as any
    const { name, password, organizationName, organizationSlug } = registrationData

    // Validate slug format
    const slugRegex = /^[a-z0-9-]+$/
    if (!slugRegex.test(organizationSlug)) {
      return NextResponse.json({ 
        error: 'معرّف المؤسسة غير صحيح' 
      }, { status: 400 })
    }

    // Double-check if user or organization already exists (race condition protection)
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ 
        error: 'البريد الإلكتروني مستخدم بالفعل' 
      }, { status: 400 })
    }

    const existingOrg = await prisma.organization.findUnique({
      where: { slug: organizationSlug }
    })

    if (existingOrg) {
      return NextResponse.json({ 
        error: 'معرّف المؤسسة مستخدم بالفعل' 
      }, { status: 400 })
    }

    // Generate subdomain
    const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'hackpro.com'
    const subdomain = `${organizationSlug}.${baseDomain}`
    
    // Check subdomain availability
    const existingDomain = await prisma.customDomain.findUnique({
      where: { domain: subdomain }
    })

    if (existingDomain) {
      return NextResponse.json({ 
        error: 'الدومين الفرعي مستخدم بالفعل' 
      }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)
    const verificationCode = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

    // Create Organization + User + OrganizationUser + CustomDomain in a transaction
    const result = await prisma.$transaction(async (tx: any) => {
      // 1. Create Organization
      const newOrg = await tx.organization.create({
        data: {
          name: organizationName,
          slug: organizationSlug,
          domain: subdomain,
          plan: 'free',
          status: 'active'
        }
      })

      // 2. Create User
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: 'admin' as any
        }
      })

      // 3. Link User to Organization
      await tx.organizationUser.create({
        data: {
          userId: newUser.id,
          organizationId: newOrg.id,
          isOwner: true
        }
      })

      // 4. Create CustomDomain
      await tx.customDomain.create({
        data: {
          organizationId: newOrg.id,
          domain: subdomain,
          verified: true,
          verificationCode: verificationCode,
          sslStatus: 'pending',
          verifiedAt: new Date()
        }
      })

      return { user: newUser, organization: newOrg }
    })

    const { user, organization } = result

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        organizationId: organization.id
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    )

    // Send welcome email
    let emailSent = false
    try {
      const { sendTemplatedEmail } = await import('@/lib/mailer')
      const loginUrl = process.env.NEXT_PUBLIC_APP_URL 
        ? `${process.env.NEXT_PUBLIC_APP_URL}/login`
        : 'https://hackpro.com/login'

      const emailResult = await sendTemplatedEmail(
        'welcome',
        user.email,
        {
          participantName: user.name,
          participantEmail: user.email,
          organizationName: organization.name,
          registrationDate: new Date().toLocaleDateString('ar-SA'),
          loginUrl: loginUrl,
          organizerName: 'فريق HackPro SaaS',
          organizerEmail: process.env.MAIL_FROM || 'no-reply@hackpro.com'
        }
      )
      
      if (emailResult && emailResult.actuallyMailed) {
        emailSent = true
      }
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError)
    }

    // Create response
    const response = NextResponse.json({
      message: emailSent 
        ? 'تم إنشاء الحساب بنجاح! تم إرسال إيميل ترحيبي إلى بريدك الإلكتروني' 
        : 'تم إنشاء الحساب بنجاح',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      organization: {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
        domain: subdomain
      },
      emailSent,
      autoLogin: true
    })

    // Set cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/'
    })

    return response

  } catch (error) {
    console.error('❌ Error in verify-otp:', error)
    return NextResponse.json({ 
      error: 'حدث خطأ في التحقق من الكود' 
    }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'

