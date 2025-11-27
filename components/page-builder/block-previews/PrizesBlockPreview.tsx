'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Award } from 'lucide-react'
import { Block } from '../BlockTypes'
import { cn } from '@/lib/utils'

interface PrizesBlockPreviewProps {
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

export default function PrizesBlockPreview({ block, colors, hackathonId, isRTL }: PrizesBlockPreviewProps) {
  return (
    <section className="py-20 px-4" style={{ backgroundColor: colors.background }}>
      <div className="max-w-6xl mx-auto">
        <h2 className={cn(
          "text-4xl font-bold text-center mb-12",
          isRTL && "text-arabic"
        )} style={{ color: colors.text }}>
          {block.data.title}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {(block.data.prizes || []).map((prize: any, index: number) => (
            <Card key={index} className="p-8 text-center border-2 hover:border-indigo-500 transition-all">
              <Award className="w-16 h-16 mx-auto mb-4" style={{ color: colors.primary }} />
              <h3 className={cn("text-2xl font-bold mb-2", isRTL && "text-arabic")}>
                {prize.position}
              </h3>
              <div className="text-3xl font-bold mb-2" style={{ color: colors.primary }}>
                {prize.amount} {prize.currency}
              </div>
              <p className={cn("text-gray-600", isRTL && "text-arabic")}>
                {prize.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

