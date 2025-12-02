"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { LogIn, Eye, EyeOff, Loader2, Mail, Lock, Rocket, Shield, Zap, Sparkles, ArrowRight } from "lucide-react"
import { Loader } from "@/components/ui/loader"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"

export default function LoginPage() {
	const { language } = useLanguage()
	const isRTL = language === 'ar'
	const [loginEmail, setLoginEmail] = useState("")
	const [loginPassword, setLoginPassword] = useState("")
	const [showPassword, setShowPassword] = useState(false)
	const [loginError, setLoginError] = useState("")
	const [isSubmitting, setIsSubmitting] = useState(false)
	const { login, user, loading } = useAuth()
	const router = useRouter()

	useEffect(() => {
		// Wait for auth to finish loading
		if (loading) {
			console.log('🔄 Login page: Auth still loading...')
			return
		}

		// If no user, clear redirect flag and stay on login page
		if (!user) {
			console.log('✅ Login page: No user, staying on login page')
			if (typeof window !== 'undefined') {
				sessionStorage.removeItem('login-redirected')
			}
			return
		}

		console.log('🔄 Login page: User detected, redirecting...', user.role)

		// Immediate redirect without session check
		const searchParams = new URLSearchParams(window.location.search)
		const redirectUrl = searchParams.get('redirect')

		if (redirectUrl) {
			console.log('🔀 Redirecting to:', redirectUrl)
			router.replace(redirectUrl)
		} else {
			// Default redirect based on role
			let targetUrl = '/hackathons'
			if (user.role === "master") targetUrl = "/master"
			else if (user.role === "admin") targetUrl = "/admin/dashboard"
			else if (user.role === "judge") targetUrl = "/judge"
			else if (user.role === "supervisor") targetUrl = "/supervisor/dashboard"
			else if (user.role === "participant") targetUrl = "/participant/dashboard"

			console.log('🔀 Redirecting to:', targetUrl)
			router.replace(targetUrl)
		}
	}, [user, loading, router])

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoginError("")
		setIsSubmitting(true)
		try {
			const success = await login(loginEmail, loginPassword)
			if (!success) {
				setLoginError(isRTL ? "بيانات الدخول غير صحيحة" : "Invalid credentials")
			} else {
				console.log('✅ Login successful, clearing redirect flag')
				// Clear the redirect flag to allow fresh redirect
				if (typeof window !== 'undefined') {
					sessionStorage.removeItem('login-redirected')
				}
			}
		} catch (err) {
			setLoginError(isRTL ? "حدث خطأ أثناء تسجيل الدخول" : "An error occurred during login")
		} finally {
			setIsSubmitting(false)
		}
	}

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

			<div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
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
									{isRTL ? 'منصة إدارة الهاكاثونات الاحترافية' : 'Professional Hackathon Management'}
								</p>
							</div>
						</motion.div>

						{/* Welcome message */}
						<div className="space-y-4">
							<motion.h2
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.3 }}
								className={cn("text-4xl font-bold text-slate-900 dark:text-white", isRTL && "text-arabic")}
							>
								{isRTL ? 'مرحباً بعودتك' : 'Welcome Back'}
							</motion.h2>
							<motion.p
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.4 }}
								className={cn("text-xl text-slate-600 dark:text-slate-400", isRTL && "text-arabic")}
							>
								{isRTL ? 'سجل دخولك للوصول إلى لوحة التحكم' : 'Sign in to access your dashboard'}
							</motion.p>
						</div>

						{/* Features */}
						<div className="space-y-4">
							{[
								{ 
									icon: Shield, 
									text: isRTL ? 'حماية متقدمة للبيانات' : 'Advanced Data Protection', 
									color: 'from-green-500 to-emerald-500' 
								},
								{ 
									icon: Zap, 
									text: isRTL ? 'وصول سريع وآمن' : 'Fast & Secure Access', 
									color: 'from-blue-500 to-cyan-500' 
								},
								{ 
									icon: Sparkles, 
									text: isRTL ? 'تجربة مستخدم متميزة' : 'Premium User Experience', 
									color: 'from-purple-500 to-pink-500' 
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
					</div>
				</motion.div>

				{/* Right Side - Login Form */}
				<motion.div
					initial={{ opacity: 0, x: 50 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.6 }}
					className="relative"
				>
					{/* Glow effect behind card */}
					<div className="absolute inset-0 bg-gradient-to-br from-[#155DFC]/20 to-purple-500/20 rounded-3xl blur-3xl scale-105" />
					
					<Card className="relative shadow-2xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
						<CardHeader className="space-y-4 text-center pb-6 md:pb-8">
							<motion.div
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.2 }}
								className="mx-auto w-16 h-16 bg-gradient-to-br from-[#155DFC] to-[#1248C9] rounded-2xl flex items-center justify-center shadow-lg"
							>
								<Rocket className="w-8 h-8 text-white" />
							</motion.div>
							<div>
								<h1 className="text-2xl font-bold bg-gradient-to-r from-[#155DFC] to-[#1248C9] bg-clip-text text-transparent mb-2 lg:hidden">
									HackPro
								</h1>
								<CardTitle className={cn("text-2xl font-bold text-slate-900 dark:text-white", isRTL && "text-arabic")}>
									{isRTL ? 'تسجيل الدخول' : 'Sign In'}
								</CardTitle>
								<CardDescription className={cn("text-slate-600 dark:text-slate-400 mt-2", isRTL && "text-arabic")}>
									{isRTL ? 'أدخل بياناتك للوصول إلى حسابك' : 'Enter your credentials to access your account'}
								</CardDescription>
							</div>
						</CardHeader>

						<CardContent>
							<form onSubmit={handleLogin} className="space-y-6">
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
											value={loginEmail}
											onChange={(e) => setLoginEmail(e.target.value)}
											disabled={isSubmitting}
											className={cn("h-12 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#155DFC] focus:ring-[#155DFC] transition-all", isRTL ? "pr-11" : "pl-11")}
											placeholder="example@email.com"
											required
										/>
									</div>
								</motion.div>

								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.4 }}
									className="space-y-2"
								>
									<Label htmlFor="password" className={cn("text-slate-700 dark:text-slate-300 font-medium", isRTL && "text-arabic")}>
										{isRTL ? 'كلمة المرور' : 'Password'}
									</Label>
									<div className="relative">
										<Lock className={cn("absolute top-3 h-5 w-5 text-slate-400 dark:text-slate-500", isRTL ? "right-3" : "left-3")} />
										<Input
											id="password"
											type={showPassword ? "text" : "password"}
											value={loginPassword}
											onChange={(e) => setLoginPassword(e.target.value)}
											disabled={isSubmitting}
											className={cn("h-12 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#155DFC] focus:ring-[#155DFC] transition-all", isRTL ? "pr-24" : "pl-11 pr-10")}
											placeholder="••••••••"
											required
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

								{loginError && (
									<motion.div
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										className="bg-red-50 border border-red-200 rounded-lg p-3"
									>
										<p className="text-red-700 text-sm text-center">{loginError}</p>
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
										{/* Shine effect */}
										<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
										
										{isSubmitting ? (
											<span className="flex items-center justify-center gap-2 relative z-10">
												<Loader variant="spinner" size="sm" variantColor="white" />
												{isRTL ? 'جاري تسجيل الدخول...' : 'Signing in...'}
											</span>
										) : (
											<span className="flex items-center justify-center gap-2 relative z-10">
												<LogIn className="w-5 h-5" />
												{isRTL ? 'تسجيل الدخول' : 'Sign In'}
											</span>
										)}
									</Button>
								</motion.div>

								{/* Forgot Password Link */}
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.55 }}
									className="text-center"
								>
									<Link 
										href="/forgot-password" 
										className="text-sm text-[#155DFC] hover:text-[#1248C9] font-medium transition-colors"
									>
										{isRTL ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
									</Link>
								</motion.div>

								{/* Register Link */}
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.6 }}
									className="text-center pt-2"
								>
									<p className={cn("text-slate-600 dark:text-slate-400", isRTL && "text-arabic")}>
										{isRTL ? 'ليس لديك حساب؟' : "Don't have an account?"}{' '}
										<Link href="/register" className="text-[#155DFC] hover:text-[#1248C9] font-semibold transition-colors">
											{isRTL ? 'إنشاء حساب جديد' : 'Create Account'}
										</Link>
									</p>
								</motion.div>
							</form>
						</CardContent>
					</Card>

					{/* Footer */}
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.7 }}
						className={cn("text-center text-sm text-slate-600 dark:text-slate-400 mt-6", isRTL && "text-arabic")}
					>
						{isRTL ? 'نظام إدارة الهاكاثونات' : 'Hackathon Management System'} &copy; 2024
					</motion.p>
				</motion.div>
			</div>
		</div>
	)
}