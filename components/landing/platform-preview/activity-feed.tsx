'use client'

import { 
  Zap, 
  Clock,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ActivityFeedProps {
  isRTL?: boolean
}

const activities = [
  { user: 'Ahmed H.', action: 'joined', actionAr: 'انضم', target: 'AI Challenge', time: '2m', avatar: 'AH', color: 'blue' },
  { user: 'Sara A.', action: 'submitted', actionAr: 'قدمت', target: 'Smart City', time: '15m', avatar: 'SA', color: 'green' },
  { user: 'Team Alpha', action: 'completed', actionAr: 'أكملوا', target: 'MVP Demo', time: '1h', avatar: 'TA', color: 'purple' },
  { user: 'Mohamed O.', action: 'commented', actionAr: 'علق', target: 'Review', time: '2h', avatar: 'MO', color: 'amber' },
]

const colorMap: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  amber: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
}

export function ActivityFeed({ isRTL = false }: ActivityFeedProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white">
            {isRTL ? 'النشاطات' : 'Activity'}
          </h3>
        </div>
      </div>

      {/* Activity List */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {activities.map((activity, i) => (
          <div key={i} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold", colorMap[activity.color])}>
                {activity.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-900 dark:text-white truncate">
                  <span className="font-medium">{activity.user}</span>
                  <span className="text-slate-500 mx-1">{isRTL ? activity.actionAr : activity.action}</span>
                  <span className="text-blue-600 dark:text-blue-400 font-medium">{activity.target}</span>
                </p>
                <span className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                  <Clock className="w-3 h-3" /> {activity.time}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800">
        <button className="w-full flex items-center justify-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors">
          {isRTL ? 'عرض الكل' : 'View All'}
          <ChevronRight className={cn("w-4 h-4", isRTL && "rotate-180")} />
        </button>
      </div>
    </div>
  )
}
