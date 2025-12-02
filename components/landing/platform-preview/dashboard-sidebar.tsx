'use client'

import { 
  Rocket, 
  Users, 
  Award, 
  Settings, 
  LayoutDashboard,
  LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarItem {
  id: string
  icon: React.ElementType
  label: string
  labelAr: string
  badge?: number
}

interface DashboardSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  isRTL?: boolean
}

const sidebarItems: SidebarItem[] = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', labelAr: 'لوحة التحكم' },
  { id: 'hackathons', icon: Rocket, label: 'Hackathons', labelAr: 'الهاكاثونات', badge: 3 },
  { id: 'participants', icon: Users, label: 'Participants', labelAr: 'المشاركين', badge: 150 },
  { id: 'judging', icon: Award, label: 'Judging', labelAr: 'التحكيم' },
  { id: 'settings', icon: Settings, label: 'Settings', labelAr: 'الإعدادات' },
]

export function DashboardSidebar({ activeTab, setActiveTab, isRTL = false }: DashboardSidebarProps) {
  return (
    <div className="w-16 lg:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col">
      {/* Logo */}
      <div className="p-4 lg:p-5 flex items-center gap-3">
        <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
          <Rocket className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-lg hidden lg:block text-slate-900 dark:text-white">HackPro</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 lg:px-3 py-4 space-y-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left",
                isActive 
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" 
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                isActive 
                  ? "bg-blue-600 text-white" 
                  : "bg-slate-100 dark:bg-slate-800"
              )}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="hidden lg:block text-sm font-medium flex-1">{isRTL ? item.labelAr : item.label}</span>
              {item.badge && (
                <span className={cn(
                  "hidden lg:block px-2 py-0.5 rounded-full text-xs font-bold",
                  isActive ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                )}>
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800">
        <div className={cn("flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors", isRTL && "flex-row-reverse")}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-xs">
            AU
          </div>
          <div className="hidden lg:block flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">Admin User</p>
            <p className="text-xs text-slate-500 truncate">admin@hackpro.sa</p>
          </div>
          <LogOut className="hidden lg:block w-4 h-4 text-slate-400 flex-shrink-0" />
        </div>
      </div>
    </div>
  )
}
