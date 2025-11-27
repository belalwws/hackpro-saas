'use client'

import React from 'react'
import { Block } from '../BlockTypes'
import { cn } from '@/lib/utils'

interface StatsBlockPreviewProps {
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

export default function StatsBlockPreview({ block, colors, hackathonId, isRTL }: StatsBlockPreviewProps) {
  return (
    <section 
      className="py-20 px-4"
      style={{
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
      }}
    >
      <div className="max-w-6xl mx-auto">
        <h2 className={cn(
          "text-4xl font-bold text-center mb-12 text-white",
          isRTL && "text-arabic"
        )}>
          {block.data.title}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {(block.data.stats || []).map((stat: any, index: number) => (
            <div key={index} className="text-center text-white">
              <div className="text-5xl font-bold mb-2">{stat.number}</div>
              <div className={cn("text-lg opacity-90", isRTL && "text-arabic")}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

