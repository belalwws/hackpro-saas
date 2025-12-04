import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary'

// POST /api/user/profile/picture - Upload profile picture
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const authToken = cookieStore.get('auth-token')?.value
    if (!authToken) {
      return NextResponse.json({ error: 'غير مصرح بالوصول' }, { status: 401 })
    }

    const payload = await verifyToken(authToken)
    if (!payload) {
      return NextResponse.json({ error: 'غير مصرح بالوصول' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('profilePicture') as File

    if (!file) {
      return NextResponse.json({ error: 'لم يتم اختيار ملف' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'نوع الملف غير مدعوم. يرجى اختيار صورة (JPG, PNG, WebP)' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت' },
        { status: 400 }
      )
    }

    // Get current user to check for existing profile picture
    const currentUser = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { profilePicture: true },
    })

    // Delete old image from Cloudinary if exists
    if (currentUser?.profilePicture && currentUser.profilePicture.includes('cloudinary')) {
      try {
        const publicIdMatch = currentUser.profilePicture.match(/\/user-profiles\/([^/]+)\.[^.]+$/)
        if (publicIdMatch) {
          const publicId = `user-profiles/${publicIdMatch[1]}`
          await deleteFromCloudinary(publicId, 'image')
        }
      } catch (error) {
        console.error('Error deleting old profile picture:', error)
        // Continue with upload even if deletion fails
      }
    }

    // Convert file to base64 for Cloudinary upload
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataUrl = `data:${file.type};base64,${base64}`

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(
      dataUrl,
      'user-profiles', // folder name
      `${payload.userId}-${Date.now()}` // unique filename
    )

    // Update user profile picture with Cloudinary URL
    const updatedUser = await prisma.user.update({
      where: { id: payload.userId },
      data: {
        profilePicture: uploadResult.url,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        profilePicture: true,
      },
    })

    return NextResponse.json({
      message: 'تم تحديث الصورة الشخصية بنجاح',
      profilePicture: updatedUser.profilePicture,
    })
  } catch (error) {
    console.error('Error uploading profile picture:', error)
    return NextResponse.json({ error: 'حدث خطأ في رفع الصورة' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'






