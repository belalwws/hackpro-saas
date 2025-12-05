"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Building2, Mail, Lock, User, Globe, ArrowRight, Sparkles, Check, Eye, EyeOff, Rocket, Shield, Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Loader } from '@/components/ui/loader'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/contexts/language-context'

export default function RegisterPage() {
  const router = useRouter()
  const { language } = useLanguage()
  const isRTL = language === 'ar'
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    organizationName: '',
    organizationSlug: ''
  })
  const [slugStatus, setSlugStatus] = useState<{
    checking: boolean
    available: boolean | null
    message: string
  }>({
    checking: false,
    available: null,
    message: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Auto-generate slug from organization name
  const handleOrganizationNameChange = (value: string) => {
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Remove consecutive hyphens
      .trim()
    
    setFormData({
      ...formData,
      organizationName: value,
      organizationSlug: slug
    })

    // Check availability if slug is valid
    if (slug && slug.length >= 3) {
      checkSlugAvailability(slug)
    } else {
      setSlugStatus({ checking: false, available: null, message: '' })
    }
  }

  // Check slug availability
  const checkSlugAvailability = async (slug: string) => {
    setSlugStatus({ checking: true, available: null, message: 'جاري التحقق...' })
    
    try {
      const response = await fetch(`/api/auth/check-subdomain?slug=${encodeURIComponent(slug)}`)
      const data = await response.json()

      if (data.available) {
        setSlugStatus({
          checking: false,
          available: true,
          message: `✓ الدومين الفرعي متاح: ${data.subdomain}`
        })
      } else {
        setSlugStatus({
          checking: false,
          available: false,
          message: `✗ ${data.reason || 'الدومين الفرعي غير متاح'}`
        })
      }
    } catch (error) {
      console.error('Error checking slug:', error)
      setSlugStatus({
        checking: false,
        available: null,
        message: 'خطأ في التحقق من الدومين'
      })
    }
  }

  // Handle manual slug change
  const handleSlugChange = (value: string) => {
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '') // Remove invalid chars
      .replace(/-+/g, '-') // Remove consecutive hyphens
      .trim()
    
    setFormData({
      ...formData,
      organizationSlug: slug
    })

    if (slug && slug.length >= 3) {
      checkSlugAvailability(slug)
    } else {
      setSlugStatus({ checking: false, available: null, message: '' })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('كلمات المرور غير متطابقة')
      setLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setErrorMessage('كلمة المرور يجب أن تكون 8 أحرف على الأقل')
      setLoading(false)
      return
    }

    if (slugStatus.available === false) {
      setErrorMessage('معرّف المؤسسة غير متاح. يرجى اختيار معرّف آخر')
      setLoading(false)
      return
    }

    try {
      // Send OTP instead of registering directly
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          organizationName: formData.organizationName,
          organizationSlug: formData.organizationSlug
        })
      })

      if (response.ok) {
        const data = await response.json()
        console.log('✅ OTP sent successfully:', data)
        
        // Store registration data in sessionStorage
        sessionStorage.setItem('pendingRegistration', JSON.stringify({
          email: formData.email,
          name: formData.name,
          organizationName: formData.organizationName,
          organizationSlug: formData.organizationSlug
        }))
        
        // Redirect to OTP verification page
        router.push(`/register/verify-otp?email=${encodeURIComponent(formData.email)}`)
      } else {
        const error = await response.json()
        setErrorMessage(error.error || 'حدث خطأ في إرسال كود التحقق')
      }
    } catch (error) {
      console.error('Send OTP error:', error)
      setErrorMessage('حدث خطأ في إرسال كود التحقق')
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = 
    formData.name && 
    formData.email && 
    formData.password && 
    formData.confirmPassword && 
    formData.organizationName && 
    formData.organizationSlug &&
    formData.password === formData.confirmPassword &&
    formData.password.length >= 8

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-4 pt-20 md:p-6 md:pt-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient orbs */}
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-20 left-20 w-96 h-96 bg-[#155DFC]/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            x: [0, -150, 0],
            y: [0, 100, 0],
            scale: [1.2, 1, 1.2]
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-30"></div>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
        
        {/* Left Side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block"
        >
          <div className="space-y-8">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-4 rtl:space-x-reverse"
            >
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-[#155DFC] to-[#1248C9] rounded-2xl flex items-center justify-center shadow-2xl">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#155DFC] to-[#1248C9] rounded-2xl blur-xl opacity-50 scale-110" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#155DFC] to-[#1248C9] bg-clip-text text-transparent">
                  HackPro
                </h1>
                <p className={cn("text-slate-600 dark:text-slate-400", isRTL && "text-arabic")}>
                  {isRTL ? 'منصة إدارة الهاكاثونات الاحترافية' : 'Professional Hackathon Management Platform'}
                </p>
              </div>
            </motion.div>

            {/* Main heading */}
            <div className="space-y-4">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={cn("text-4xl font-bold text-slate-900 dark:text-white", isRTL && "text-arabic")}
              >
                {isRTL ? 'ابدأ رحلتك الرقمية' : 'Start Your Digital Journey'}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={cn("text-xl text-slate-600 dark:text-slate-400", isRTL && "text-arabic")}
              >
                {isRTL ? 'أنشئ مؤسستك وابدأ بإدارة هاكاثوناتك بكفاءة عالية' : 'Create your organization and start managing hackathons efficiently'}
              </motion.p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              {[
                { 
                  icon: Shield, 
                  text: isRTL ? 'إدارة متعددة المستأجرين' : 'Multi-tenant Management', 
                  color: 'from-green-500 to-emerald-500' 
                },
                { 
                  icon: Zap, 
                  text: isRTL ? 'لوحة تحكم متقدمة' : 'Advanced Dashboard', 
                  color: 'from-blue-500 to-cyan-500' 
                },
                { 
                  icon: Lock, 
                  text: isRTL ? 'عزل كامل للبيانات' : 'Complete Data Isolation', 
                  color: 'from-purple-500 to-pink-500' 
                },
                { 
                  icon: Sparkles, 
                  text: isRTL ? 'تقارير تفصيلية' : 'Detailed Reports', 
                  color: 'from-orange-500 to-red-500' 
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ x: 5 }}
                  className="flex items-center space-x-4 rtl:space-x-reverse group"
                >
                  <div className={`w-10 h-10 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </div>

            {/* Decorative elements */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute -top-10 -right-10 w-20 h-20 border-2 border-dashed border-[#155DFC]/30 rounded-full"
            />
          </div>
        </motion.div>

        {/* Right Side - Registration Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          {/* Glow effect behind card */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#155DFC]/20 to-purple-500/20 rounded-3xl blur-3xl scale-105" />
          
          <Card className="relative shadow-2xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
            <CardContent className="p-6 md:p-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-8"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#155DFC] to-[#1248C9] rounded-2xl mb-4 shadow-lg">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#155DFC] to-[#1248C9] bg-clip-text text-transparent mb-2 lg:hidden">
                  HackPro
                </h1>
                <h2 className={cn("text-3xl font-bold text-slate-900 dark:text-white mb-2", isRTL && "text-arabic")}>
                  {isRTL ? 'إنشاء حساب جديد' : 'Create New Account'}
                </h2>
                <p className={cn("text-slate-600 dark:text-slate-400", isRTL && "text-arabic")}>
                  {isRTL ? 'سجّل مؤسستك وابدأ باستخدام المنصة' : 'Register your organization and start using the platform'}
                </p>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Label htmlFor="name" className={cn("text-slate-700 dark:text-slate-300 font-medium", isRTL && "text-arabic")}>
                    {isRTL ? 'الاسم الكامل *' : 'Full Name *'}
                  </Label>
                  <div className="relative mt-2">
                    <User className={cn("absolute top-3 h-5 w-5 text-slate-400 dark:text-slate-500", isRTL ? "right-3" : "left-3")} />
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder={isRTL ? "أدخل اسمك الكامل" : "Enter your full name"}
                      className={cn("h-12 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#155DFC] focus:ring-[#155DFC] transition-all", isRTL ? "pr-11" : "pl-11")}
                      required
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Label htmlFor="email" className={cn("text-slate-700 dark:text-slate-300 font-medium", isRTL && "text-arabic")}>
                    {isRTL ? 'البريد الإلكتروني *' : 'Email Address *'}
                  </Label>
                  <div className="relative mt-2">
                    <Mail className={cn("absolute top-3 h-5 w-5 text-slate-400 dark:text-slate-500", isRTL ? "right-3" : "left-3")} />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder={isRTL ? "admin@example.com" : "admin@example.com"}
                      className={cn("h-12 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#155DFC] focus:ring-[#155DFC] transition-all", isRTL ? "pr-11" : "pl-11")}
                      required
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div>
                    <Label htmlFor="password" className={cn("text-slate-700 dark:text-slate-300 font-medium", isRTL && "text-arabic")}>
                      {isRTL ? 'كلمة المرور *' : 'Password *'}
                    </Label>
                    <div className="relative mt-2">
                      <Lock className="absolute right-3 top-3 h-5 w-5 text-slate-400 dark:text-slate-500" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        placeholder="********"
                        className="pr-24 h-12 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#155DFC] focus:ring-[#155DFC] transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword" className={cn("text-slate-700 dark:text-slate-300 font-medium", isRTL && "text-arabic")}>
                      {isRTL ? 'تأكيد كلمة المرور *' : 'Confirm Password *'}
                    </Label>
                    <div className="relative mt-2">
                      <Lock className="absolute right-3 top-3 h-5 w-5 text-slate-400 dark:text-slate-500" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        placeholder="********"
                        className="pr-24 h-12 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#155DFC] focus:ring-[#155DFC] transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        aria-label={showConfirmPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* Organization Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="pt-6 border-t border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
                    <Building2 className="w-5 h-5 text-[#155DFC]" />
                    <h3 className={cn("text-lg font-semibold text-slate-900 dark:text-white", isRTL && "text-arabic")}>
                      {isRTL ? 'معلومات المؤسسة' : 'Organization Information'}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="organizationName" className={cn("text-slate-700 dark:text-slate-300 font-medium", isRTL && "text-arabic")}>
                        {isRTL ? 'اسم المؤسسة *' : 'Organization Name *'}
                      </Label>
                      <div className="relative mt-2">
                        <Building2 className="absolute right-3 top-3 h-5 w-5 text-slate-400 dark:text-slate-500" />
                        <Input
                          id="organizationName"
                          type="text"
                          value={formData.organizationName}
                          onChange={(e) => handleOrganizationNameChange(e.target.value)}
                          placeholder="مثال: وزارة الاتصالات"
                          className="pr-11 h-12 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#155DFC] focus:ring-[#155DFC] transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="organizationSlug" className={cn("text-slate-700 dark:text-slate-300 font-medium", isRTL && "text-arabic")}>
                        {isRTL ? 'معرّف المؤسسة (URL) *' : 'Organization Identifier (URL) *'}
                      </Label>
                      <div className="relative mt-2">
                        <Globe className="absolute right-3 top-3 h-5 w-5 text-slate-400 dark:text-slate-500" />
                        <Input
                          id="organizationSlug"
                          type="text"
                          value={formData.organizationSlug}
                          onChange={(e) => handleSlugChange(e.target.value)}
                          placeholder="ministry-of-communications"
                          className={cn(
                            "pr-11 h-12 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#155DFC] focus:ring-[#155DFC] transition-all",
                            slugStatus.available === false && "border-red-500 focus:border-red-500 focus:ring-red-500",
                            slugStatus.available === true && "border-green-500 focus:border-green-500 focus:ring-green-500"
                          )}
                          required
                        />
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        سيُستخدم في رابط مؤسستك: {formData.organizationSlug || 'your-org'}.hackpro.com
                      </p>
                      
                      {/* Slug Status */}
                      {formData.organizationSlug && formData.organizationSlug.length >= 3 && (
                        <div className={cn(
                          "mt-2 p-3 rounded-lg border",
                          slugStatus.checking && "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700",
                          slugStatus.available === true && "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
                          slugStatus.available === false && "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
                          slugStatus.available === null && !slugStatus.checking && "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                        )}>
                          {slugStatus.checking ? (
                            <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                              <Loader variant="spinner" size="xs" variantColor="gray" />
                              {slugStatus.message}
                            </div>
                          ) : (
                            <p className={cn(
                              "text-sm font-medium",
                              slugStatus.available === true && "text-green-900 dark:text-green-100",
                              slugStatus.available === false && "text-red-900 dark:text-red-100",
                              slugStatus.available === null && "text-blue-900 dark:text-blue-100"
                            )}>
                              {slugStatus.message || `🌐 رابط مؤسستك: ${formData.organizationSlug}.hackpro.com`}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Success Message */}
                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start space-x-3 rtl:space-x-reverse"
                  >
                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{successMessage}</span>
                  </motion.div>
                )}

                {/* Error Message */}
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
                  >
                    {errorMessage}
                  </motion.div>
                )}

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Button
                    type="submit"
                    disabled={!isFormValid || loading}
                    className="w-full h-12 bg-gradient-to-r from-[#155DFC] to-[#1248C9] hover:from-[#1248C9] hover:to-[#0F3AA5] text-white font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all relative overflow-hidden group"
                  >
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    
                    {loading ? (
                      <span className="flex items-center justify-center space-x-2 rtl:space-x-reverse relative z-10">
                        <Loader variant="spinner" size="sm" variantColor="white" />
                        <span>جاري التسجيل...</span>
                      </span>
                    ) : (
                      <span className="flex items-center justify-center space-x-2 rtl:space-x-reverse relative z-10">
                        <span>{isRTL ? 'إنشاء الحساب' : 'Create Account'}</span>
                        <ArrowRight className="w-5 h-5" />
                      </span>
                    )}
                  </Button>
                </motion.div>

                {/* Login Link */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-center pt-4"
                >
                  <p className={cn("text-slate-600 dark:text-slate-400", isRTL && "text-arabic")}>
                    {isRTL ? 'لديك حساب بالفعل؟' : 'Already have an account?'}{' '}
                    <Link href="/login" className="text-[#155DFC] hover:text-[#1248C9] font-semibold transition-colors">
                      {isRTL ? 'تسجيل الدخول' : 'Sign In'}
                    </Link>
                  </p>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
