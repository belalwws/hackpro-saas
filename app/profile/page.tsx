"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Flag,
  Calendar,
  Trophy,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Camera,
  Save,
  Lock,
  Edit2,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/contexts/language-context'
import { cn } from '@/lib/utils'

interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  city: string
  nationality: string
  profilePicture?: string
  status: string
  createdAt: string
  participations: Array<{
    id: string
    hackathon: {
      id: string
      title: string
      description: string
      startDate: string
      endDate: string
      status: string
    }
    teamName?: string
    projectTitle?: string
    projectDescription?: string
    teamRole?: string
    status: 'pending' | 'approved' | 'rejected'
    registeredAt: string
    approvedAt?: string
    rejectedAt?: string
    team?: {
      id: string
      name: string
      teamNumber: number
      members: Array<{
        id: string
        user: {
          id: string
          name: string
          email: string
          preferredRole: string
        }
      }>
    }
  }>
}

export default function ProfilePage() {
  const { user, refreshUser } = useAuth()
  const { language, t } = useLanguage()
  const isRTL = language === 'ar'
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [showPasswordFields, setShowPasswordFields] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    nationality: '',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    fetchProfile()
  }, [user])

  const fetchProfile = async () => {
    try {
      console.log('🔄 Fetching user profile...')

      const profileResponse = await fetch('/api/user/profile')
      if (!profileResponse.ok) {
        console.error('❌ Profile fetch failed:', profileResponse.status)
        router.push('/login')
        return
      }

      const profileData = await profileResponse.json()
      console.log('✅ Profile data received:', profileData)

      setProfile(profileData.user)
      setFormData({
        name: profileData.user.name || '',
        phone: profileData.user.phone || '',
        city: profileData.user.city || '',
        nationality: profileData.user.nationality || '',
      })
    } catch (error) {
      console.error('❌ Error fetching profile:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setError(t('profile.upload.error.type'))
      return
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      setError(t('profile.upload.error.size'))
      return
    }

    setUploading(true)
    setError('')
    setSuccess('')

    try {
      const formData = new FormData()
      formData.append('profilePicture', file)

      const response = await fetch('/api/user/profile/picture', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || t('profile.upload.error.type'))
      }

      setSuccess(t('profile.upload.success'))
      setProfile((prev) => (prev ? { ...prev, profilePicture: data.profilePicture } : null))
      if (refreshUser) {
        await refreshUser()
      }
    } catch (err) {
      console.error('Error uploading image:', err)
      setError(err instanceof Error ? err.message : 'حدث خطأ في رفع الصورة')
    } finally {
      setUploading(false)
    }
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || t('profile.update.error'))
      }

      setSuccess(t('profile.update.success'))
      setProfile((prev) => (prev ? { ...prev, ...formData } : null))
      setIsEditing(false)
      if (refreshUser) {
        await refreshUser()
      }
    } catch (err) {
      console.error('Error updating profile:', err)
      setError(err instanceof Error ? err.message : t('profile.update.error'))
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError(t('profile.password.mismatch'))
      return
    }

    if (passwordData.newPassword.length < 6) {
      setError(t('profile.password.minLength'))
      return
    }

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/user/profile/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || t('profile.password.error'))
      }

      setSuccess(t('profile.password.success'))
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      setShowPasswordFields(false)
    } catch (err) {
      console.error('Error changing password:', err)
      setError(err instanceof Error ? err.message : t('profile.password.error'))
    } finally {
      setSaving(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: t('profile.status.pending'), color: 'bg-yellow-500', icon: Clock },
      approved: { label: t('profile.status.approved'), color: 'bg-green-500', icon: CheckCircle },
      rejected: { label: t('profile.status.rejected'), color: 'bg-red-500', icon: XCircle },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending

    return (
      <Badge className={`${config.color} text-white flex items-center gap-1`}>
        <config.icon className="w-3 h-3" />
        {config.label}
      </Badge>
    )
  }

  const getHackathonStatusBadge = (status: string) => {
    const statusConfig = {
      DRAFT: { label: t('profile.hackathon.draft'), color: 'bg-gray-500' },
      OPEN: { label: t('profile.hackathon.open'), color: 'bg-green-500' },
      CLOSED: { label: t('profile.hackathon.closed'), color: 'bg-red-500' },
      COMPLETED: { label: t('profile.hackathon.completed'), color: 'bg-blue-500' },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT

    return <Badge className={`${config.color} text-white`}>{config.label}</Badge>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin mx-auto mb-4"></div>
              <p className={cn("text-gray-700 dark:text-gray-300 font-semibold", isRTL && "text-arabic")}>{t('profile.loading')}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className={cn("text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4", isRTL && "text-arabic")}>{t('profile.error.title')}</h1>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
            >
              {t('profile.error.retry')}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className={cn("text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2", isRTL && "text-arabic")}>
            {t('profile.title')}
          </h1>
          <p className={cn("text-gray-600 dark:text-gray-400 text-base sm:text-lg", isRTL && "text-arabic")}>{t('profile.subtitle')}</p>
        </motion.div>

        {/* Success/Error Messages */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl shadow-sm backdrop-blur-sm"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <p className="text-emerald-700 dark:text-emerald-300 font-medium">{success}</p>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl shadow-sm backdrop-blur-sm"
          >
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
            </div>
          </motion.div>
        )}

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-1">
            <TabsTrigger 
              value="profile"
              className={cn("data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg transition-all", isRTL && "text-arabic")}
            >
              {t('profile.tabs.profile')}
            </TabsTrigger>
            <TabsTrigger 
              value="participations"
              className={cn("data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg transition-all", isRTL && "text-arabic")}
            >
              {t('profile.tabs.participations')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            {/* Profile Card */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className={cn("text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2", isRTL && "text-arabic")}>
                      <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      {t('profile.personal.title')}
                    </CardTitle>
                  {!isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
                    >
                      <Edit2 className={cn("w-4 h-4", isRTL ? "mr-2" : "ml-2")} />
                      {t('profile.personal.edit')}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Profile Picture */}
                  <div className="flex flex-col items-center gap-4 pb-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="relative group">
                      {profile.profilePicture ? (
                        <div className="relative">
                          <img
                            src={profile.profilePicture}
                            alt={profile.name}
                            className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-xl ring-4 ring-indigo-100 dark:ring-indigo-900/50 transition-all group-hover:ring-indigo-200 dark:group-hover:ring-indigo-800"
                          />
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      ) : (
                        <div className="w-32 h-32 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-700 shadow-xl ring-4 ring-indigo-100 dark:ring-indigo-900/50">
                          <User className="w-16 h-16 text-white" />
                        </div>
                      )}
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="absolute bottom-0 right-0 bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-110"
                      >
                        {uploading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Camera className="w-5 h-5" />
                        )}
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                    <p className={cn("text-sm text-gray-500 dark:text-gray-400 text-center", isRTL && "text-arabic")}>{t('profile.personal.upload')}</p>
                  </div>

                  {/* Profile Form */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className={cn("text-sm font-semibold text-gray-700 dark:text-gray-300", isRTL && "text-arabic")}>
                        {t('profile.personal.name')}
                      </Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-gray-100 font-medium py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">{profile.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className={cn("text-sm font-semibold text-gray-700 dark:text-gray-300", isRTL && "text-arabic")}>
                        {t('profile.personal.email')}
                      </Label>
                      <div className="flex items-center gap-2 py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <Mail className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <p className="text-gray-900 dark:text-gray-100 font-medium flex-1">{profile.email}</p>
                        <Badge variant="outline" className={cn("border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 text-xs", isRTL && "text-arabic")}>
                          {t('profile.personal.email.readonly')}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className={cn("text-sm font-semibold text-gray-700 dark:text-gray-300", isRTL && "text-arabic")}>
                        {t('profile.personal.phone')}
                      </Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-gray-100 font-medium py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">{profile.phone || t('profile.personal.notSet')}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city" className={cn("text-sm font-semibold text-gray-700 dark:text-gray-300", isRTL && "text-arabic")}>
                        {t('profile.personal.city')}
                      </Label>
                      {isEditing ? (
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-gray-100 font-medium py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">{profile.city || t('profile.personal.notSet')}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nationality" className={cn("text-sm font-semibold text-gray-700 dark:text-gray-300", isRTL && "text-arabic")}>
                        {t('profile.personal.nationality')}
                      </Label>
                      {isEditing ? (
                        <Input
                          id="nationality"
                          value={formData.nationality}
                          onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                          className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-gray-100 font-medium py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          {profile.nationality || t('profile.personal.notSet')}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className={cn("text-sm font-semibold text-gray-700 dark:text-gray-300", isRTL && "text-arabic")}>{t('profile.personal.registrationDate')}</Label>
                      <div className="flex items-center gap-2 py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <p className="text-gray-900 dark:text-gray-100 font-medium">{formatDate(profile.createdAt)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {isEditing && (
                    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <Button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all flex-1 sm:flex-none"
                      >
                        {saving ? (
                          <>
                            <div className={cn("w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin", isRTL ? "mr-2" : "ml-2")} />
                            {t('profile.personal.saving')}
                          </>
                        ) : (
                          <>
                            <Save className={cn("w-4 h-4", isRTL ? "mr-2" : "ml-2")} />
                            {t('profile.personal.save')}
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false)
                          setFormData({
                            name: profile.name || '',
                            phone: profile.phone || '',
                            city: profile.city || '',
                            nationality: profile.nationality || '',
                          })
                          setError('')
                        }}
                        className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex-1 sm:flex-none"
                      >
                        <X className={cn("w-4 h-4", isRTL ? "mr-2" : "ml-2")} />
                        {t('profile.personal.cancel')}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Change Password Card */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-4">
                <CardTitle className={cn("text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2", isRTL && "text-arabic")}>
                  <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                  {t('profile.password.title')}
                </CardTitle>
                <CardDescription className={cn("text-gray-600 dark:text-gray-400 mt-2", isRTL && "text-arabic")}>
                  {t('profile.password.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!showPasswordFields ? (
                  <Button
                    variant="outline"
                    onClick={() => setShowPasswordFields(true)}
                    className="border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
                  >
                    <Lock className={cn("w-4 h-4", isRTL ? "mr-2" : "ml-2")} />
                    {t('profile.password.change')}
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword" className={cn("text-sm font-semibold text-gray-700 dark:text-gray-300", isRTL && "text-arabic")}>
                        {t('profile.password.current')}
                      </Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            setPasswordData({ ...passwordData, currentPassword: e.target.value })
                          }
                          className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className={cn("text-sm font-semibold text-gray-700 dark:text-gray-300", isRTL && "text-arabic")}>
                        {t('profile.password.new')}
                      </Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? 'text' : 'password'}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className={cn("text-sm font-semibold text-gray-700 dark:text-gray-300", isRTL && "text-arabic")}>
                        {t('profile.password.confirm')}
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <Button
                        onClick={handleChangePassword}
                        disabled={saving}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all flex-1 sm:flex-none"
                      >
                        {saving ? (
                          <>
                            <div className={cn("w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin", isRTL ? "mr-2" : "ml-2")} />
                            {t('profile.password.changing')}
                          </>
                        ) : (
                          <>
                            <Lock className={cn("w-4 h-4", isRTL ? "mr-2" : "ml-2")} />
                            {t('profile.password.change')}
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowPasswordFields(false)
                          setPasswordData({
                            currentPassword: '',
                            newPassword: '',
                            confirmPassword: '',
                          })
                          setError('')
                        }}
                        className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex-1 sm:flex-none"
                      >
                        <X className={cn("w-4 h-4", isRTL ? "mr-2" : "ml-2")} />
                        {t('profile.personal.cancel')}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="participations">
            {/* Participations Section - Keep the existing code */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className={cn("text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2", isRTL && "text-arabic")}>
                  <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  {t('profile.participations.title')}
                </CardTitle>
                <CardDescription className={cn("text-gray-600 dark:text-gray-400 mt-2", isRTL && "text-arabic")}>{t('profile.participations.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                {!profile.participations || profile.participations.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Trophy className="w-8 h-8 text-white" />
                    </div>
                    <h3 className={cn("text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2", isRTL && "text-arabic")}>{t('profile.participations.empty.title')}</h3>
                    <p className={cn("text-gray-600 dark:text-gray-400 mb-6", isRTL && "text-arabic")}>{t('profile.participations.empty.description')}</p>
                    <Link href="/hackathons">
                      <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all">
                        {t('profile.participations.empty.cta')}
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {profile.participations.map((participation, index) => (
                      <motion.div
                        key={participation.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800/50 backdrop-blur-sm"
                      >
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                {participation.hackathon.title}
                              </h3>
                              {getStatusBadge(participation.status)}
                              {getHackathonStatusBadge(participation.hackathon.status)}
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                              {participation.hackathon.description}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Link href={`/hackathons/${participation.hackathon.id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
                              >
                                <Eye className={cn("w-4 h-4", isRTL ? "mr-1" : "ml-1")} />
                                {t('profile.participations.view')}
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
