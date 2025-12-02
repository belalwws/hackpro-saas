'use client'

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/contexts/language-context'
import { motion } from 'framer-motion'

// Sub-components
import { BrowserChrome } from './browser-chrome'
import { DashboardSidebar } from './dashboard-sidebar'
import { StatsGrid } from './stats-grid'
import { ActiveHackathonCard } from './active-hackathon-card'
import { ActivityFeed } from './activity-feed'
import { UpcomingEvents } from './upcoming-events'
import { CreateModal } from './create-modal'

// Icons
import { 
  Search, Bell, Plus, Rocket, Users, Award, Settings, 
  CheckCircle2, Clock, Trophy, Star, TrendingUp, Calendar,
  FileText, Filter, MoreHorizontal, ChevronRight, Play
} from 'lucide-react'

// Tab configurations
const tabs = ['dashboard', 'hackathons', 'participants', 'judging', 'settings']

export function PlatformPreview() {
  const { language } = useLanguage()
  const isRTL = language === 'ar'
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showModal, setShowModal] = useState(false)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [showCursor, setShowCursor] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [notificationCount, setNotificationCount] = useState(3)
  const [showNotificationPopup, setShowNotificationPopup] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Auto-play through tabs with enhanced interactions
  useEffect(() => {
    if (!isAutoPlaying) return
    
    const sequence = async () => {
      setShowCursor(true)
      
      // Type in search box first
      setCursorPosition({ x: 350, y: 95 })
      await new Promise(r => setTimeout(r, 600))
      setIsClicking(true)
      await new Promise(r => setTimeout(r, 150))
      setIsClicking(false)
      
      const searchQuery = isRTL ? 'هاكاثون' : 'hackathon'
      for (let i = 0; i <= searchQuery.length; i++) {
        setSearchText(searchQuery.slice(0, i))
        await new Promise(r => setTimeout(r, 100))
      }
      await new Promise(r => setTimeout(r, 800))
      setSearchText('')
      
      // Click notification
      setCursorPosition({ x: 480, y: 95 })
      await new Promise(r => setTimeout(r, 500))
      setIsClicking(true)
      await new Promise(r => setTimeout(r, 150))
      setIsClicking(false)
      setShowNotificationPopup(true)
      await new Promise(r => setTimeout(r, 1500))
      setShowNotificationPopup(false)
      setNotificationCount(2)
      
      // Navigate through tabs
      for (let i = 0; i < tabs.length; i++) {
        setCursorPosition({ x: 80, y: 150 + (i * 48) })
        await new Promise(r => setTimeout(r, 500))
        
        // Click animation
        setIsClicking(true)
        await new Promise(r => setTimeout(r, 150))
        setIsClicking(false)
        setActiveTab(tabs[i])
        await new Promise(r => setTimeout(r, 2000))
      }
      
      // Move to create button
      setCursorPosition({ x: 550, y: 95 })
      await new Promise(r => setTimeout(r, 600))
      setIsClicking(true)
      await new Promise(r => setTimeout(r, 150))
      setIsClicking(false)
      setShowModal(true)
      await new Promise(r => setTimeout(r, 2500))
      setShowModal(false)
      await new Promise(r => setTimeout(r, 400))
      
      // Reset
      setActiveTab('dashboard')
      setNotificationCount(3)
    }
    
    sequence()
    const interval = setInterval(sequence, 22000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, isRTL])

  // Stop auto-play on user interaction
  const handleUserInteraction = () => {
    setIsAutoPlaying(false)
    setShowCursor(false)
  }

  // Get page title based on active tab
  const getPageTitle = () => {
    const titles: Record<string, { en: string; ar: string }> = {
      dashboard: { en: 'Dashboard', ar: 'لوحة التحكم' },
      hackathons: { en: 'Hackathons', ar: 'الهاكاثونات' },
      participants: { en: 'Participants', ar: 'المشاركين' },
      judging: { en: 'Judging', ar: 'التحكيم' },
      settings: { en: 'Settings', ar: 'الإعدادات' },
    }
    return isRTL ? titles[activeTab]?.ar : titles[activeTab]?.en
  }

  return (
    <div 
      ref={containerRef}
      className="relative max-w-7xl mx-auto"
      onMouseEnter={handleUserInteraction}
      onClick={handleUserInteraction}
    >
      {/* Animated Cursor */}
      {showCursor && (
        <motion.div 
          className="absolute z-50 pointer-events-none"
          animate={{ left: cursorPosition.x, top: cursorPosition.y + 40 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <motion.div 
            className="relative"
            animate={{ scale: isClicking ? 0.85 : 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="drop-shadow-xl">
              <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L6.35 2.86a.5.5 0 0 0-.85.35Z" fill="#3B82F6" stroke="#fff" strokeWidth="2"/>
            </svg>
            {isClicking && (
              <motion.div 
                className="absolute top-3 left-3 w-6 h-6 bg-blue-400 rounded-full"
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.4 }}
              />
            )}
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </motion.div>
        </motion.div>
      )}

      {/* Preview Container */}
      <div className="relative">
        {/* Main Dashboard Preview */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        {/* Browser Chrome */}
        <BrowserChrome isRTL={isRTL} />

        {/* App Layout */}
        <div className={cn(
          "flex h-[600px] lg:h-[700px] bg-slate-50 dark:bg-slate-950",
          isRTL ? "flex-row-reverse" : "flex-row"
        )}>
          {/* Sidebar */}
          <DashboardSidebar 
            activeTab={activeTab} 
            setActiveTab={(tab) => {
              handleUserInteraction()
              setActiveTab(tab)
            }} 
            isRTL={isRTL} 
          />

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-5 py-4 border-b border-slate-200 dark:border-slate-800">
              <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                    {getPageTitle()}
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {isRTL ? 'مرحباً بك!' : 'Welcome back!'}
                  </p>
                </div>
                
                <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                  <div className={cn(
                    "hidden md:flex items-center gap-2 px-3 py-2 rounded-lg transition-all min-w-[180px]",
                    searchText ? "bg-white dark:bg-slate-700 ring-2 ring-blue-500" : "bg-slate-100 dark:bg-slate-800"
                  )}>
                    <Search className="w-4 h-4 text-slate-400" />
                    <span className={cn("text-sm", searchText ? "text-slate-900 dark:text-white" : "text-slate-400")}>
                      {searchText || (isRTL ? 'بحث...' : 'Search...')}
                    </span>
                    {searchText && <span className="w-0.5 h-4 bg-blue-500 animate-pulse" />}
                  </div>
                  
                  <div className="relative">
                    <button className="relative p-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                      <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                      {notificationCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                          {notificationCount}
                        </span>
                      )}
                    </button>
                    
                    {/* Notification Popup */}
                    {showNotificationPopup && (
                      <div className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-30">
                        <div className="p-3 border-b border-slate-100 dark:border-slate-700">
                          <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
                            {isRTL ? 'الإشعارات' : 'Notifications'}
                          </h4>
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-slate-700">
                          <div className="p-3 bg-blue-50 dark:bg-blue-900/20">
                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                              {isRTL ? 'فريق جديد انضم!' : 'New team joined!'}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">{isRTL ? 'منذ دقيقتين' : '2 min ago'}</p>
                          </div>
                          <div className="p-3">
                            <p className="text-sm text-slate-700 dark:text-slate-300">
                              {isRTL ? 'تم رفع مشروع جديد' : 'New project submitted'}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">{isRTL ? 'منذ 5 دقائق' : '5 min ago'}</p>
                          </div>
                          <div className="p-3">
                            <p className="text-sm text-slate-700 dark:text-slate-300">
                              {isRTL ? 'تقييم جديد متاح' : 'New review available'}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">{isRTL ? 'منذ 10 دقائق' : '10 min ago'}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => {
                      handleUserInteraction()
                      setShowModal(true)
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">{isRTL ? 'إنشاء' : 'Create'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Dynamic Content Based on Active Tab */}
            <div className="p-5 space-y-5">
              <div key={activeTab} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                {activeTab === 'dashboard' && (
                  <>
                    <StatsGrid isRTL={isRTL} />
                    <div className={cn("grid grid-cols-1 lg:grid-cols-5 gap-5 mt-5", isRTL && "direction-rtl")}>
                      <div className="lg:col-span-3">
                        <ActiveHackathonCard isRTL={isRTL} />
                      </div>
                      <div className="lg:col-span-2 space-y-5">
                        <ActivityFeed isRTL={isRTL} />
                        <UpcomingEvents isRTL={isRTL} onCreateClick={() => setShowModal(true)} />
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'hackathons' && <HackathonsContent isRTL={isRTL} />}
                {activeTab === 'participants' && <ParticipantsContent isRTL={isRTL} />}
                {activeTab === 'judging' && <JudgingContent isRTL={isRTL} />}
                {activeTab === 'settings' && <SettingsContent isRTL={isRTL} />}
              </div>
            </div>
          </div>
        </div>

        <CreateModal isOpen={showModal} onClose={() => setShowModal(false)} isRTL={isRTL} />
        
        {/* Bottom Reflection Effect */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/50 dark:from-slate-900/50 to-transparent pointer-events-none" />
      </div>
      </div>
      
      {/* Auto-play indicator */}
      {isAutoPlaying && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full shadow-lg border border-slate-200/50 dark:border-slate-700/50"
        >
          <motion.div
            className="relative"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Play className="w-4 h-4 text-blue-600 fill-blue-600" />
          </motion.div>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {isRTL ? 'عرض تجريبي تلقائي' : 'Auto Demo Mode'}
          </span>
          <div className="flex gap-1">
            <motion.div
              className="w-1.5 h-1.5 bg-blue-500 rounded-full"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
            />
            <motion.div
              className="w-1.5 h-1.5 bg-blue-500 rounded-full"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div
              className="w-1.5 h-1.5 bg-blue-500 rounded-full"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
            />
          </div>
        </motion.div>
      )}
      
    </div>
  )
}

// Hackathons Tab Content
function HackathonsContent({ isRTL }: { isRTL: boolean }) {
  const hackathons = [
    { name: 'AI Innovation Challenge', status: 'active', participants: 150, date: 'Mar 15-17', progress: 65 },
    { name: 'Web3 Hackathon', status: 'upcoming', participants: 0, date: 'Apr 5-7', progress: 0 },
    { name: 'FinTech Sprint', status: 'completed', participants: 120, date: 'Feb 20-22', progress: 100 },
  ]
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg text-sm font-medium">
            {isRTL ? 'الكل' : 'All'}
          </button>
          <button className="px-3 py-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-sm">
            {isRTL ? 'نشط' : 'Active'}
          </button>
          <button className="px-3 py-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-sm">
            {isRTL ? 'مكتمل' : 'Completed'}
          </button>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-sm">
          <Filter className="w-4 h-4" />
          {isRTL ? 'فلترة' : 'Filter'}
        </button>
      </div>
      
      <div className="space-y-3">
        {hackathons.map((h, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  h.status === 'active' ? "bg-green-100 dark:bg-green-900/30" : 
                  h.status === 'upcoming' ? "bg-blue-100 dark:bg-blue-900/30" : "bg-slate-100 dark:bg-slate-800"
                )}>
                  <Rocket className={cn(
                    "w-5 h-5",
                    h.status === 'active' ? "text-green-600" : 
                    h.status === 'upcoming' ? "text-blue-600" : "text-slate-500"
                  )} />
                </div>
                <div>
                  <h3 className="font-medium text-slate-900 dark:text-white">{h.name}</h3>
                  <p className="text-xs text-slate-500">{h.date}</p>
                </div>
              </div>
              <span className={cn(
                "px-2.5 py-1 rounded-full text-xs font-medium",
                h.status === 'active' ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : 
                h.status === 'upcoming' ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : 
                "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              )}>
                {h.status === 'active' ? (isRTL ? 'نشط' : 'Active') : 
                 h.status === 'upcoming' ? (isRTL ? 'قادم' : 'Upcoming') : (isRTL ? 'مكتمل' : 'Completed')}
              </span>
            </div>
            {h.status !== 'upcoming' && (
              <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {h.participants}</span>
                <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${h.progress}%` }} />
                </div>
                <span className="text-xs">{h.progress}%</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Participants Tab Content
function ParticipantsContent({ isRTL }: { isRTL: boolean }) {
  const participants = [
    { name: 'Ahmed Hassan', email: 'ahmed@email.com', team: 'Alpha', status: 'active' },
    { name: 'Sara Ali', email: 'sara@email.com', team: 'Beta', status: 'active' },
    { name: 'Mohamed Omar', email: 'mohamed@email.com', team: 'Gamma', status: 'pending' },
    { name: 'Fatima Khaled', email: 'fatima@email.com', team: 'Delta', status: 'active' },
  ]
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {isRTL ? '150 مشارك مسجل' : '150 participants registered'}
        </p>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <Search className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-400">{isRTL ? 'بحث...' : 'Search...'}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-slate-600 dark:text-slate-400">{isRTL ? 'الاسم' : 'Name'}</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600 dark:text-slate-400">{isRTL ? 'الفريق' : 'Team'}</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600 dark:text-slate-400">{isRTL ? 'الحالة' : 'Status'}</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {participants.map((p, i) => (
              <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                      {p.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{p.name}</p>
                      <p className="text-xs text-slate-500">{p.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{p.team}</td>
                <td className="px-4 py-3">
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-medium",
                    p.status === 'active' ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : 
                    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  )}>
                    {p.status === 'active' ? (isRTL ? 'نشط' : 'Active') : (isRTL ? 'معلق' : 'Pending')}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
                    <MoreHorizontal className="w-4 h-4 text-slate-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Judging Tab Content
function JudgingContent({ isRTL }: { isRTL: boolean }) {
  const projects = [
    { name: 'EcoTrack', team: 'Alpha', score: 92, status: 'judged' },
    { name: 'Smart City', team: 'Beta', score: 88, status: 'judged' },
    { name: 'HealthAI', team: 'Gamma', score: null, status: 'pending' },
    { name: 'FinBot', team: 'Delta', score: null, status: 'pending' },
  ]
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-slate-600 dark:text-slate-400">{isRTL ? 'المشاريع' : 'Projects'}</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">24</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span className="text-sm text-slate-600 dark:text-slate-400">{isRTL ? 'تم التقييم' : 'Judged'}</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">18</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-amber-500" />
            <span className="text-sm text-slate-600 dark:text-slate-400">{isRTL ? 'معلق' : 'Pending'}</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">6</p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
        {projects.map((p, i) => (
          <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                <Trophy className={cn("w-5 h-5", p.score && p.score >= 90 ? "text-amber-500" : "text-slate-400")} />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">{p.name}</p>
                <p className="text-xs text-slate-500">{isRTL ? 'فريق' : 'Team'} {p.team}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {p.score ? (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-bold text-slate-900 dark:text-white">{p.score}</span>
                </div>
              ) : (
                <span className="text-sm text-slate-500">{isRTL ? 'في الانتظار' : 'Awaiting'}</span>
              )}
              <button className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                {p.score ? (isRTL ? 'عرض' : 'View') : (isRTL ? 'تقييم' : 'Judge')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Settings Tab Content  
function SettingsContent({ isRTL }: { isRTL: boolean }) {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
        <h3 className="font-medium text-slate-900 dark:text-white mb-4">{isRTL ? 'الملف الشخصي' : 'Profile'}</h3>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
            AU
          </div>
          <div>
            <p className="font-medium text-slate-900 dark:text-white">Admin User</p>
            <p className="text-sm text-slate-500">admin@hackpro.sa</p>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">{isRTL ? 'الاسم' : 'Name'}</label>
            <input className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm" defaultValue="Admin User" />
          </div>
          <div>
            <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">{isRTL ? 'البريد الإلكتروني' : 'Email'}</label>
            <input className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm" defaultValue="admin@hackpro.sa" />
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
        <h3 className="font-medium text-slate-900 dark:text-white mb-4">{isRTL ? 'التفضيلات' : 'Preferences'}</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">{isRTL ? 'الإشعارات' : 'Notifications'}</p>
              <p className="text-xs text-slate-500">{isRTL ? 'استلام تنبيهات البريد' : 'Receive email alerts'}</p>
            </div>
            <div className="w-10 h-6 bg-blue-600 rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">{isRTL ? 'اللغة' : 'Language'}</p>
              <p className="text-xs text-slate-500">{isRTL ? 'لغة الواجهة' : 'Interface language'}</p>
            </div>
            <select className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm">
              <option>English</option>
              <option>العربية</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlatformPreview
