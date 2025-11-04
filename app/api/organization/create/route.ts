import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/password'
import { SignJWT } from 'jose'

/**
 * POST /api/organization/create
 * 
 * Create a new organization with owner account
 * This is used for the signup flow
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      // Organization data
      organizationName,
      organizationSlug,
      primaryColor,
      secondaryColor,
      accentColor,
      
      // Owner data
      ownerName,
      ownerEmail,
      ownerPassword,
      ownerPhone,
      
      // Plan (optional - defaults to free)
      plan = 'free'
    } = body

    // Validation
    if (!organizationName || !organizationSlug || !ownerName || !ownerEmail || !ownerPassword) {
      return NextResponse.json(
        { error: 'جميع الحقول المطلوبة يجب تعبئتها' },
        { status: 400 }
      )
    }

    // Validate slug format
    const slugRegex = /^[a-z0-9-]+$/
    if (!slugRegex.test(organizationSlug)) {
      return NextResponse.json(
        { error: 'الرمز يجب أن يحتوي على أحرف صغيرة وأرقام وشرطات فقط' },
        { status: 400 }
      )
    }

    // Check if slug is already taken
    const existingOrg = await prisma.organization.findUnique({
      where: { slug: organizationSlug }
    })

    if (existingOrg) {
      return NextResponse.json(
        { error: 'هذا الرمز مستخدم بالفعل' },
        { status: 400 }
      )
    }

    // Check if email is already registered
    const existingUser = await prisma.user.findUnique({
      where: { email: ownerEmail }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'هذا البريد الإلكتروني مستخدم بالفعل' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(ownerPassword)

    // Get plan limits
    const planLimits = {
      free: {
        maxHackathons: 1,
        maxUsers: 10,
        maxParticipants: 50,
        maxStorage: BigInt(1073741824), // 1GB
        maxEmailsPerMonth: 100
      },
      starter: {
        maxHackathons: 3,
        maxUsers: 50,
        maxParticipants: 200,
        maxStorage: BigInt(10737418240), // 10GB
        maxEmailsPerMonth: 1000
      },
      professional: {
        maxHackathons: 10,
        maxUsers: 999999,
        maxParticipants: 999999,
        maxStorage: BigInt(53687091200), // 50GB
        maxEmailsPerMonth: 5000
      },
      enterprise: {
        maxHackathons: 999999,
        maxUsers: 999999,
        maxParticipants: 999999,
        maxStorage: BigInt(999999999999),
        maxEmailsPerMonth: 999999
      }
    }

    const limits = planLimits[plan as keyof typeof planLimits] || planLimits.free

    // Create organization and owner in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create organization
      const organization = await tx.organization.create({
        data: {
          name: organizationName,
          slug: organizationSlug,
          primaryColor: primaryColor || '#01645e',
          secondaryColor: secondaryColor || '#3ab666',
          accentColor: accentColor || '#c3e956',
          plan: plan as any,
          status: plan === 'free' ? 'active' : 'trial',
          maxHackathons: limits.maxHackathons,
          maxUsers: limits.maxUsers,
          maxParticipants: limits.maxParticipants,
          maxStorage: limits.maxStorage,
          maxEmailsPerMonth: limits.maxEmailsPerMonth
        }
      })

      // 2. Create owner user
      const user = await tx.user.create({
        data: {
          name: ownerName,
          email: ownerEmail,
          password: hashedPassword,
          phone: ownerPhone,
          role: 'admin',
          emailVerified: false
        }
      })

      // 3. Link user to organization as owner
      await tx.organizationUser.create({
        data: {
          userId: user.id,
          organizationId: organization.id,
          role: 'owner',
          isOwner: true
        }
      })

      // 4. Initialize usage metrics
      await tx.usageMetrics.create({
        data: {
          organizationId: organization.id,
          period: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      })

      return { organization, user }
    })

    // Generate JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret')
    const token = await new SignJWT({
      userId: result.user.id,
      email: result.user.email,
      role: result.user.role,
      name: result.user.name
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret)

    // Create response with auth cookie
    const response = NextResponse.json({
      success: true,
      message: 'تم إنشاء المنظمة بنجاح',
      organization: result.organization,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role
      },
      token
    }, { status: 201 })

    // Set auth cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Error creating organization:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في إنشاء المنظمة' },
      { status: 500 }
    )
  }
}


