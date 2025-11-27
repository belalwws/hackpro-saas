'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Block } from '../BlockTypes'
import { cn } from '@/lib/utils'

interface FAQBlockPreviewProps {
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

export default function FAQBlockPreview({ block, colors, hackathonId, isRTL }: FAQBlockPreviewProps) {
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
          {(block.data.questions || []).map((faq: any, index: number) => (
            <Card key={index} className="p-6">
              <h3 className={cn("text-lg font-semibold mb-2", isRTL && "text-arabic")}>
                {faq.question}
              </h3>
              <p className={cn("text-gray-600", isRTL && "text-arabic")}>
                {faq.answer}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

