'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, Loader2, CheckCircle2, RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/contexts/language-context'

export default function ForgotPasswordPage() {
	const { language } = useLanguage()
	const isRTL = language === 'ar'
	const router = useRouter()
	const [email, setEmail] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [error, setError] = useState('')
	const [success, setSuccess] = useState(false)
	const [secondsRemaining, setSecondsRemaining] = useState(0)
	const [canResend, setCanResend] = useState(true)

	// Countdown timer effect
	useEffect(() => {
		if (secondsRemaining > 0) {
			const timer = setTimeout(() => {
				setSecondsRemaining(secondsRemaining - 1)
			}, 1000)
			return () => clearTimeout(timer)
		} else if (secondsRemaining === 0 && !canResend) {
			setCanResend(true)
		}
	}, [secondsRemaining, canResend])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError('')
		setIsSubmitting(true)

		try {
			const response = await fetch('/api/auth/forgot-password', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email }),
			})

			const data = await response.json()

			if (!response.ok) {
				if (data.rateLimited && data.secondsRemaining) {
					setSecondsRemaining(data.secondsRemaining)
					setCanResend(false)
					setError(
						isRTL 
							? `يرجى الانتظار ${data.secondsRemaining} ثانية قبل إعادة المحاولة`
							: `Please wait ${data.secondsRemaining} seconds before trying again`
					)
				} else {
					setError(data.error || (isRTL ? 'حدث خطأ أثناء إرسال الرابط' : 'An error occurred while sending the link'))
				}
				return
			}

			setSuccess(true)
			setCanResend(false)
			setSecondsRemaining(60) // Start 60 second countdown
		} catch (err) {
			setError(isRTL ? 'حدث خطأ أثناء إرسال الرابط' : 'An error occurred while sending the link')
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleResend = async () => {
		if (!canResend || secondsRemaining > 0) return
		
		setError('')
		setIsSubmitting(true)

		try {
			const response = await fetch('/api/auth/forgot-password', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email }),
			})

			const data = await response.json()

			if (!response.ok) {
				if (data.rateLimited && data.secondsRemaining) {
					setSecondsRemaining(data.secondsRemaining)
					setCanResend(false)
					setError(
						isRTL 
							? `يرجى الانتظار ${data.secondsRemaining} ثانية قبل إعادة المحاولة`
							: `Please wait ${data.secondsRemaining} seconds before trying again`
					)
				} else {
					setError(data.error || (isRTL ? 'حدث خطأ أثناء إرسال الرابط' : 'An error occurred while sending the link'))
				}
				return
			}

			setSuccess(true)
			setCanResend(false)
			setSecondsRemaining(60) // Start 60 second countdown
		} catch (err) {
			setError(isRTL ? 'حدث خطأ أثناء إرسال الرابط' : 'An error occurred while sending the link')
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-6 pt-24 relative overflow-hidden">
			{/* Background Effects */}
			<div className="absolute inset-0 overflow-hidden">
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
					className="absolute bottom-20 right-20 w-96 h-96 bg-[#1248C9]/10 rounded-full blur-3xl"
				/>
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-30"></div>
			</div>

			<div className="w-full max-w-md relative z-10">
				{/* Back Button */}
				<Link
					href="/login"
					className={cn(
						"inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-[#155DFC] transition-colors mb-6",
						isRTL && "flex-row-reverse"
					)}
				>
					<ArrowLeft className={cn("w-5 h-5", isRTL && "rotate-180")} />
					<span>{isRTL ? 'العودة لتسجيل الدخول' : 'Back to Login'}</span>
				</Link>

				{/* Glow effect behind card */}
				<div className="absolute inset-0 bg-gradient-to-br from-[#155DFC]/20 to-[#1248C9]/20 rounded-3xl blur-3xl scale-105" />
				
				<Card className="relative shadow-2xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
					<CardHeader className="space-y-4 text-center pb-8">
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.2 }}
							className="mx-auto w-16 h-16 bg-gradient-to-br from-[#155DFC] to-[#1248C9] rounded-2xl flex items-center justify-center shadow-lg"
						>
							<Mail className="w-8 h-8 text-white" />
						</motion.div>
						<div>
							<CardTitle className={cn("text-2xl font-bold text-slate-900 dark:text-white", isRTL && "text-arabic")}>
								{isRTL ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
							</CardTitle>
							<CardDescription className={cn("text-slate-600 dark:text-slate-400 mt-2", isRTL && "text-arabic")}>
								{isRTL 
									? 'أدخل بريدك الإلكتروني وسنرسل لك رابط لإعادة تعيين كلمة المرور'
									: 'Enter your email and we\'ll send you a link to reset your password'}
							</CardDescription>
						</div>
					</CardHeader>

					<CardContent>
						{success ? (
							<motion.div
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								className="text-center py-8"
							>
								<div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
									<CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
								</div>
								<h3 className={cn("text-xl font-bold text-slate-900 dark:text-white mb-2", isRTL && "text-arabic")}>
									{isRTL ? 'تم إرسال الرابط' : 'Link Sent!'}
								</h3>
								<p className={cn("text-slate-600 dark:text-slate-400 mb-4", isRTL && "text-arabic")}>
									{isRTL 
										? `تم إرسال رابط إعادة تعيين كلمة المرور إلى ${email}. يرجى التحقق من بريدك الإلكتروني.`
										: `We've sent a password reset link to ${email}. Please check your email.`}
								</p>
								<div className={cn("bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-6", isRTL && "text-arabic")}>
									<p className="text-blue-700 dark:text-blue-400 text-sm text-center">
										{isRTL 
											? '💡 نصيحة: إذا لم تجد البريد، تحقق من مجلد الرسائل غير المرغوب فيها (Spam)'
											: '💡 Tip: If you don\'t see the email, check your spam folder'}
									</p>
								</div>
								
								{/* Resend Email Button */}
								<div className="space-y-4">
									{secondsRemaining > 0 ? (
										<p className={cn("text-sm text-slate-500 dark:text-slate-400", isRTL && "text-arabic")}>
											{isRTL 
												? `يمكنك إعادة الإرسال بعد ${secondsRemaining} ثانية`
												: `You can resend after ${secondsRemaining} seconds`}
										</p>
									) : (
										<Button
											onClick={handleResend}
											disabled={isSubmitting}
											variant="outline"
											className="w-full border-[#155DFC] text-[#155DFC] hover:bg-[#155DFC] hover:text-white transition-colors"
										>
											<RefreshCw className={cn("w-4 h-4 mr-2", isRTL && "ml-2 mr-0")} />
											{isRTL ? 'إعادة إرسال الرابط' : 'Resend Link'}
										</Button>
									)}
									
									<Link href="/login" className="w-full block">
										<Button
											className="w-full bg-gradient-to-r from-[#155DFC] to-[#1248C9] hover:from-[#1248C9] hover:to-[#0F3AA5]"
										>
											{isRTL ? 'العودة لتسجيل الدخول' : 'Back to Login'}
										</Button>
									</Link>
								</div>
							</motion.div>
						) : (
							<form onSubmit={handleSubmit} className="space-y-6">
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.3 }}
									className="space-y-2"
								>
									<Label htmlFor="email" className={cn("text-slate-700 dark:text-slate-300 font-medium", isRTL && "text-arabic")}>
										{isRTL ? 'البريد الإلكتروني' : 'Email Address'}
									</Label>
									<div className="relative">
										<Mail className={cn("absolute top-3 h-5 w-5 text-slate-400 dark:text-slate-500", isRTL ? "right-3" : "left-3")} />
										<Input
											id="email"
											type="email"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											disabled={isSubmitting}
											className={cn("h-12 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#155DFC] focus:ring-[#155DFC] transition-all", isRTL ? "pr-11" : "pl-11")}
											placeholder="example@email.com"
											required
										/>
									</div>
								</motion.div>

								{error && (
									<motion.div
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3"
									>
										<p className="text-red-700 dark:text-red-400 text-sm text-center">{error}</p>
									</motion.div>
								)}

								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.4 }}
								>
									<Button
										type="submit"
										disabled={isSubmitting}
										className="w-full bg-gradient-to-r from-[#155DFC] to-[#1248C9] hover:from-[#1248C9] hover:to-[#0F3AA5] h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all relative overflow-hidden group"
									>
										<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
										
										{isSubmitting ? (
											<span className="flex items-center justify-center gap-2 relative z-10">
												<motion.div
													className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
													animate={{ rotate: 360 }}
													transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
												/>
												{isRTL ? 'جاري الإرسال...' : 'Sending...'}
											</span>
										) : (
											<span className="flex items-center justify-center gap-2 relative z-10">
												<Mail className="w-5 h-5" />
												{isRTL ? 'إرسال رابط إعادة التعيين' : 'Send Reset Link'}
											</span>
										)}
									</Button>
								</motion.div>
							</form>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

