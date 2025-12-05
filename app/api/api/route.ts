import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

/**
 * GET /api/api
 * 
 * API Documentation Endpoint
 * 
 * Returns comprehensive documentation of all available API endpoints.
 * Requires authentication - user must be registered and logged in.
 * 
 * @returns JSON response with API documentation
 */
export async function GET(request: NextRequest) {
  try {
    // Check if request is from browser (wants HTML)
    const acceptHeader = request.headers.get('accept') || ''
    const isBrowserRequest = acceptHeader.includes('text/html')
    
    // If browser request, redirect to UI page
    if (isBrowserRequest) {
      return NextResponse.redirect(new URL('/api-docs', request.url))
    }
    
    // Verify authentication for API requests
    const token = request.cookies.get('auth-token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { 
          error: 'غير مصرح بالوصول',
          message: 'يجب تسجيل الدخول للوصول إلى وثائق API',
          english: 'Unauthorized - Please login to access API documentation'
        },
        { status: 401 }
      )
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { 
          error: 'رمز المصادقة غير صالح',
          message: 'الرجاء تسجيل الدخول مرة أخرى',
          english: 'Invalid authentication token - Please login again'
        },
        { status: 401 }
      )
    }

    // Get user info for personalized response
    const { prisma } = await import('@/lib/prisma')
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    })

    // Comprehensive API Documentation
    const documentation = {
      api: {
        name: 'HackPro SaaS API',
        version: '1.0.0',
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
        description: 'منصة API شاملة لإدارة الهاكاثونات والمسابقات التقنية',
        englishDescription: 'Comprehensive API platform for managing hackathons and technical competitions',
        authentication: {
          type: 'JWT Token',
          method: 'Cookie or Bearer Token',
          cookieName: 'auth-token',
          headerName: 'Authorization: Bearer <token>',
          note: 'جميع الـ endpoints تتطلب مصادقة ما لم يُذكر خلاف ذلك',
          englishNote: 'All endpoints require authentication unless otherwise stated'
        },
        currentUser: {
          id: user?.id,
          email: user?.email,
          name: user?.name,
          role: user?.role
        }
      },
      endpoints: {
        authentication: {
          category: 'المصادقة والتسجيل',
          englishCategory: 'Authentication & Registration',
          endpoints: [
            {
              method: 'POST',
              path: '/api/auth/login',
              description: 'تسجيل الدخول',
              englishDescription: 'User login',
              authRequired: false,
              requestBody: {
                email: 'string (required)',
                password: 'string (required)'
              },
              response: {
                success: 'boolean',
                token: 'string (JWT)',
                user: 'object'
              }
            },
            {
              method: 'POST',
              path: '/api/auth/register',
              description: 'إنشاء حساب جديد',
              englishDescription: 'Create new account',
              authRequired: false,
              requestBody: {
                email: 'string (required)',
                password: 'string (required)',
                name: 'string (required)',
                role: 'string (optional)'
              }
            },
            {
              method: 'POST',
              path: '/api/auth/forgot-password',
              description: 'طلب إعادة تعيين كلمة المرور',
              englishDescription: 'Request password reset',
              authRequired: false
            },
            {
              method: 'POST',
              path: '/api/auth/reset-password',
              description: 'إعادة تعيين كلمة المرور',
              englishDescription: 'Reset password',
              authRequired: false
            },
            {
              method: 'GET',
              path: '/api/auth/verify',
              description: 'التحقق من حالة الجلسة',
              englishDescription: 'Verify session status',
              authRequired: true
            },
            {
              method: 'POST',
              path: '/api/logout',
              description: 'تسجيل الخروج',
              englishDescription: 'Logout',
              authRequired: true
            }
          ]
        },
        hackathons: {
          category: 'الهاكاثونات',
          englishCategory: 'Hackathons',
          endpoints: [
            {
              method: 'GET',
              path: '/api/hackathons',
              description: 'الحصول على قائمة الهاكاثونات',
              englishDescription: 'Get list of hackathons',
              authRequired: false,
              queryParams: {
                all: 'boolean (optional) - Get all hackathons including closed ones'
              }
            },
            {
              method: 'GET',
              path: '/api/hackathons/active',
              description: 'الحصول على الهاكاثونات النشطة',
              englishDescription: 'Get active hackathons',
              authRequired: false
            },
            {
              method: 'GET',
              path: '/api/hackathons/pinned',
              description: 'الحصول على الهاكاثونات المثبتة',
              englishDescription: 'Get pinned hackathons',
              authRequired: false
            },
            {
              method: 'GET',
              path: '/api/hackathons/{id}',
              description: 'الحصول على تفاصيل هاكاثون محدد',
              englishDescription: 'Get hackathon details',
              authRequired: false
            }
          ]
        },
        admin: {
          category: 'لوحة تحكم المدير',
          englishCategory: 'Admin Dashboard',
          endpoints: [
            {
              method: 'GET',
              path: '/api/admin/dashboard',
              description: 'إحصائيات لوحة التحكم',
              englishDescription: 'Dashboard statistics',
              authRequired: true,
              requiredRole: 'admin'
            },
            {
              method: 'GET',
              path: '/api/admin/dashboard-stats',
              description: 'إحصائيات مفصلة للوحة التحكم',
              englishDescription: 'Detailed dashboard statistics',
              authRequired: true,
              requiredRole: 'admin'
            },
            {
              method: 'GET',
              path: '/api/admin/hackathons',
              description: 'إدارة الهاكاثونات',
              englishDescription: 'Manage hackathons',
              authRequired: true,
              requiredRole: 'admin'
            },
            {
              method: 'POST',
              path: '/api/admin/hackathons',
              description: 'إنشاء هاكاثون جديد',
              englishDescription: 'Create new hackathon',
              authRequired: true,
              requiredRole: 'admin'
            },
            {
              method: 'GET',
              path: '/api/admin/participants',
              description: 'إدارة المشاركين',
              englishDescription: 'Manage participants',
              authRequired: true,
              requiredRole: 'admin'
            },
            {
              method: 'GET',
              path: '/api/admin/judges',
              description: 'إدارة المحكمين',
              englishDescription: 'Manage judges',
              authRequired: true,
              requiredRole: 'admin'
            },
            {
              method: 'GET',
              path: '/api/admin/teams',
              description: 'إدارة الفرق',
              englishDescription: 'Manage teams',
              authRequired: true,
              requiredRole: 'admin'
            },
            {
              method: 'GET',
              path: '/api/admin/results',
              description: 'عرض النتائج',
              englishDescription: 'View results',
              authRequired: true,
              requiredRole: 'admin'
            },
            {
              method: 'GET',
              path: '/api/admin/reports',
              description: 'التقارير والإحصائيات',
              englishDescription: 'Reports and statistics',
              authRequired: true,
              requiredRole: 'admin'
            },
            {
              method: 'GET',
              path: '/api/admin/api-key',
              description: 'إدارة مفاتيح API',
              englishDescription: 'Manage API keys',
              authRequired: true,
              requiredRole: 'admin'
            }
          ]
        },
        participants: {
          category: 'المشاركون',
          englishCategory: 'Participants',
          endpoints: [
            {
              method: 'POST',
              path: '/api/participants/register',
              description: 'التسجيل في هاكاثون',
              englishDescription: 'Register for hackathon',
              authRequired: true
            },
            {
              method: 'GET',
              path: '/api/participants/{id}',
              description: 'الحصول على معلومات مشارك',
              englishDescription: 'Get participant information',
              authRequired: true
            },
            {
              method: 'POST',
              path: '/api/participant/upload-idea',
              description: 'رفع فكرة المشروع',
              englishDescription: 'Upload project idea',
              authRequired: true,
              requiredRole: 'participant'
            }
          ]
        },
        judges: {
          category: 'المحكمون',
          englishCategory: 'Judges',
          endpoints: [
            {
              method: 'POST',
              path: '/api/judge/apply',
              description: 'التقدم للعمل كمحكم',
              englishDescription: 'Apply to be a judge',
              authRequired: true
            },
            {
              method: 'GET',
              path: '/api/judge/hackathons',
              description: 'الحصول على الهاكاثونات المخصصة للمحكم',
              englishDescription: 'Get assigned hackathons',
              authRequired: true,
              requiredRole: 'judge'
            },
            {
              method: 'POST',
              path: '/api/judge/evaluate',
              description: 'تقييم مشروع',
              englishDescription: 'Evaluate project',
              authRequired: true,
              requiredRole: 'judge'
            },
            {
              method: 'GET',
              path: '/api/judge/my-scores',
              description: 'عرض التقييمات الخاصة بي',
              englishDescription: 'View my scores',
              authRequired: true,
              requiredRole: 'judge'
            }
          ]
        },
        supervisors: {
          category: 'المشرفون',
          englishCategory: 'Supervisors',
          endpoints: [
            {
              method: 'GET',
              path: '/api/supervisor/dashboard',
              description: 'لوحة تحكم المشرف',
              englishDescription: 'Supervisor dashboard',
              authRequired: true,
              requiredRole: 'supervisor'
            },
            {
              method: 'GET',
              path: '/api/supervisor/hackathons',
              description: 'الهاكاثونات المخصصة للمشرف',
              englishDescription: 'Assigned hackathons',
              authRequired: true,
              requiredRole: 'supervisor'
            },
            {
              method: 'GET',
              path: '/api/supervisor/participants',
              description: 'إدارة المشاركين',
              englishDescription: 'Manage participants',
              authRequired: true,
              requiredRole: 'supervisor'
            },
            {
              method: 'GET',
              path: '/api/supervisor/teams',
              description: 'إدارة الفرق',
              englishDescription: 'Manage teams',
              authRequired: true,
              requiredRole: 'supervisor'
            },
            {
              method: 'GET',
              path: '/api/supervisor/reports',
              description: 'التقارير',
              englishDescription: 'Reports',
              authRequired: true,
              requiredRole: 'supervisor'
            }
          ]
        },
        organization: {
          category: 'المنظمات',
          englishCategory: 'Organizations',
          endpoints: [
            {
              method: 'GET',
              path: '/api/organization/current',
              description: 'الحصول على المنظمة الحالية',
              englishDescription: 'Get current organization',
              authRequired: true
            },
            {
              method: 'GET',
              path: '/api/organization/list',
              description: 'قائمة المنظمات',
              englishDescription: 'List organizations',
              authRequired: true
            },
            {
              method: 'POST',
              path: '/api/organization/create',
              description: 'إنشاء منظمة جديدة',
              englishDescription: 'Create new organization',
              authRequired: true
            },
            {
              method: 'POST',
              path: '/api/organization/switch',
              description: 'التبديل بين المنظمات',
              englishDescription: 'Switch organization',
              authRequired: true
            },
            {
              method: 'GET',
              path: '/api/organization/usage',
              description: 'استخدام المنظمة',
              englishDescription: 'Organization usage',
              authRequired: true
            }
          ]
        },
        user: {
          category: 'المستخدم',
          englishCategory: 'User',
          endpoints: [
            {
              method: 'GET',
              path: '/api/user/profile',
              description: 'الحصول على الملف الشخصي',
              englishDescription: 'Get user profile',
              authRequired: true
            },
            {
              method: 'PUT',
              path: '/api/user/profile',
              description: 'تحديث الملف الشخصي',
              englishDescription: 'Update user profile',
              authRequired: true
            },
            {
              method: 'GET',
              path: '/api/user/participations',
              description: 'مشاركاتي',
              englishDescription: 'My participations',
              authRequired: true
            },
            {
              method: 'POST',
              path: '/api/user/delete-account',
              description: 'حذف الحساب',
              englishDescription: 'Delete account',
              authRequired: true
            }
          ]
        },
        blog: {
          category: 'المدونة',
          englishCategory: 'Blog',
          endpoints: [
            {
              method: 'GET',
              path: '/api/blog/posts',
              description: 'الحصول على المقالات',
              englishDescription: 'Get blog posts',
              authRequired: false
            },
            {
              method: 'GET',
              path: '/api/blog/categories',
              description: 'الحصول على الفئات',
              englishDescription: 'Get categories',
              authRequired: false
            },
            {
              method: 'GET',
              path: '/api/blog/tags',
              description: 'الحصول على الوسوم',
              englishDescription: 'Get tags',
              authRequired: false
            }
          ]
        },
        certificates: {
          category: 'الشهادات',
          englishCategory: 'Certificates',
          endpoints: [
            {
              method: 'GET',
              path: '/api/certificates/{filename}',
              description: 'تحميل شهادة',
              englishDescription: 'Download certificate',
              authRequired: true
            },
            {
              method: 'POST',
              path: '/api/admin/certificates/send',
              description: 'إرسال شهادة',
              englishDescription: 'Send certificate',
              authRequired: true,
              requiredRole: 'admin'
            }
          ]
        },
        external: {
          category: 'API الخارجي',
          englishCategory: 'External API',
          endpoints: [
            {
              method: 'GET',
              path: '/api/external/v1/status',
              description: 'حالة API الخارجي',
              englishDescription: 'External API status',
              authRequired: false,
              note: 'يتطلب API Key في Header: X-API-Key'
            },
            {
              method: 'GET',
              path: '/api/external/v1/hackathons',
              description: 'الحصول على الهاكاثونات (API خارجي)',
              englishDescription: 'Get hackathons (External API)',
              authRequired: false,
              note: 'يتطلب API Key'
            },
            {
              method: 'POST',
              path: '/api/external/v1/hackathons/{id}/register',
              description: 'التسجيل في هاكاثون (API خارجي)',
              englishDescription: 'Register for hackathon (External API)',
              authRequired: false,
              note: 'يتطلب API Key'
            }
          ]
        },
        system: {
          category: 'النظام',
          englishCategory: 'System',
          endpoints: [
            {
              method: 'GET',
              path: '/api/health',
              description: 'فحص حالة النظام',
              englishDescription: 'System health check',
              authRequired: false
            },
            {
              method: 'GET',
              path: '/api/verify-session',
              description: 'التحقق من الجلسة',
              englishDescription: 'Verify session',
              authRequired: true
            }
          ]
        }
      },
      usage: {
        authentication: {
          title: 'كيفية استخدام API',
          englishTitle: 'How to use the API',
          steps: [
            {
              step: 1,
              arabic: 'قم بتسجيل الدخول عبر POST /api/auth/login للحصول على JWT token',
              english: 'Login via POST /api/auth/login to get JWT token'
            },
            {
              step: 2,
              arabic: 'استخدم الـ token في Cookie باسم auth-token أو في Header كـ Authorization: Bearer <token>',
              english: 'Use the token in Cookie named auth-token or in Header as Authorization: Bearer <token>'
            },
            {
              step: 3,
              arabic: 'أرسل الطلبات إلى الـ endpoints المطلوبة',
              english: 'Send requests to the desired endpoints'
            }
          ]
        },
        example: {
          title: 'مثال على الطلب',
          englishTitle: 'Request Example',
          curl: `curl -X GET "${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/user/profile" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json"`,
          javascript: `fetch('${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/user/profile', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN',
    'Content-Type': 'application/json'
  },
  credentials: 'include'
})
.then(response => response.json())
.then(data => console.log(data));`
        }
      },
      rateLimiting: {
        note: 'يتم تطبيق Rate Limiting على جميع الـ endpoints',
        englishNote: 'Rate limiting is applied to all endpoints',
        limits: {
          default: '100 requests per minute',
          authenticated: '1000 requests per minute',
          admin: '5000 requests per minute'
        }
      },
      errors: {
        common: [
          {
            code: 401,
            message: 'غير مصرح - يجب تسجيل الدخول',
            english: 'Unauthorized - Login required'
          },
          {
            code: 403,
            message: 'ممنوع - صلاحيات غير كافية',
            english: 'Forbidden - Insufficient permissions'
          },
          {
            code: 404,
            message: 'غير موجود',
            english: 'Not Found'
          },
          {
            code: 500,
            message: 'خطأ في الخادم',
            english: 'Internal Server Error'
          }
        ]
      },
      support: {
        documentation: 'https://github.com/belalwws/hackpro-saas',
        issues: 'https://github.com/belalwws/hackpro-saas/issues',
        note: 'للمزيد من المعلومات، راجع الوثائق الكاملة للمشروع',
        englishNote: 'For more information, refer to the full project documentation'
      }
    }

    return NextResponse.json({
      success: true,
      message: 'مرحباً بك في وثائق HackPro API',
      englishMessage: 'Welcome to HackPro API Documentation',
      ...documentation,
      timestamp: new Date().toISOString()
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })

  } catch (error) {
    console.error('Error generating API documentation:', error)
    return NextResponse.json(
      {
        error: 'خطأ في الخادم',
        english: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}






