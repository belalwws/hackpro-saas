'use client'

import { 
  Rocket, 
  Users, 
  Zap, 
  Star,
  TrendingUp
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsGridProps {
  isRTL?: boolean
}

export function StatsGrid({ isRTL = false }: StatsGridProps) {
  const stats = [
    { 
      label: isRTL ? 'هاكاثونات نشطة' : 'Active Hackathons',
      value: '3',
      trend: '+1',
      icon: Rocket,
      color: 'blue'
    },
    { 
      label: isRTL ? 'إجمالي المشاركين' : 'Total Participants',
      value: '1,250',
      trend: '+12%',
      icon: Users,
      color: 'purple'
    },
    { 
      label: isRTL ? 'المشاريع المقدمة' : 'Projects Submitted',
      value: '85',
      trend: '+24',
      icon: Zap,
      color: 'amber'
    },
    { 
      label: isRTL ? 'متوسط التقييم' : 'Avg. Rating',
      value: '4.8',
      trend: '+0.2',
      icon: Star,
      color: 'green'
    }
  ]

  const colorClasses: Record<string, { bg: string; text: string }> = {
    blue: { bg: "bg-blue-50 dark:bg-blue-900/20", text: "text-blue-600 dark:text-blue-400" },
    purple: { bg: "bg-purple-50 dark:bg-purple-900/20", text: "text-purple-600 dark:text-purple-400" },
    amber: { bg: "bg-amber-50 dark:bg-amber-900/20", text: "text-amber-600 dark:text-amber-400" },
    green: { bg: "bg-green-50 dark:bg-green-900/20", text: "text-green-600 dark:text-green-400" }
  }

  return (
    <div className={cn("grid grid-cols-2 lg:grid-cols-4 gap-4", isRTL && "rtl")}>
      {stats.map((stat, i) => {
        const Icon = stat.icon
        const colors = colorClasses[stat.color]
        return (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", colors.bg)}>
                <Icon className={cn("w-5 h-5", colors.text)} />
              </div>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                <TrendingUp className="w-3 h-3" />
                {stat.trend}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-0.5">{stat.value}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
          </div>
        )
      })}
    </div>
  )
}
