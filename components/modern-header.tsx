'use client'

import * as React from 'react'
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/auth-context'
import { useTheme } from '@/contexts/theme-context'
import { useLanguage } from '@/contexts/language-context'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  Rocket,
  ArrowLeft,
  ChevronDown,
  Menu,
  X,
  LayoutDashboard,
  Settings,
  User,
  Users,
  LogOut,
  Shield,
  Zap,
  BarChart3,
  FileText,
  Home,
  Sun,
  Moon,
  Globe,
  CreditCard,
  HelpCircle,
  Code,
  Info,
  Mail,
  Sparkles
} from 'lucide-react'
import { NotificationBell } from '@/components/notifications'
import { cn } from '@/lib/utils'

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { title: string; icon?: any }
>(({ className, title, children, icon: Icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground group",
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-2 text-sm font-medium leading-none group-hover:text-[#155DFC] transition-colors">
             {Icon && <Icon className="h-4 w-4 text-muted-foreground group-hover:text-[#155DFC]" />}
             {title}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

export function ModernHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { language, toggleLanguage, t } = useLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isRTL = language === 'ar'

  const handleDashboardClick = () => {
    if (!user) {
      router.push('/login')
      return
    }

    const dashboardRoutes: Record<string, string> = {
      master: '/master',
      admin: '/admin/dashboard',
      judge: '/judge/dashboard',
      supervisor: '/supervisor/dashboard',
      expert: '/expert/dashboard',
      participant: '/participant/dashboard'
    }

    router.push(dashboardRoutes[user.role] || '/login')
  }

  const getRoleName = (role: string) => {
    const roleNames: Record<string, string> = {
      master: 'مدير المنصة',
      admin: 'مدير النظام',
      judge: 'محكّم',
      supervisor: 'مشرف',
      expert: 'خبير',
      participant: 'مشارك'
    }
    return roleNames[role] || role
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] w-full border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-950/60 transition-all shadow-sm">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => router.push('/')}>
            <div className="relative">
              <div className="absolute inset-0 bg-[#155DFC] blur-lg opacity-20 group-hover:opacity-40 transition-opacity rounded-xl" />
              <div className="w-10 h-10 bg-gradient-to-br from-[#155DFC] to-[#1248C9] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300 relative z-10">
                <Rocket className="h-5 w-5 text-white" />
              </div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#155DFC] to-[#1248C9] bg-clip-text text-transparent hidden sm:inline font-display">
              HackPro
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center flex-1 px-8">
            <NavigationMenu dir={isRTL ? "rtl" : "ltr"}>
              <NavigationMenuList className="space-x-2 rtl:space-x-reverse">
                <NavigationMenuItem>
                  <NavigationMenuLink 
                    className={cn(navigationMenuTriggerStyle(), "cursor-pointer bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-base")}
                    onClick={() => router.push('/')}
                  >
                    {t('nav.home')}
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-base">{t('nav.features')}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-[#155DFC]/10 to-[#155DFC]/30 p-6 no-underline outline-none focus:shadow-md relative overflow-hidden group"
                            href="/"
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-[#155DFC] to-[#1248C9] opacity-0 group-hover:opacity-10 transition-opacity" />
                            <Rocket className="h-6 w-6 text-[#155DFC]" />
                            <div className="mb-2 mt-4 text-lg font-medium text-[#155DFC]">
                              HackPro Platform
                            </div>
                            <p className="text-sm leading-tight text-slate-600 dark:text-slate-400">
                              {isRTL 
                                ? 'المنصة المتكاملة لإدارة الهاكاثونات والمسابقات التقنية باحترافية.' 
                                : 'The complete platform for managing hackathons and tech competitions professionally.'}
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <ListItem href="/features" title={isRTL ? "المميزات" : "Features"} icon={Sparkles}>
                        {isRTL ? "اكتشف جميع مميزات المنصة" : "Explore all platform features"}
                      </ListItem>
                      <ListItem href="/pricing" title={isRTL ? "الأسعار" : "Pricing"} icon={CreditCard}>
                        {isRTL ? "خطط مرنة تناسب الجميع" : "Flexible plans for everyone"}
                      </ListItem>
                      <ListItem href="/security" title={isRTL ? "الأمان" : "Security"} icon={Shield}>
                        {isRTL ? "حماية بياناتك هي أولويتنا" : "Your data security is our priority"}
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-base">{isRTL ? "المصادر" : "Resources"}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                      <ListItem href="/blog" title={t('nav.blog')} icon={FileText}>
                        {isRTL ? "أحدث المقالات والأخبار" : "Latest articles and news"}
                      </ListItem>
                      <ListItem href="/help" title={isRTL ? "مركز المساعدة" : "Help Center"} icon={HelpCircle}>
                        {isRTL ? "شروحات وأدلة الاستخدام" : "Guides and documentation"}
                      </ListItem>
                      <ListItem href="/api" title={isRTL ? "للمطورين" : "Developers"} icon={Code}>
                        {isRTL ? "وثائق API والربط البرمجي" : "API docs and integration"}
                      </ListItem>
                      <ListItem href="/community" title={isRTL ? "المجتمع" : "Community"} icon={Users}>
                        {isRTL ? "انضم لمجتمع HackPro" : "Join HackPro community"}
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-base">{isRTL ? "الشركة" : "Company"}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                      <ListItem href="/about" title={t('nav.about')} icon={Info}>
                        {isRTL ? "تعرف على فريقنا ورؤيتنا" : "Meet our team and vision"}
                      </ListItem>
                      <ListItem href="/contact" title={t('nav.contact')} icon={Mail}>
                        {isRTL ? "تواصل معنا لأي استفسار" : "Contact us for any inquiries"}
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right Side - Theme Toggle, Language Switcher & Auth Buttons / User Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              className="hidden sm:flex text-slate-600 dark:text-slate-400 hover:text-[#155DFC] dark:hover:text-[#155DFC] hover:bg-slate-100 dark:hover:bg-slate-800"
              title={t('nav.language.switch')}
            >
              <Globe className="h-5 w-5" />
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-slate-600 dark:text-slate-400 hover:text-[#155DFC] dark:hover:text-[#155DFC] hover:bg-slate-100 dark:hover:bg-slate-800"
              title={theme === 'dark' ? t('nav.theme.light') : t('nav.theme.dark')}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

            {/* Notifications Bell - Only for logged in users */}
            {user && <NotificationBell />}

            {loading ? (
              <div className="w-9 h-9 border-2 border-slate-200 dark:border-slate-800 border-t-[#155DFC] dark:border-t-[#155DFC] rounded-full animate-spin" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 px-2 py-1.5 h-auto rounded-full border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all"
                  >
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover shadow-md ring-2 ring-white dark:ring-slate-950"
                        onError={(e) => {
                          // Fallback to initial if image fails to load
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          const fallback = target.nextElementSibling as HTMLElement
                          if (fallback) fallback.style.display = 'flex'
                        }}
                      />
                    ) : null}
                    <div 
                      className={cn(
                        "w-8 h-8 bg-gradient-to-br from-[#155DFC] to-[#1248C9] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white dark:ring-slate-950",
                        user.profilePicture && "hidden"
                      )}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden sm:flex flex-col items-start text-start">
                      <span className="text-sm font-bold text-slate-900 dark:text-white leading-none mb-1">{user.name}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">{getRoleName(user.role)}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl p-2 mt-2">
                  <div className="px-4 py-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl mb-2">
                    <div className="flex items-center gap-3">
                      {user.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover shadow-inner ring-2 ring-white dark:ring-slate-800"
                          onError={(e) => {
                            // Fallback to initial if image fails to load
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                            const fallback = target.nextElementSibling as HTMLElement
                            if (fallback) fallback.style.display = 'flex'
                          }}
                        />
                      ) : null}
                      <div 
                        className={cn(
                          "w-12 h-12 bg-gradient-to-br from-[#155DFC] to-[#1248C9] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-inner",
                          user.profilePicture && "hidden"
                        )}
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                            {getRoleName(user.role)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <DropdownMenuItem
                    onClick={handleDashboardClick}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-slate-100 dark:focus:bg-slate-800 transition-colors text-slate-700 dark:text-slate-200"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-[#155DFC]">
                      <LayoutDashboard className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">{t('nav.dashboard')}</span>
                      <span className="text-xs text-slate-500">{isRTL ? 'الوصول للوحة التحكم' : 'Access your dashboard'}</span>
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => router.push('/profile')}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-slate-100 dark:focus:bg-slate-800 transition-colors text-slate-700 dark:text-slate-200"
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600">
                      <User className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">{t('nav.profile')}</span>
                      <span className="text-xs text-slate-500">{isRTL ? 'تعديل بياناتك الشخصية' : 'Edit your profile'}</span>
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-800 my-1" />

                  <DropdownMenuItem
                    onClick={logout}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/30 focus:bg-red-50 dark:focus:bg-red-950/30 text-red-600 dark:text-red-400 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                      <LogOut className="h-4 w-4" />
                    </div>
                    <span className="font-semibold text-sm">{t('nav.logout')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Button
                  variant="ghost"
                  onClick={() => router.push('/login')}
                  className="text-slate-700 dark:text-slate-300 hover:text-[#155DFC] dark:hover:text-[#155DFC] hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                >
                  {t('nav.login')}
                </Button>
                <Button
                  onClick={() => router.push('/register')}
                  className="bg-[#155DFC] hover:bg-[#1248C9] text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all rounded-full px-6"
                >
                  {t('nav.register')}
                  {isRTL ? <ArrowLeft className="mr-2 h-4 w-4 rotate-180" /> : <ArrowLeft className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden"
            >
              <div className="px-4 py-6 space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-slate-700 dark:text-slate-300 hover:text-[#155DFC] dark:hover:text-[#155DFC] hover:bg-slate-50 dark:hover:bg-slate-900"
                  onClick={() => {
                    router.push('/')
                    setMobileMenuOpen(false)
                  }}
                >
                  <Home className="h-4 w-4 mx-2" />
                  {t('nav.home')}
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-start text-slate-700 dark:text-slate-300 hover:text-[#155DFC] dark:hover:text-[#155DFC] hover:bg-slate-50 dark:hover:bg-slate-900"
                  onClick={() => {
                    router.push('/features')
                    setMobileMenuOpen(false)
                  }}
                >
                  <Sparkles className="h-4 w-4 mx-2" />
                  {t('nav.features')}
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-start text-slate-700 dark:text-slate-300 hover:text-[#155DFC] dark:hover:text-[#155DFC] hover:bg-slate-50 dark:hover:bg-slate-900"
                  onClick={() => {
                    router.push('/pricing')
                    setMobileMenuOpen(false)
                  }}
                >
                  <CreditCard className="h-4 w-4 mx-2" />
                  {t('nav.pricing')}
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-start text-slate-700 dark:text-slate-300 hover:text-[#155DFC] dark:hover:text-[#155DFC] hover:bg-slate-50 dark:hover:bg-slate-900"
                  onClick={() => {
                    router.push('/blog')
                    setMobileMenuOpen(false)
                  }}
                >
                  <FileText className="h-4 w-4 mx-2" />
                  {t('nav.blog')}
                </Button>

                <div className="border-t border-slate-200 dark:border-slate-800 my-2" />

                <div className="flex items-center justify-between px-2 py-2">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{isRTL ? 'اللغة' : 'Language'}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleLanguage}
                    className="h-8"
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    {language === 'ar' ? 'English' : 'العربية'}
                  </Button>
                </div>

                {user && (
                  <>
                    <div className="border-t border-slate-200 dark:border-slate-800 my-2" />
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-slate-700 dark:text-slate-300 hover:text-[#155DFC] dark:hover:text-[#155DFC] hover:bg-slate-50 dark:hover:bg-slate-900"
                      onClick={() => {
                        handleDashboardClick()
                        setMobileMenuOpen(false)
                      }}
                    >
                      <LayoutDashboard className="h-4 w-4 mx-2" />
                      {t('nav.dashboard')}
                    </Button>

                    <Button
                      variant="ghost"
                      className="w-full justify-start text-slate-700 dark:text-slate-300 hover:text-[#155DFC] dark:hover:text-[#155DFC] hover:bg-slate-50 dark:hover:bg-slate-900"
                      onClick={() => {
                        router.push('/profile')
                        setMobileMenuOpen(false)
                      }}
                    >
                      <User className="h-4 w-4 mx-2" />
                      {t('nav.profile')}
                    </Button>

                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/50"
                      onClick={() => {
                        logout()
                        setMobileMenuOpen(false)
                      }}
                    >
                      <LogOut className="h-4 w-4 mx-2" />
                      {t('nav.logout')}
                    </Button>
                  </>
                )}

                {!user && (
                  <div className="flex flex-col gap-2 mt-4 px-2">
                    <Button
                      variant="outline"
                      className="w-full justify-center border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                      onClick={() => {
                        router.push('/login')
                        setMobileMenuOpen(false)
                      }}
                    >
                      {t('nav.login')}
                    </Button>
                    <Button
                      className="w-full justify-center bg-[#155DFC] hover:bg-[#1248C9] text-white"
                      onClick={() => {
                        router.push('/register')
                        setMobileMenuOpen(false)
                      }}
                    >
                      {t('nav.register')}
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
