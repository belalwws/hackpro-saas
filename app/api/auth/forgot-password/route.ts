import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendMail } from '@/lib/mailer'
import crypto from 'crypto'

// Rate limiting: 60 seconds between emails
const RATE_LIMIT_SECONDS = 60

// POST /api/auth/forgot-password - Send password reset link
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني مطلوب' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    // Don't reveal if user exists or not for security
    if (!user) {
      // Still return success to prevent email enumeration
      return NextResponse.json({
        message: 'إذا كان البريد الإلكتروني مسجلاً، سيتم إرسال رابط إعادة التعيين',
      })
    }

    // Check if user has a password (some users might not have passwords yet)
    if (!user.password) {
      return NextResponse.json({
        message: 'إذا كان البريد الإلكتروني مسجلاً، سيتم إرسال رابط إعادة التعيين',
      })
    }

    // Rate limiting: Check if email was sent recently
    if (user.lastResetEmailSentAt) {
      const timeSinceLastEmail = Date.now() - user.lastResetEmailSentAt.getTime()
      const secondsRemaining = Math.ceil((RATE_LIMIT_SECONDS * 1000 - timeSinceLastEmail) / 1000)
      
      if (timeSinceLastEmail < RATE_LIMIT_SECONDS * 1000) {
        return NextResponse.json(
          { 
            error: 'يرجى الانتظار قبل إعادة المحاولة',
            secondsRemaining,
            rateLimited: true
          },
          { status: 429 }
        )
      }
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    // Save reset token and update last sent time
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpiry: resetTokenExpiry,
        lastResetEmailSentAt: new Date(),
      },
    })

    // Create reset link dynamically based on request origin
    const getBaseUrl = () => {
      const isDevelopment = process.env.NODE_ENV === 'development'
      const host = request.headers.get('host') || ''
      const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1') || host.includes('0.0.0.0')
      
      // 1. In development mode, prioritize localhost
      if (isDevelopment && isLocalhost) {
        const port = host.split(':')[1] || '3000'
        const url = `http://localhost:${port}`
        console.log('✅ Development mode - Using localhost:', url)
        return url
      }
      
      // 2. Check if NEXT_PUBLIC_APP_URL is set (for explicit configuration)
      if (process.env.NEXT_PUBLIC_APP_URL) {
        const url = process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '') // Remove trailing slash
        // In development, only use this if it's localhost
        if (isDevelopment && !url.includes('localhost') && !url.includes('127.0.0.1')) {
          console.log('⚠️ Development mode but NEXT_PUBLIC_APP_URL is not localhost, skipping')
        } else {
          console.log('✅ Using NEXT_PUBLIC_APP_URL:', url)
          return url
        }
      }
      
      // 3. Try to get from Origin header (most reliable for client requests)
      const originHeader = request.headers.get('origin')
      if (originHeader) {
        try {
          const originUrl = new URL(originHeader)
          // In development, prefer localhost origins
          if (isDevelopment && originUrl.hostname.includes('localhost')) {
            console.log('✅ Development mode - Using Origin header (localhost):', originUrl.origin)
            return originUrl.origin
          } else if (!isDevelopment) {
            console.log('✅ Using Origin header:', originUrl.origin)
            return originUrl.origin
          }
        } catch (e) {
          console.warn('Invalid origin header:', originHeader)
        }
      }
      
      // 4. Try to get from Referer header
      const referer = request.headers.get('referer')
      if (referer) {
        try {
          const refererUrl = new URL(referer)
          // In development, prefer localhost referers
          if (isDevelopment && refererUrl.hostname.includes('localhost')) {
            console.log('✅ Development mode - Using Referer header (localhost):', refererUrl.origin)
            return refererUrl.origin
          } else if (!isDevelopment) {
            console.log('✅ Using Referer header:', refererUrl.origin)
            return refererUrl.origin
          }
        } catch (e) {
          console.warn('Invalid referer header:', referer)
        }
      }
      
      // 5. In development, always use localhost as fallback
      if (isDevelopment) {
        const port = host.split(':')[1] || '3000'
        const url = `http://localhost:${port}`
        console.log('✅ Development mode - Using localhost fallback:', url)
        return url
      }
      
      // 6. Try x-forwarded-host (for reverse proxies in production)
      const forwardedHost = request.headers.get('x-forwarded-host')
      if (forwardedHost) {
        const forwardedProto = request.headers.get('x-forwarded-proto') || 'https'
        const url = `${forwardedProto}://${forwardedHost.split(',')[0].trim()}`
        console.log('✅ Using x-forwarded-host:', url)
        return url
      }
      
      // 7. Build from host header (production fallback)
      if (host && !isLocalhost) {
        const forwardedProto = request.headers.get('x-forwarded-proto')
        const forwardedSsl = request.headers.get('x-forwarded-ssl')
        
        // Determine protocol
        let protocol = 'https'
        if (forwardedProto) {
          protocol = forwardedProto.split(',')[0].trim()
        } else if (forwardedSsl === 'on') {
          protocol = 'https'
        }
        
        const url = `${protocol}://${host}`
        console.log('✅ Using host header:', url)
        return url
      }
      
      // 8. Final fallback
      const fallbackUrl = isDevelopment ? 'http://localhost:3000' : 'https://clownfish-app-px9sc.ondigitalocean.app'
      console.warn('⚠️ Using final fallback:', fallbackUrl)
      return fallbackUrl
    }
    
    const baseUrl = getBaseUrl()
    const resetLink = `${baseUrl}/reset-password?token=${resetToken}`
    
    console.log('🔗 Reset link generated:', {
      baseUrl,
      resetLink,
      originHeader: request.headers.get('origin'),
      referer: request.headers.get('referer'),
      host: request.headers.get('host'),
      forwardedHost: request.headers.get('x-forwarded-host'),
      forwardedProto: request.headers.get('x-forwarded-proto'),
      nextUrlOrigin: request.nextUrl.origin
    })

    // Send email
    const emailSubject = 'إعادة تعيين كلمة المرور - HackPro'
    const emailHtml = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: Tahoma, Arial, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #155DFC 0%, #1248C9 100%); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">HackPro</h1>
          </div>
          
          <!-- Content -->
          <div style="padding: 30px;">
            <h2 style="color: #0A0A0A; margin-bottom: 20px; font-size: 24px;">إعادة تعيين كلمة المرور</h2>
            
            <p style="color: #6A7282; line-height: 1.8; margin-bottom: 20px; font-size: 16px;">
              مرحباً <strong>${user.name || 'عزيزي المستخدم'}</strong>،
            </p>
            
            <p style="color: #6A7282; line-height: 1.8; margin-bottom: 30px; font-size: 16px;">
              لقد طلبت إعادة تعيين كلمة المرور لحسابك في منصة HackPro. انقر على الزر أدناه لإعادة تعيين كلمة المرور:
            </p>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 40px 0;">
              <a href="${resetLink}" 
                 style="display: inline-block; background: linear-gradient(135deg, #155DFC 0%, #1248C9 100%); color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(21, 93, 252, 0.3);">
                إعادة تعيين كلمة المرور
              </a>
            </div>
            
            <!-- Alternative Link -->
            <div style="background-color: #F9FAFB; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <p style="color: #6A7282; line-height: 1.6; margin-bottom: 10px; font-size: 14px; font-weight: bold;">
                أو انسخ والصق الرابط التالي في المتصفح:
              </p>
              <p style="color: #155DFC; word-break: break-all; font-size: 13px; background-color: #E6F0FF; padding: 12px; border-radius: 6px; margin: 0; direction: ltr; text-align: left;">
                ${resetLink}
              </p>
            </div>
            
            <!-- Important Notes -->
            <div style="background-color: #FFF7ED; border-right: 4px solid #F59E0B; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <p style="color: #92400E; line-height: 1.6; margin-bottom: 10px; font-size: 14px; font-weight: bold;">
                ⚠️ ملاحظات مهمة:
              </p>
              <ul style="color: #92400E; line-height: 2; font-size: 14px; padding-right: 20px; margin: 0;">
                <li>هذا الرابط صالح لمدة <strong>ساعة واحدة فقط</strong></li>
                <li>إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذا البريد الإلكتروني بأمان</li>
                <li>لن يتم تغيير كلمة المرور حتى تنقر على الرابط أعلاه</li>
                <li>لأسباب أمنية، لا تشارك هذا الرابط مع أي شخص آخر</li>
              </ul>
            </div>
            
            <!-- Spam Notice -->
            <div style="background-color: #E6F0FF; border-right: 4px solid #155DFC; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #155DFC; line-height: 1.6; margin: 0; font-size: 13px;">
                💡 <strong>نصيحة:</strong> إذا لم تجد هذا البريد في صندوق الوارد، تحقق من مجلد الرسائل غير المرغوب فيها (Spam/Junk)
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #F9FAFB; padding: 20px; text-align: center; border-top: 1px solid #E5E7EB;">
            <p style="color: #6A7282; font-size: 12px; margin: 0;">
              © 2024 HackPro. جميع الحقوق محفوظة.
            </p>
            <p style="color: #9CA3AF; font-size: 11px; margin: 10px 0 0 0;">
              هذا بريد إلكتروني تلقائي، يرجى عدم الرد عليه.
            </p>
          </div>
        </div>
      </body>
      </html>
    `

    try {
      const emailResult = await sendMail({
        to: user.email,
        subject: emailSubject,
        html: emailHtml,
      })

      console.log('✅ Password reset email sent:', {
        to: user.email,
        messageId: emailResult?.messageId,
        actuallyMailed: emailResult?.actuallyMailed,
        mocked: emailResult?.mocked
      })

      // If email was mocked (not actually sent), still return success but log it
      if (emailResult?.mocked) {
        console.warn('⚠️ Email was mocked (not actually sent) - check mailer configuration')
      }

      return NextResponse.json({
        message: 'تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني',
        emailSent: emailResult?.actuallyMailed !== false
      })
    } catch (emailError: any) {
      console.error('❌ Error sending reset email:', {
        error: emailError?.message,
        stack: emailError?.stack,
        to: user.email
      })
      
      // Still return success to prevent revealing email issues (security best practice)
      // But log the error for debugging
      return NextResponse.json({
        message: 'إذا كان البريد الإلكتروني مسجلاً، سيتم إرسال رابط إعادة التعيين',
        // Include reset link in response for development/testing (remove in production)
        ...(process.env.NODE_ENV === 'development' && {
          debug: {
            resetLink,
            error: emailError?.message
          }
        })
      })
    }
  } catch (error) {
    console.error('Error in forgot-password:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء معالجة الطلب' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'

