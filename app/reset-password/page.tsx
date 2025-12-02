'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/contexts/language-context'

export default function ResetPasswordPage() {
	const { language } = useLanguage()
	const isRTL = language === 'ar'
	const router = useRouter()
	const searchParams = useSearchParams()
	const token = searchParams.get('token')

	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [error, setError] = useState('')
	const [success, setSuccess] = useState(false)
	const [isValidating, setIsValidating] = useState(true)
	const [isTokenValid, setIsTokenValid] = useState(false)

	// Validate token on mount
	useEffect(() => {
		const validateToken = async () => {
			if (!token) {
				setIsValidating(false)
				setIsTokenValid(false)
				setError(isRTL ? 'رابط إعادة التعيين غير صحيح' : 'Invalid reset link')
				return
			}

			try {
				const response = await fetch(`/api/auth/validate-reset-token?token=${token}`)
				const data = await response.json()

				if (!response.ok) {
					setError(data.error || (isRTL ? 'رابط إعادة التعيين غير صحيح أو منتهي الصلاحية' : 'Invalid or expired reset link'))
					setIsTokenValid(false)
				} else {
					setIsTokenValid(true)
				}
			} catch (err) {
				setError(isRTL ? 'حدث خطأ أثناء التحقق من الرابط' : 'An error occurred while validating the link')
				setIsTokenValid(false)
			} finally {
				setIsValidating(false)
			}
		}

		validateToken()
	}, [token, isRTL])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError('')

		// Validate passwords
		if (password.length < 6) {
			setError(isRTL ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters')
			return
		}

		if (password !== confirmPassword) {
			setError(isRTL ? 'كلمات المرور غير متطابقة' : 'Passwords do not match')
			return
		}

		setIsSubmitting(true)

		try {
			const response = await fetch('/api/auth/reset-password', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ token, password }),
			})

			const data = await response.json()

			if (!response.ok) {
				setError(data.error || (isRTL ? 'حدث خطأ أثناء إعادة تعيين كلمة المرور' : 'An error occurred while resetting password'))
				return
			}

			setSuccess(true)
			// Redirect to login after 3 seconds
			setTimeout(() => {
				router.push('/login')
			}, 3000)
		} catch (err) {
			setError(isRTL ? 'حدث خطأ أثناء إعادة تعيين كلمة المرور' : 'An error occurred while resetting password')
		} finally {
			setIsSubmitting(false)
		}
	}

	if (isValidating) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-6">
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					className="text-center"
				>
					<div className="relative mb-6">
						<motion.div
							className="w-16 h-16 border-4 border-[#155DFC]/20 dark:border-[#155DFC]/30 border-t-[#155DFC] rounded-full mx-auto"
							animate={{ rotate: 360 }}
							transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
						/>
						<div className="absolute inset-0 flex items-center justify-center">
							<Lock className="w-6 h-6 text-[#155DFC] animate-pulse" />
						</div>
					</div>
					<p className={cn("text-slate-600 dark:text-slate-400 font-medium", isRTL && "text-arabic")}>
						{isRTL ? 'جاري التحقق من الرابط...' : 'Validating link...'}
					</p>
					<div className="flex items-center justify-center gap-1.5 mt-4">
						{[0, 1, 2].map((i) => (
							<motion.div
								key={i}
								className="w-2 h-2 bg-[#155DFC] rounded-full"
								animate={{
									scale: [1, 1.3, 1],
									opacity: [0.4, 1, 0.4]
								}}
								transition={{
									duration: 1.2,
									repeat: Infinity,
									delay: i * 0.15,
									ease: 'easeInOut'
								}}
							/>
						))}
					</div>
				</motion.div>
			</div>
		)
	}

	if (!isTokenValid) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-6">
				<div className="w-full max-w-md">
					<Card className="shadow-2xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
						<CardContent className="p-8 text-center">
							<div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
								<Lock className="w-8 h-8 text-red-600 dark:text-red-400" />
							</div>
							<h3 className={cn("text-xl font-bold text-slate-900 dark:text-white mb-2", isRTL && "text-arabic")}>
								{isRTL ? 'رابط غير صحيح' : 'Invalid Link'}
							</h3>
							<p className={cn("text-slate-600 dark:text-slate-400 mb-6", isRTL && "text-arabic")}>
								{error || (isRTL ? 'رابط إعادة التعيين غير صحيح أو منتهي الصلاحية' : 'The reset link is invalid or has expired')}
							</p>
							<Link href="/forgot-password">
								<Button className="bg-gradient-to-r from-[#155DFC] to-[#1248C9] hover:from-[#1248C9] hover:to-[#0F3AA5]">
									{isRTL ? 'طلب رابط جديد' : 'Request New Link'}
								</Button>
							</Link>
						</CardContent>
					</Card>
				</div>
			</div>
		)
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
							<Lock className="w-8 h-8 text-white" />
						</motion.div>
						<div>
							<CardTitle className={cn("text-2xl font-bold text-slate-900 dark:text-white", isRTL && "text-arabic")}>
								{isRTL ? 'إعادة تعيين كلمة المرور' : 'Reset Password'}
							</CardTitle>
							<CardDescription className={cn("text-slate-600 dark:text-slate-400 mt-2", isRTL && "text-arabic")}>
								{isRTL 
									? 'أدخل كلمة المرور الجديدة'
									: 'Enter your new password'}
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
									{isRTL ? 'تم تغيير كلمة المرور' : 'Password Changed!'}
								</h3>
								<p className={cn("text-slate-600 dark:text-slate-400 mb-6", isRTL && "text-arabic")}>
									{isRTL 
										? 'تم تغيير كلمة المرور بنجاح. سيتم توجيهك إلى صفحة تسجيل الدخول...'
										: 'Your password has been changed successfully. Redirecting to login...'}
								</p>
							</motion.div>
						) : (
							<form onSubmit={handleSubmit} className="space-y-6">
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.3 }}
									className="space-y-2"
								>
									<Label htmlFor="password" className={cn("text-slate-700 dark:text-slate-300 font-medium", isRTL && "text-arabic")}>
										{isRTL ? 'كلمة المرور الجديدة' : 'New Password'}
									</Label>
									<div className="relative">
										<Lock className={cn("absolute top-3 h-5 w-5 text-slate-400 dark:text-slate-500", isRTL ? "right-3" : "left-3")} />
										<Input
											id="password"
											type={showPassword ? "text" : "password"}
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											disabled={isSubmitting}
											className={cn("h-12 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#155DFC] focus:ring-[#155DFC] transition-all", isRTL ? "pr-24" : "pl-11 pr-10")}
											placeholder={isRTL ? 'كلمة المرور الجديدة' : 'New password'}
											required
											minLength={6}
										/>
										<button
											type="button"
											onClick={() => setShowPassword(!showPassword)}
											disabled={isSubmitting}
											className={cn("absolute top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-50 transition-colors", isRTL ? "left-3" : "right-3")}
										>
											{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
										</button>
									</div>
								</motion.div>

								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.4 }}
									className="space-y-2"
								>
									<Label htmlFor="confirmPassword" className={cn("text-slate-700 dark:text-slate-300 font-medium", isRTL && "text-arabic")}>
										{isRTL ? 'تأكيد كلمة المرور' : 'Confirm Password'}
									</Label>
									<div className="relative">
										<Lock className={cn("absolute top-3 h-5 w-5 text-slate-400 dark:text-slate-500", isRTL ? "right-3" : "left-3")} />
										<Input
											id="confirmPassword"
											type={showConfirmPassword ? "text" : "password"}
											value={confirmPassword}
											onChange={(e) => setConfirmPassword(e.target.value)}
											disabled={isSubmitting}
											className={cn("h-12 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#155DFC] focus:ring-[#155DFC] transition-all", isRTL ? "pr-24" : "pl-11 pr-10")}
											placeholder={isRTL ? 'تأكيد كلمة المرور' : 'Confirm password'}
											required
											minLength={6}
										/>
										<button
											type="button"
											onClick={() => setShowConfirmPassword(!showConfirmPassword)}
											disabled={isSubmitting}
											className={cn("absolute top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-50 transition-colors", isRTL ? "left-3" : "right-3")}
										>
											{showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
										</button>
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
									transition={{ delay: 0.5 }}
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
												{isRTL ? 'جاري التحديث...' : 'Updating...'}
											</span>
										) : (
											<span className="flex items-center justify-center gap-2 relative z-10">
												<Lock className="w-5 h-5" />
												{isRTL ? 'تغيير كلمة المرور' : 'Reset Password'}
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

