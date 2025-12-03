'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { useLanguage } from '@/contexts/language-context'
import {
  BarChart3,
  Trophy,
  Users,
  Gavel,
  FileText,
  Settings,
  Shield
} from 'lucide-react'

export function AdminSidebar() {
  const { user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const { language } = useLanguage()

  const handleNavigation = (path: string) => {
    if (!pathname?.startsWith(path)) {
      router.push(path)
    }
  }

  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-l border-gray-200 min-h-screen relative">
      <div className="p-4 space-y-2">
        <Button 
          variant="ghost" 
          onClick={() => handleNavigation('/admin/dashboard')}
          className={`w-full justify-start gap-2 ${
            pathname === '/admin/dashboard' 
              ? 'bg-[#155DFC]/10 text-[#155DFC] hover:bg-[#155DFC]/10 hover:text-[#155DFC]' 
              : ''
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
        </Button>
        <Button 
          variant="ghost" 
          onClick={() => handleNavigation('/admin/hackathons')}
          className={`w-full justify-start gap-2 ${
            pathname?.startsWith('/admin/hackathons') 
              ? 'bg-[#155DFC]/10 text-[#155DFC] hover:bg-[#155DFC]/10 hover:text-[#155DFC]' 
              : ''
          }`}
        >
          <Trophy className="h-4 w-4" />
          {language === 'ar' ? 'الهاكاثونات' : 'Hackathons'}
        </Button>
        <Button 
          variant="ghost" 
          onClick={() => handleNavigation('/admin/participants')}
          className={`w-full justify-start gap-2 ${
            pathname?.startsWith('/admin/participants') 
              ? 'bg-[#155DFC]/10 text-[#155DFC] hover:bg-[#155DFC]/10 hover:text-[#155DFC]' 
              : ''
          }`}
        >
          <Users className="h-4 w-4" />
          {language === 'ar' ? 'المشاركين' : 'Participants'}
        </Button>
        <Button 
          variant="ghost" 
          onClick={() => handleNavigation('/admin/judges')}
          className={`w-full justify-start gap-2 ${
            pathname?.startsWith('/admin/judges') 
              ? 'bg-[#155DFC]/10 text-[#155DFC] hover:bg-[#155DFC]/10 hover:text-[#155DFC]' 
              : ''
          }`}
        >
          <Gavel className="h-4 w-4" />
          {language === 'ar' ? 'الحكام' : 'Judges'}
        </Button>
        {(user?.role === 'admin' || user?.role === 'supervisor') && (
          <Button 
            variant="ghost" 
            onClick={() => handleNavigation('/admin/forms')}
            className={`w-full justify-start gap-2 ${
              pathname?.startsWith('/admin/forms') 
                ? 'bg-[#155DFC]/10 text-[#155DFC] hover:bg-[#155DFC]/10 hover:text-[#155DFC]' 
                : ''
            }`}
          >
            <FileText className="h-4 w-4" />
            {language === 'ar' ? 'النماذج' : 'Forms'}
          </Button>
        )}
        {user?.role === 'admin' && (
          <Button 
            variant="ghost" 
            onClick={() => handleNavigation('/results')}
            className={`w-full justify-start gap-2 ${
              pathname?.startsWith('/results') 
                ? 'bg-[#155DFC]/10 text-[#155DFC] hover:bg-[#155DFC]/10 hover:text-[#155DFC]' 
                : ''
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            {language === 'ar' ? 'النتائج' : 'Results'}
          </Button>
        )}
        {user?.role === 'master' && (
          <Button 
            variant="ghost" 
            onClick={() => handleNavigation('/admin/users')}
            className={`w-full justify-start gap-2 ${
              pathname?.startsWith('/admin/users') 
                ? 'bg-[#155DFC]/10 text-[#155DFC] hover:bg-[#155DFC]/10 hover:text-[#155DFC]' 
                : ''
            }`}
          >
            <Shield className="h-4 w-4" />
            {language === 'ar' ? 'المستخدمين' : 'Users'}
          </Button>
        )}
        <Button 
          variant="ghost" 
          onClick={() => handleNavigation('/admin/settings')}
          className={`w-full justify-start gap-2 ${
            pathname?.startsWith('/admin/settings') 
              ? 'bg-[#155DFC]/10 text-[#155DFC] hover:bg-[#155DFC]/10 hover:text-[#155DFC]' 
              : ''
          }`}
        >
          <Settings className="h-4 w-4" />
          {language === 'ar' ? 'الإعدادات' : 'Settings'}
        </Button>
      </div>
    </div>
  )
}

