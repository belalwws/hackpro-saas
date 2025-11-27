'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Block } from '../BlockTypes'
import { cn } from '@/lib/utils'

interface AboutBlockPreviewProps {
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

export default function AboutBlockPreview({ block, colors, hackathonId, isRTL }: AboutBlockPreviewProps) {
  return (
    <section className="py-20 px-4" style={{ backgroundColor: colors.background }}>
      <div className="max-w-6xl mx-auto">
        <h2 className={cn(
          "text-4xl font-bold text-center mb-12",
          isRTL && "text-arabic"
        )} style={{ color: colors.text }}>
          {block.data.title}
        </h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {block.data.image && (
            <div>
              <img 
                src={block.data.image} 
                alt={block.data.title} 
                className="rounded-2xl shadow-xl w-full" 
              />
            </div>
          )}
          <div>
            <p className={cn(
              "text-lg leading-relaxed mb-8",
              isRTL && "text-arabic"
            )} style={{ color: colors.text }}>
              {block.data.description}
            </p>
            {block.data.features && block.data.features.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {block.data.features.map((feature: any, index: number) => (
                  <Card key={index} className="p-4 text-center">
                    <div className="text-4xl mb-2">{feature.icon || '✨'}</div>
                    <h3 className={cn("font-semibold mb-1", isRTL && "text-arabic")} style={{ color: colors.text }}>
                      {feature.title}
                    </h3>
                    <p className={cn("text-sm text-gray-600", isRTL && "text-arabic")}>
                      {feature.description}
                    </p>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

