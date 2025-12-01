'use client'

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
  Rocket,
  ArrowLeft,
  ChevronDown,
  Menu,
  X,
  LayoutDashboard,
  Settings,
  User,
  LogOut,
  Award,
  Users,
  BarChart3,
  FileText,
  Home,
  Sun,
  Moon,
  Globe
} from 'lucide-react'

export function ModernHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { language, toggleLanguage, t } = useLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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

  const isActive = (path: string) => pathname === path

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60 transition-colors">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
              <Rocket className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hidden sm:inline">
              HackPro
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Button
              variant="ghost"
              className={`text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 ${
                isActive('/') ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400' : ''
              }`}
              onClick={() => router.push('/')}
            >
              <Home className="h-4 w-4 ml-2" />
              {t('nav.home')}
            </Button>

            <Button
              variant="ghost"
              className={`text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 ${
                isActive('/about') ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400' : ''
              }`}
              onClick={() => router.push('/about')}
            >
              {t('nav.about')}
            </Button>

            <Button
              variant="ghost"
              className={`text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 ${
                isActive('/features') ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400' : ''
              }`}
              onClick={() => router.push('/features')}
            >
              {t('nav.features')}
            </Button>

            <Button
              variant="ghost"
              className={`text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 ${
                isActive('/pricing') ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400' : ''
              }`}
              onClick={() => router.push('/pricing')}
            >
              {t('nav.pricing')}
            </Button>

            <Button
              variant="ghost"
              className={`text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 ${
                isActive('/blog') ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400' : ''
              }`}
              onClick={() => router.push('/blog')}
            >
              {t('nav.blog')}
            </Button>

            <Button
              variant="ghost"
              className={`text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 ${
                isActive('/contact') ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400' : ''
              }`}
              onClick={() => router.push('/contact')}
            >
              {t('nav.contact')}
            </Button>

          </div>

          {/* Right Side - Theme Toggle, Language Switcher & Auth Buttons / User Menu */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="w-9 h-9 p-0 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950"
              title={theme === 'dark' ? t('nav.theme.light') : t('nav.theme.dark')}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Language Switcher */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="hidden sm:flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950"
              title={t('nav.language.switch')}
            >
              <Globe className="h-4 w-4" />
              <span className="text-sm font-medium">{language === 'ar' ? 'EN' : 'عربي'}</span>
            </Button>

            {loading ? (
              <div className="w-8 h-8 border-2 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 hover:bg-indigo-50 dark:hover:bg-indigo-950 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden sm:flex flex-col items-start">
                      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{getRoleName(user.role)}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl p-2">
                  <DropdownMenuLabel className="px-3 py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{user.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                        <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-1">{getRoleName(user.role)}</p>
                      </div>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />

                  <DropdownMenuItem
                    onClick={handleDashboardClick}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors text-gray-900 dark:text-gray-100"
                  >
                    <LayoutDashboard className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="font-medium">{t('nav.dashboard')}</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => router.push('/profile')}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors text-gray-900 dark:text-gray-100"
                  >
                    <User className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="font-medium">{t('nav.profile')}</span>
                  </DropdownMenuItem>

                  {user.role === 'admin' && (
                    <DropdownMenuItem
                      onClick={() => router.push('/admin/dashboard')}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors text-gray-900 dark:text-gray-100"
                    >
                      <Settings className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      <span className="font-medium">{t('nav.settings')}</span>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />

                  <DropdownMenuItem
                    onClick={logout}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-red-50 dark:hover:bg-red-950 text-red-600 dark:text-red-400 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="font-medium">{t('nav.logout')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={() => router.push('/login')}
                  className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950"
                >
                  {t('nav.login')}
                </Button>
                <Button
                  onClick={() => router.push('/register')}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all"
                >
                  {t('nav.register')}
                  <ArrowLeft className="mr-2 h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950"
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
              className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              <div className="px-4 py-6 space-y-3">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950"
                  onClick={() => {
                    router.push('/')
                    setMobileMenuOpen(false)
                  }}
                >
                  <Home className="h-4 w-4 ml-2" />
                  {t('nav.home')}
                </Button>

                {user && (
                  <>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950"
                      onClick={() => {
                        handleDashboardClick()
                        setMobileMenuOpen(false)
                      }}
                    >
                      <LayoutDashboard className="h-4 w-4 ml-2" />
                      {t('nav.dashboard')}
                    </Button>


                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950"
                      onClick={() => {
                        router.push('/profile')
                        setMobileMenuOpen(false)
                      }}
                    >
                      <User className="h-4 w-4 ml-2" />
                      {t('nav.profile')}
                    </Button>

                    <div className="border-t border-gray-200 dark:border-gray-700 my-3" />

                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950"
                      onClick={() => {
                        logout()
                        setMobileMenuOpen(false)
                      }}
                    >
                      <LogOut className="h-4 w-4 ml-2" />
                      {t('nav.logout')}
                    </Button>
                  </>
                )}

                {!user && (
                  <>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950"
                      onClick={() => {
                        router.push('/login')
                        setMobileMenuOpen(false)
                      }}
                    >
                      {t('nav.login')}
                    </Button>
                    <Button
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                      onClick={() => {
                        router.push('/register')
                        setMobileMenuOpen(false)
                      }}
                    >
                      {t('nav.register')}
                      <ArrowLeft className="mr-2 h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
