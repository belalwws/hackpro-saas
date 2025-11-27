'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Block } from '../BlockTypes'
import { cn } from '@/lib/utils'

interface ScheduleBlockPreviewProps {
  block: Block
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
  hackathonId: string
  isRTL: boolean
}

export default function ScheduleBlockPreview({ block, colors, hackathonId, isRTL }: ScheduleBlockPreviewProps) {
  return (
    <section className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-4xl mx-auto">
        <h2 className={cn(
          "text-4xl font-bold text-center mb-12",
          isRTL && "text-arabic"
        )}>
          {block.data.title}
        </h2>
        <div className="space-y-4">
          {(block.data.events || []).map((event: any, index: number) => (
            <Card key={index} className="p-6">
              <div className="flex items-start gap-4">
                <div className="text-center min-w-[80px]">
                  <div className="text-2xl font-bold" style={{ color: colors.primary }}>
                    {new Date(event.date).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', { 
                      day: 'numeric', 
                      month: 'short' 
                    })}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{event.time}</div>
                </div>
                <div className="flex-1">
                  <h3 className={cn("text-xl font-semibold mb-2", isRTL && "text-arabic")}>
                    {event.title}
                  </h3>
                  <p className={cn("text-gray-600", isRTL && "text-arabic")}>
                    {event.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

