'use client'

import { 
  Calendar,
  Clock,
  MapPin,
  ArrowRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface UpcomingEventsProps {
  isRTL?: boolean
  onCreateClick: () => void
}

const events = [
  { title: 'Web3 Hackathon', titleAr: 'هاكاثون Web3', day: '5', month: 'Apr', location: 'Riyadh', locationAr: 'الرياض', color: 'blue' },
  { title: 'AI Workshop', titleAr: 'ورشة AI', day: '12', month: 'Apr', location: 'Online', locationAr: 'عن بعد', color: 'purple' },
  { title: 'Demo Day', titleAr: 'يوم العروض', day: '20', month: 'Apr', location: 'Jeddah', locationAr: 'جدة', color: 'green' },
]

const colorMap: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
}

export function UpcomingEvents({ isRTL = false, onCreateClick }: UpcomingEventsProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
            <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white">
            {isRTL ? 'القادمة' : 'Upcoming'}
          </h3>
        </div>
      </div>

      {/* Events List */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {events.map((event, i) => (
          <div key={i} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className={cn("w-12 h-12 rounded-lg flex flex-col items-center justify-center", colorMap[event.color])}>
                <span className="text-base font-bold leading-none">{event.day}</span>
                <span className="text-[10px] font-medium uppercase">{event.month}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-slate-900 dark:text-white truncate">
                  {isRTL ? event.titleAr : event.title}
                </h4>
                <span className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                  <MapPin className="w-3 h-3" /> {isRTL ? event.locationAr : event.location}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={onCreateClick}
          className="w-full p-3 rounded-lg bg-slate-900 dark:bg-blue-600 text-white text-sm font-medium hover:bg-slate-800 dark:hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          {isRTL ? 'أنشئ هاكاثون' : 'Create Hackathon'}
          <ArrowRight className={cn("w-4 h-4", isRTL && "rotate-180")} />
        </button>
      </div>
    </div>
  )
}
