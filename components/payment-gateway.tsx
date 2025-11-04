'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  CreditCard,
  Lock,
  Shield,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaymentGatewayProps {
  amount: number
  plan: string
  billingCycle: 'monthly' | 'yearly'
  onSuccess?: (paymentData: any) => void
  onError?: (error: string) => void
}

export function PaymentGateway({
  amount,
  plan,
  billingCycle,
  onSuccess,
  onError
}: PaymentGatewayProps) {
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card')
  
  // Card form state
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: ''
  })

  const [errors, setErrors] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: ''
  })

  // Format card number (add spaces every 4 digits)
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '')
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned
    return formatted.slice(0, 19) // 16 digits + 3 spaces
  }

  // Format expiry date (MM/YY)
  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4)
    }
    return cleaned
  }

  // Validate card number (Luhn algorithm)
  const validateCardNumber = (number: string): boolean => {
    const cleaned = number.replace(/\s/g, '')
    if (!/^\d{16}$/.test(cleaned)) return false

    let sum = 0
    let isEven = false

    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i])

      if (isEven) {
        digit *= 2
        if (digit > 9) digit -= 9
      }

      sum += digit
      isEven = !isEven
    }

    return sum % 10 === 0
  }

  // Validate expiry date
  const validateExpiry = (expiry: string): boolean => {
    const [month, year] = expiry.split('/').map(Number)
    if (!month || !year) return false

    const currentYear = new Date().getFullYear() % 100
    const currentMonth = new Date().getMonth() + 1

    if (month < 1 || month > 12) return false
    if (year < currentYear) return false
    if (year === currentYear && month < currentMonth) return false

    return true
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validation
    const newErrors = {
      number: '',
      name: '',
      expiry: '',
      cvc: ''
    }

    if (!validateCardNumber(cardData.number)) {
      newErrors.number = 'رقم البطاقة غير صالح'
    }

    if (cardData.name.length < 3) {
      newErrors.name = 'الاسم يجب أن يكون 3 أحرف على الأقل'
    }

    if (!validateExpiry(cardData.expiry)) {
      newErrors.expiry = 'تاريخ انتهاء الصلاحية غير صالح'
    }

    if (!/^\d{3,4}$/.test(cardData.cvc)) {
      newErrors.cvc = 'رمز CVV غير صالح'
    }

    setErrors(newErrors)

    if (Object.values(newErrors).some(error => error !== '')) {
      setLoading(false)
      onError?.('يرجى تصحيح الأخطاء في النموذج')
      return
    }

    try {
      // TODO: Integrate with Stripe API
      // For now, simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))

      const paymentData = {
        amount,
        plan,
        billingCycle,
        last4: cardData.number.slice(-4),
        timestamp: new Date().toISOString()
      }

      onSuccess?.(paymentData)
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'فشل في معالجة الدفع')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Payment Method Selection */}
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setPaymentMethod('card')}
          className={cn(
            "p-4 rounded-xl border-2 transition-all",
            paymentMethod === 'card'
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
              : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
          )}
        >
          <CreditCard className="w-8 h-8 mx-auto mb-2 text-blue-600" />
          <p className="font-semibold text-sm">بطاقة ائتمان</p>
        </button>

        <button
          type="button"
          onClick={() => setPaymentMethod('paypal')}
          className={cn(
            "p-4 rounded-xl border-2 transition-all relative",
            paymentMethod === 'paypal'
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
              : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
          )}
        >
          <Badge className="absolute -top-2 -right-2 bg-blue-600 text-xs">قريباً</Badge>
          <div className="w-8 h-8 mx-auto mb-2 text-[#00457C] font-bold text-lg">PP</div>
          <p className="font-semibold text-sm">PayPal</p>
        </button>
      </div>

      {/* Card Payment Form */}
      {paymentMethod === 'card' && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              معلومات البطاقة
            </CardTitle>
            <CardDescription>
              جميع المعاملات مشفرة وآمنة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Card Number */}
              <div className="space-y-2">
                <Label htmlFor="cardNumber">رقم البطاقة</Label>
                <div className="relative">
                  <Input
                    id="cardNumber"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardData.number}
                    onChange={(e) => setCardData({
                      ...cardData,
                      number: formatCardNumber(e.target.value)
                    })}
                    className={cn(
                      "text-lg tracking-wider",
                      errors.number && "border-red-500"
                    )}
                    disabled={loading}
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex gap-1">
                    <div className="w-8 h-6 bg-gradient-to-r from-blue-600 to-blue-400 rounded"></div>
                    <div className="w-8 h-6 bg-gradient-to-r from-orange-600 to-orange-400 rounded"></div>
                  </div>
                </div>
                {errors.number && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.number}
                  </p>
                )}
              </div>

              {/* Cardholder Name */}
              <div className="space-y-2">
                <Label htmlFor="cardName">اسم حامل البطاقة</Label>
                <Input
                  id="cardName"
                  type="text"
                  placeholder="الاسم كما هو مكتوب على البطاقة"
                  value={cardData.name}
                  onChange={(e) => setCardData({
                    ...cardData,
                    name: e.target.value
                  })}
                  className={errors.name && "border-red-500"}
                  disabled={loading}
                />
                {errors.name && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Expiry and CVC */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">تاريخ الانتهاء</Label>
                  <Input
                    id="expiry"
                    type="text"
                    placeholder="MM/YY"
                    value={cardData.expiry}
                    onChange={(e) => setCardData({
                      ...cardData,
                      expiry: formatExpiry(e.target.value)
                    })}
                    className={errors.expiry && "border-red-500"}
                    maxLength={5}
                    disabled={loading}
                  />
                  {errors.expiry && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.expiry}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cvc">CVV</Label>
                  <Input
                    id="cvc"
                    type="text"
                    placeholder="123"
                    value={cardData.cvc}
                    onChange={(e) => setCardData({
                      ...cardData,
                      cvc: e.target.value.replace(/\D/g, '').slice(0, 4)
                    })}
                    className={errors.cvc && "border-red-500"}
                    disabled={loading}
                  />
                  {errors.cvc && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.cvc}
                    </p>
                  )}
                </div>
              </div>

              {/* Security Badge */}
              <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                <Shield className="w-5 h-5 text-green-600" />
                <p className="text-sm text-green-800 dark:text-green-200">
                  محمي بتشفير SSL 256-bit
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full py-6 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                    جاري المعالجة...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5 ml-2" />
                    ادفع ${amount}
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-slate-600 dark:text-slate-400">
                بالضغط على "ادفع"، أنت توافق على{' '}
                <a href="/terms" className="text-blue-600 hover:underline">شروط الخدمة</a>
                {' '}و{' '}
                <a href="/privacy" className="text-blue-600 hover:underline">سياسة الخصوصية</a>
              </p>
            </form>
          </CardContent>
        </Card>
      )}

      {/* PayPal (Coming Soon) */}
      {paymentMethod === 'paypal' && (
        <Card className="border-2 border-dashed">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-950 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="text-[#00457C] font-bold text-2xl">PP</div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              الدفع عبر PayPal
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              هذه الميزة قيد التطوير وستكون متاحة قريباً
            </p>
          </CardContent>
        </Card>
      )}

      {/* Trust Badges */}
      <div className="flex items-center justify-center gap-6 pt-4">
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <span>دفع آمن</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <span>استرجاع خلال 30 يوم</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <span>بيانات مشفرة</span>
        </div>
      </div>
    </div>
  )
}


