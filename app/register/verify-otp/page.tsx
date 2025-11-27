"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export default function VerifyOtpPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(0)
  const [registrationData, setRegistrationData] = useState<any>(null)

  useEffect(() => {
    // Get registration data from sessionStorage
    const stored = sessionStorage.getItem('pendingRegistration')
    if (stored) {
      setRegistrationData(JSON.parse(stored))
    } else if (!email) {
      // Redirect to register if no data
      router.push('/register')
    }

    // Start countdown (10 minutes)
    setCountdown(600)
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [email, router])

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return // Only allow single digit
    
    const newOtp = [...otp]
    newOtp[index] = value.replace(/[^0-9]/g, '')
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6)
    const newOtp = [...otp]
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pastedData[i] || ''
    }
    setOtp(newOtp)
    
    // Focus last input
    if (pastedData.length === 6) {
      document.getElementById('otp-5')?.focus()
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    const otpCode = otp.join('')
    
    if (otpCode.length !== 6) {
      setErrorMessage('يرجى إدخال كود التحقق المكون من 6 أرقام')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email || registrationData?.email,
          code: otpCode
        })
      })

      if (response.ok) {
        const data = await response.json()
        console.log('✅ OTP verified, account created:', data)
        
        // Clear session storage
        sessionStorage.removeItem('pendingRegistration')
        
        setSuccessMessage('تم التحقق من الكود وإنشاء الحساب بنجاح!')
        
        // Redirect to dashboard after 1 second
        setTimeout(() => {
          router.push('/admin/dashboard')
        }, 1000)
      } else {
        const error = await response.json()
        setErrorMessage(error.error || 'كود التحقق غير صحيح')
        // Clear OTP on error
        setOtp(['', '', '', '', '', ''])
        document.getElementById('otp-0')?.focus()
      }
    } catch (error) {
      console.error('Verify OTP error:', error)
      setErrorMessage('حدث خطأ في التحقق من الكود')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (countdown > 0) return
    
    setResending(true)
    setErrorMessage(null)
    
    try {
      const data = registrationData || { email }
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        setSuccessMessage('تم إرسال كود جديد إلى بريدك الإلكتروني')
        setCountdown(600) // Reset countdown
        setOtp(['', '', '', '', '', ''])
        document.getElementById('otp-0')?.focus()
      } else {
        const error = await response.json()
        setErrorMessage(error.error || 'فشل إرسال كود جديد')
      }
    } catch (error) {
      console.error('Resend OTP error:', error)
      setErrorMessage('حدث خطأ في إرسال كود جديد')
    } finally {
      setResending(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-0">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                التحقق من البريد الإلكتروني
              </h2>
              <p className="text-gray-600">
                تم إرسال كود التحقق إلى
              </p>
              <p className="text-violet-600 font-semibold mt-1">
                {email || registrationData?.email}
              </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-6">
              {/* OTP Input */}
              <div>
                <Label className="text-gray-700 text-center block mb-4">
                  أدخل كود التحقق المكون من 6 أرقام
                </Label>
                <div className="flex justify-center gap-3">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      className={cn(
                        "w-14 h-14 text-center text-2xl font-bold border-2",
                        digit ? "border-violet-500" : "border-gray-300",
                        "focus:border-violet-600 focus:ring-violet-600"
                      )}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
              </div>

              {/* Countdown Timer */}
              {countdown > 0 && (
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>يمكنك طلب كود جديد بعد: {formatTime(countdown)}</span>
                </div>
              )}

              {/* Resend Button */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={countdown > 0 || resending}
                  className={cn(
                    "text-sm text-violet-600 hover:text-violet-700 font-medium",
                    "disabled:text-gray-400 disabled:cursor-not-allowed",
                    "flex items-center gap-2 mx-auto"
                  )}
                >
                  {resending ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      إعادة إرسال الكود
                    </>
                  )}
                </button>
              </div>

              {/* Success Message */}
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start gap-3"
                >
                  <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>{successMessage}</span>
                </motion.div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3"
                >
                  <XCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}

              {/* Verify Button */}
              <Button
                type="submit"
                disabled={loading || otp.join('').length !== 6}
                className="w-full h-12 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    جاري التحقق...
                  </span>
                ) : (
                  'التحقق من الكود'
                )}
              </Button>

              {/* Back Link */}
              <div className="text-center pt-4">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  العودة إلى التسجيل
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

