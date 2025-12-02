'use client'

import { 
  Rocket, 
  Users, 
  Calendar,
  Zap,
  Trophy,
  Clock,
  CheckCircle2,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface ActiveHackathonCardProps {
  isRTL?: boolean
}

export function ActiveHackathonCard({ isRTL = false }: ActiveHackathonCardProps) {
  const phases = [
    { label: isRTL ? 'التسجيل' : 'Registration', status: 'done', date: 'Jan 15' },
    { label: isRTL ? 'الفرق' : 'Teams', status: 'done', date: 'Jan 20' },
    { label: isRTL ? 'التطوير' : 'Development', status: 'current', date: 'Now' },
    { label: isRTL ? 'التحكيم' : 'Judging', status: 'pending', date: 'Mar 17' },
  ]

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            {isRTL ? 'الهاكاثون النشط' : 'Active Hackathon'}
          </h3>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
            {isRTL ? 'إدارة' : 'Manage'}
            <ChevronRight className={cn("w-4 h-4", isRTL && "rotate-180")} />
          </button>
        </div>
      </div>

      {/* Main Card */}
      <div className="p-5">
        <div className="rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white">
          {/* Status Badge */}
          <div className="flex items-center justify-between mb-4">
            <Badge className="bg-green-500/20 text-green-300 border border-green-500/30 px-2.5 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1.5 inline-block animate-pulse" />
              {isRTL ? 'مرحلة التطوير' : 'Development Phase'}
            </Badge>
            
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <div className="flex -space-x-1.5">
                {['A', 'B', 'C'].map((letter, i) => (
                  <div
                    key={i}
                    className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border border-slate-700 flex items-center justify-center text-[9px] font-bold"
                  >
                    {letter}
                  </div>
                ))}
              </div>
              <span>+127 {isRTL ? 'متصل' : 'online'}</span>
            </div>
          </div>

          {/* Title & Info */}
          <h4 className="text-xl font-bold mb-3">AI Innovation Challenge 2025</h4>
          <div className="flex flex-wrap items-center gap-3 text-slate-300 text-sm mb-5">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-400" /> 
              15 Mar - 17 Mar
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-purple-400" /> 
              150 {isRTL ? 'مشارك' : 'Participants'}
            </span>
            <span className="flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-400" /> 
              $10,000
            </span>
          </div>

          {/* Progress Section */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">{isRTL ? 'التقدم' : 'Progress'}</span>
              <span className="font-mono font-bold">65%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000"
                style={{ width: '65%' }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {isRTL ? '48 ساعة متبقية' : '48h remaining'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Phases Timeline */}
      <div className="px-5 pb-5">
        <div className="grid grid-cols-4 gap-2">
          {phases.map((phase, i) => (
            <div 
              key={i}
              className={cn(
                "p-3 rounded-lg text-center transition-colors",
                phase.status === 'current' 
                  ? "bg-blue-50 dark:bg-blue-900/20" 
                  : "bg-slate-50 dark:bg-slate-800/50"
              )}
            >
              <div className={cn(
                "w-8 h-8 mx-auto mb-1.5 rounded-lg flex items-center justify-center",
                phase.status === 'done' && "bg-green-100 dark:bg-green-900/30",
                phase.status === 'current' && "bg-blue-100 dark:bg-blue-900/30",
                phase.status === 'pending' && "bg-slate-100 dark:bg-slate-700"
              )}>
                {phase.status === 'done' ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                ) : (
                  <span className={cn(
                    "text-xs font-bold",
                    phase.status === 'current' ? "text-blue-600" : "text-slate-400"
                  )}>{i + 1}</span>
                )}
              </div>
              <span className={cn(
                "block text-xs font-medium",
                phase.status === 'current' ? "text-blue-700 dark:text-blue-400" : "text-slate-600 dark:text-slate-400"
              )}>
                {phase.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
