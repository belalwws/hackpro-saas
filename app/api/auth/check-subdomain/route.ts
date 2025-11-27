import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/auth/check-subdomain?slug=organization-slug
// Check if subdomain is available
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    if (!slug) {
      return NextResponse.json({ error: 'معرّف المؤسسة مطلوب' }, { status: 400 })
    }

    // Validate slug format
    const slugRegex = /^[a-z0-9-]+$/
    if (!slugRegex.test(slug)) {
      return NextResponse.json({ 
        error: 'معرّف المؤسسة يجب أن يحتوي على حروف صغيرة وأرقام وشرطات فقط',
        available: false 
      }, { status: 400 })
    }

    const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'hackpro.com'
    const subdomain = `${slug}.${baseDomain}`

    // Check if organization slug exists
    const existingOrg = await prisma.organization.findUnique({
      where: { slug: slug }
    })

    if (existingOrg) {
      return NextResponse.json({ 
        available: false,
        reason: 'معرّف المؤسسة مستخدم بالفعل',
        subdomain 
      })
    }

    // Check if subdomain exists in CustomDomain
    const existingDomain = await prisma.customDomain.findUnique({
      where: { domain: subdomain }
    })

    if (existingDomain) {
      return NextResponse.json({ 
        available: false,
        reason: 'الدومين الفرعي مستخدم بالفعل',
        subdomain 
      })
    }

    // Check if subdomain exists in Organization.domain
    const existingOrgDomain = await prisma.organization.findFirst({
      where: { domain: subdomain }
    })

    if (existingOrgDomain) {
      return NextResponse.json({ 
        available: false,
        reason: 'الدومين الفرعي مستخدم بالفعل',
        subdomain 
      })
    }

    return NextResponse.json({ 
      available: true,
      subdomain,
      message: 'الدومين الفرعي متاح'
    })

  } catch (error) {
    console.error('Error checking subdomain:', error)
    return NextResponse.json({ 
      error: 'خطأ في التحقق من الدومين الفرعي',
      available: false 
    }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'

